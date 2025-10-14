# Technical Documentation
# Ambulance Shortest Route Planner

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Details](#component-details)
3. [Algorithm Implementation](#algorithm-implementation)
4. [State Management](#state-management)
5. [Event Flow](#event-flow)
6. [Data Structures](#data-structures)
7. [Performance Considerations](#performance-considerations)

---

## Architecture Overview

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         page.jsx                             │
│                    (Main Application)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   State      │  │   Handlers   │  │   Effects       │  │
│  │   - nodes    │  │   - Add      │  │   - Initialize  │  │
│  │   - edges    │  │   - Delete   │  │   - Calculate   │  │
│  │   - selected │  │   - Update   │  │   - Save        │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Child Components                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │ Control  │ │  Graph   │ │  Route   │ │Algorithm │ │ │
│  │  │  Panel   │ │Visualizer│ │ Details  │ │ Selector │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15.5.5 | React framework with App Router |
| UI Library | React 19.1.0 | Component-based UI |
| Visualization | Vis.js Network 9.1.9 | Interactive graph rendering |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Utilities | UUID 9.0.1 | Unique identifier generation |

---

## Component Details

### 1. page.jsx (Main Component)

**Responsibilities:**
- Central state management
- Business logic coordination
- Child component orchestration
- LocalStorage persistence

**Key State Variables:**
```javascript
const [nodes, setNodes] = useState([])           // Graph nodes
const [edges, setEdges] = useState([])           // Graph edges
const [selectedNodeId, setSelectedNodeId]        // Current selected node
const [selectedEdgeId, setSelectedEdgeId]        // Current selected edge
const [ambulanceId, setAmbulanceId]              // Start node
const [hospitalId, setHospitalId]                // End node
const [algorithm, setAlgorithm]                  // Active algorithm
const [routeResult, setRouteResult]              // Path calculation result
```

**Critical Methods:**
- `initializeSampleGraph()`: Creates demo graph
- `calculateShortestPath()`: Triggers pathfinding
- `handleAddNode()`: Adds new graph node
- `handleAddEdge()`: Connects two nodes
- `handleDeleteNode()`: Removes node and connected edges
- `handleSetAmbulance()`: Assigns start point
- `handleSetHospital()`: Assigns destination
- `handleSaveEdge()`: Updates edge properties

---

### 2. GraphVisualizer.jsx

**Purpose:** Renders interactive graph using Vis.js

**Props Interface:**
```javascript
{
  nodes: Array<Node>,              // Node data
  edges: Array<Edge>,              // Edge data
  shortestPath: Array<string>,     // Path node IDs
  onNodeSelect: (id) => void,      // Node click handler
  onEdgeSelect: (id) => void,      // Edge click handler
  onNodeMove: (id, pos) => void    // Node drag handler
}
```

**Key Features:**
- Dynamic node/edge styling based on state
- Real-time visual updates
- Interactive drag-and-drop
- Zoom and pan controls

**Vis.js Configuration:**
```javascript
const options = {
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      springConstant: 0.001,
      springLength: 200
    }
  },
  interaction: {
    hover: true,
    dragNodes: true,
    dragView: true,
    zoomView: true
  }
}
```

**Color Coding Logic:**
```javascript
// Node Colors
'ambulance' → Blue (#3b82f6)
'hospital'  → Green (#10b981)
'normal'    → Gray (#6b7280)

// Edge Colors
inPath      → Green (#10b981)
blocked     → Red (#ef4444)
toll        → Orange (#f59e0b)
normal      → Gray (#6b7280)
```

---

### 3. ControlPanel.jsx

**Purpose:** User interface for graph manipulation

**Features:**
- Add/delete nodes and edges
- Node role assignment (ambulance/hospital)
- Selection status display
- Algorithm status indicator

**UI Components:**
- Action buttons (Add Node, Add Edge, Delete)
- Dropdown selectors (Ambulance, Hospital)
- Status panels (selected items, warnings)
- Quick guide section

---

### 4. RouteDetails.jsx

**Purpose:** Display pathfinding results

**Display Sections:**
1. **Algorithm Badge**: Shows active algorithm
2. **Total Cost**: Highlighted metric
3. **Path Overview**: Visual node sequence
4. **Step-by-Step**: Detailed edge breakdown
5. **Statistics**: Summary metrics

**Conditional Rendering:**
```javascript
// No route selected
if (!routeResult) → Display prompt

// Negative cycle detected
if (hasNegativeCycle) → Show error

// No path found
if (!found) → Show warning

// Success
if (found) → Display full details
```

---

### 5. EdgeEditorModal.jsx

**Purpose:** Modal for editing edge properties

**Editable Properties:**
- `weight`: Numeric value (positive or negative)
- `blocked`: Boolean toggle

**Validation:**
- Weight must be a valid number
- Displays warnings for negative weights
- Visual feedback for blocked status

**Quick Presets:**
- Default (1): Standard road
- Far (5): Long distance
- Toll (-2): Negative weight

---

### 6. AlgorithmSelector.jsx

**Purpose:** Algorithm selection and information display

**Features:**
- Auto-detection toggle
- Manual algorithm selection
- Comparison table
- Detection reasoning display

**Auto-Detection Logic:**
```javascript
if (hasNegativeWeights) {
  algorithm = 'bellman-ford'
} else {
  algorithm = 'dijkstra'
}
```

---

### 7. Legend.jsx

**Purpose:** Visual guide for node and edge types

**Displays:**
- Node type indicators
- Edge type samples
- Weight information
- Interaction guide

---

## Algorithm Implementation

### Dijkstra's Algorithm

**File:** `app/utils/dijkstra.js`

**Function Signature:**
```javascript
dijkstra(nodes, edges, startId, endId) → {
  path: string[],
  totalCost: number,
  steps: Step[],
  found: boolean
}
```

**Implementation Details:**

1. **Graph Construction:**
```javascript
// Build adjacency list
const graph = {}
edges.forEach(edge => {
  if (!edge.blocked) {
    graph[edge.from].push({ node: edge.to, weight: edge.weight })
    graph[edge.to].push({ node: edge.from, weight: edge.weight })
  }
})
```

2. **Initialization:**
```javascript
const distances = {} // All nodes → Infinity
const previous = {}  // All nodes → null
const visited = new Set()
distances[startId] = 0
```

3. **Main Loop:**
```javascript
while (pq.length > 0) {
  const { node: current, distance } = extractMin(pq)
  
  if (visited.has(current)) continue
  visited.add(current)
  
  if (current === endId) break // Early exit
  
  for (neighbor of graph[current]) {
    const newDistance = distances[current] + neighbor.weight
    if (newDistance < distances[neighbor.node]) {
      distances[neighbor.node] = newDistance
      previous[neighbor.node] = current
      pq.push({ node: neighbor.node, distance: newDistance })
    }
  }
}
```

4. **Path Reconstruction:**
```javascript
const path = []
let current = endId
while (current !== null) {
  path.unshift(current)
  current = previous[current]
}
```

**Time Complexity:** O((V + E) log V)
**Space Complexity:** O(V)

---

### Bellman-Ford Algorithm

**File:** `app/utils/bellmanFord.js`

**Function Signature:**
```javascript
bellmanFord(nodes, edges, startId, endId) → {
  path: string[],
  totalCost: number,
  steps: Step[],
  found: boolean,
  hasNegativeCycle: boolean
}
```

**Implementation Details:**

1. **Initialization:**
```javascript
const distances = {} // All nodes → Infinity
const previous = {}  // All nodes → null
distances[startId] = 0
```

2. **Bidirectional Edge Creation:**
```javascript
const bidirectionalEdges = []
edges.forEach(edge => {
  if (!edge.blocked) {
    bidirectionalEdges.push({ from: edge.from, to: edge.to, weight: edge.weight })
    bidirectionalEdges.push({ from: edge.to, to: edge.from, weight: edge.weight })
  }
})
```

3. **Relaxation (V-1 iterations):**
```javascript
for (let i = 0; i < nodeCount - 1; i++) {
  let updated = false
  
  bidirectionalEdges.forEach(edge => {
    if (distances[edge.from] !== Infinity) {
      const newDist = distances[edge.from] + edge.weight
      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist
        previous[edge.to] = edge.from
        updated = true
      }
    }
  })
  
  if (!updated) break // Early termination
}
```

4. **Negative Cycle Detection:**
```javascript
bidirectionalEdges.forEach(edge => {
  if (distances[edge.from] !== Infinity) {
    const newDist = distances[edge.from] + edge.weight
    if (newDist < distances[edge.to]) {
      hasNegativeCycle = true
    }
  }
})
```

**Time Complexity:** O(V × E)
**Space Complexity:** O(V)

---

## State Management

### State Flow Diagram

```
User Action
    ↓
Event Handler
    ↓
State Update (setState)
    ↓
React Re-render
    ↓
useEffect Triggers
    ↓
Path Recalculation
    ↓
UI Update
```

### Critical useEffect Hooks

1. **Initialization:**
```javascript
useEffect(() => {
  const savedData = loadFromLocalStorage()
  if (savedData) {
    // Restore state
  } else {
    initializeSampleGraph()
  }
}, [])
```

2. **Persistence:**
```javascript
useEffect(() => {
  if (nodes.length > 0) {
    saveToLocalStorage({ nodes, edges, ambulanceId, hospitalId })
  }
}, [nodes, edges, ambulanceId, hospitalId])
```

3. **Algorithm Auto-Detection:**
```javascript
useEffect(() => {
  if (autoDetectAlgorithm) {
    setAlgorithm(hasNegativeWeights ? 'bellman-ford' : 'dijkstra')
  }
}, [hasNegativeWeights, autoDetectAlgorithm])
```

4. **Path Calculation:**
```javascript
useEffect(() => {
  if (ambulanceId && hospitalId) {
    calculateShortestPath()
  }
}, [nodes, edges, ambulanceId, hospitalId, algorithm])
```

### Performance Optimizations

**useMemo:**
```javascript
const graphHasNegativeWeights = useMemo(() => {
  return hasNegativeWeights(edges)
}, [edges])
```

**useCallback:**
```javascript
const calculateShortestPath = useCallback(() => {
  // Pathfinding logic
}, [nodes, edges, ambulanceId, hospitalId, algorithm])
```

---

## Data Structures

### Node Structure
```javascript
{
  id: string,           // Unique identifier (e.g., 'A', 'N1')
  label: string,        // Display name (e.g., 'Node A')
  type: 'normal' | 'ambulance' | 'hospital'
}
```

### Edge Structure
```javascript
{
  id: string,           // UUID
  from: string,         // Source node ID
  to: string,           // Target node ID
  weight: number,       // Cost/distance (can be negative)
  blocked: boolean      // Whether edge is traversable
}
```

### Route Result Structure
```javascript
{
  path: string[],       // Ordered array of node IDs
  totalCost: number,    // Sum of edge weights
  steps: Array<{        // Edge-by-edge breakdown
    from: string,
    to: string,
    cost: number,
    edgeId: string
  }>,
  found: boolean,       // Whether path exists
  hasNegativeCycle?: boolean,  // Bellman-Ford only
  error?: string        // Error message if applicable
}
```

---

## Event Flow

### Add Node Flow
```
1. User clicks "Add Node" button
2. handleAddNode() executes
3. New node object created with unique ID
4. setNodes([...nodes, newNode])
5. React re-renders GraphVisualizer
6. Vis.js network updates
7. State saved to localStorage
```

### Edge Edit Flow
```
1. User clicks on edge in graph
2. onEdgeSelect(edgeId) triggered
3. EdgeEditorModal opens with edge data
4. User modifies weight/blocked status
5. User clicks "Save"
6. handleSaveEdge(updatedEdge) executes
7. setEdges(updated edges array)
8. useEffect triggers path recalculation
9. UI updates with new path
10. Changes persisted to localStorage
```

### Path Calculation Flow
```
1. Dependency change detected (nodes, edges, selections, algorithm)
2. useEffect hook fires
3. calculateShortestPath() called
4. Algorithm determined (Dijkstra or Bellman-Ford)
5. Pathfinding function executed
6. Result object returned
7. setRouteResult(result)
8. GraphVisualizer re-renders with highlighted path
9. RouteDetails displays results
```

---

## Performance Considerations

### Optimization Strategies

1. **Dynamic Import for vis-network:**
```javascript
const GraphVisualizer = dynamic(() => import('./components/GraphVisualizer'), {
  ssr: false
})
```
- Prevents SSR issues
- Reduces initial bundle size
- Improves Time to Interactive (TTI)

2. **Memoization:**
```javascript
const graphHasNegativeWeights = useMemo(...)
const calculateShortestPath = useCallback(...)
```
- Prevents unnecessary recalculations
- Reduces re-renders
- Improves performance for large graphs

3. **Efficient Array Operations:**
```javascript
// Good: O(n)
edges.filter(e => e.id !== selectedEdgeId)

// Avoid: O(n²)
edges.forEach(e => edges.forEach(...))
```

4. **Early Termination:**
```javascript
// Dijkstra
if (current === endId) break

// Bellman-Ford
if (!updated) break
```

### Scalability Limits

| Graph Size | Dijkstra Performance | Bellman-Ford Performance |
|------------|---------------------|-------------------------|
| 10 nodes, 20 edges | < 1ms | < 5ms |
| 50 nodes, 100 edges | < 10ms | < 50ms |
| 100 nodes, 200 edges | < 30ms | < 200ms |
| 500 nodes, 1000 edges | < 200ms | < 3000ms |

### Memory Usage

- **State Storage:** O(V + E)
- **Dijkstra Overhead:** O(V)
- **Bellman-Ford Overhead:** O(V)
- **Vis.js Rendering:** O(V + E)

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core App | ✅ | ✅ | ✅ | ✅ |
| Vis.js | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| Dynamic Import | ✅ | ✅ | ✅ | ✅ |

**Minimum Versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Security Considerations

### Input Validation
- Node IDs validated before operations
- Edge weights parsed as numbers
- State mutations through controlled handlers only

### XSS Prevention
- No dangerouslySetInnerHTML used
- All user input escaped by React
- No eval() or Function() constructors

### Data Privacy
- All data stored locally (localStorage)
- No external API calls
- No user tracking

---

## Testing Recommendations

### Unit Tests
```javascript
// dijkstra.test.js
test('finds shortest path', () => {
  const result = dijkstra(nodes, edges, 'A', 'F')
  expect(result.found).toBe(true)
  expect(result.path).toEqual(['A', 'C', 'B', 'D', 'E', 'F'])
})

// bellmanFord.test.js
test('handles negative weights', () => {
  const result = bellmanFord(nodes, edges, 'A', 'F')
  expect(result.hasNegativeCycle).toBe(false)
})
```

### Integration Tests
- Graph visualization renders correctly
- Node/edge manipulation updates state
- Path calculation triggers on changes
- LocalStorage persistence works

### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Performance under load
- Accessibility compliance

---

## Deployment

### Build Command
```bash
npm run build
```

### Production Optimizations
- Static page generation
- Image optimization
- CSS minification
- JavaScript code splitting

### Environment Variables
None required for basic operation

---

## Maintenance

### Code Quality
- Follow React best practices
- Use TypeScript (optional upgrade)
- Implement ESLint rules
- Document complex logic

### Version Control
- Semantic versioning
- Feature branches
- Pull request reviews
- Changelog maintenance

---

**Last Updated:** October 13, 2025
**Version:** 1.0.0
