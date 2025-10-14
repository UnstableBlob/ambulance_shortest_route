# 🚑 Ambulance Shortest Route Planner

A production-quality React/Next.js application for interactive graph visualization and pathfinding using Dijkstra's and Bellman-Ford algorithms. Built for simulating emergency route planning with real-time graph editing capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)
![React](https://img.shields.io/badge/React-19.1.0-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### Core Functionality
- **Interactive Graph Editing**: Add, remove, and reposition nodes and edges in real-time
- **Dual Pathfinding Algorithms**: 
  - Dijkstra's Algorithm for non-negative weights
  - Bellman-Ford Algorithm for graphs with negative weights (tolls)
- **Real-Time Path Calculation**: Instant shortest path updates on every graph change
- **Visual Feedback**: Color-coded nodes and edges with distinct styles for different states

### Advanced Features
- **Road Blocking**: Mark roads as blocked to simulate closures
- **Toll Roads**: Negative edge weights representing tolls or benefits
- **Algorithm Auto-Detection**: Automatically selects the appropriate algorithm based on edge weights
- **LocalStorage Persistence**: Save and restore graph state across sessions
- **Responsive Design**: Works on desktop and tablet devices
- **Comprehensive Legend**: Visual guide for understanding node and edge types

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
```bash
cd aoa_project
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

## 📖 Usage Guide

### Basic Workflow

1. **Building Your Network**
   - Click "➕ Add Node" to create intersection points
   - Click "🔗 Add Edge" to connect the two most recently added nodes
   - Drag nodes to reposition them on the canvas

2. **Setting Up Route**
   - Use the "🚑 Ambulance (Start)" dropdown to select the starting point
   - Use the "🏥 Hospital (Destination)" dropdown to select the endpoint
   - The shortest path will be calculated automatically

3. **Editing Roads**
   - Click any edge to open the editor modal
   - Adjust weight (distance/cost)
   - Toggle "Block this road" to simulate road closures
   - Use negative weights for tolls (requires Bellman-Ford)

4. **Viewing Results**
   - The shortest path is highlighted in green on the graph
   - Route Details panel shows:
     - Total distance/cost
     - Step-by-step breakdown
     - Edge-by-edge costs

### Advanced Features

#### Algorithm Selection
- **Auto-Detection (Recommended)**: Automatically chooses the best algorithm
- **Manual Selection**: Override with specific algorithm if needed
- **Warning System**: Alerts when using incompatible algorithm for graph type

#### Road Types
- **Normal Roads**: Gray edges with positive weights
- **Toll Roads**: Orange edges with negative weights
- **Blocked Roads**: Red dashed edges (excluded from pathfinding)
- **Shortest Path**: Green highlighted edges

#### Node Types
- **Normal Nodes**: Gray circular dots
- **Ambulance**: Blue star-shaped markers
- **Hospital**: Green diamond-shaped markers

## 🏗️ Project Structure

```
/app
  ├── page.jsx                      # Main application component
  ├── layout.js                     # Root layout
  ├── globals.css                   # Global styles
  │
  ├── components/
  │   ├── GraphVisualizer.jsx       # Vis.js graph renderer
  │   ├── ControlPanel.jsx          # Graph editing controls
  │   ├── RouteDetails.jsx          # Path result display
  │   ├── EdgeEditorModal.jsx       # Edge property editor
  │   ├── AlgorithmSelector.jsx     # Algorithm selection UI
  │   └── Legend.jsx                # Visual legend component
  │
  └── utils/
      ├── dijkstra.js               # Dijkstra's algorithm implementation
      └── bellmanFord.js            # Bellman-Ford algorithm implementation
```

## 🧮 Algorithm Details

### Dijkstra's Algorithm
- **Use Case**: Graphs with non-negative edge weights
- **Time Complexity**: O((V + E) log V)
- **Space Complexity**: O(V)
- **Advantages**: Fast and efficient for typical road networks
- **Limitations**: Cannot handle negative weights

### Bellman-Ford Algorithm
- **Use Case**: Graphs with negative edge weights (tolls)
- **Time Complexity**: O(V × E)
- **Space Complexity**: O(V)
- **Advantages**: Handles negative weights, detects negative cycles
- **Limitations**: Slower than Dijkstra for large graphs

## 🎨 Component Architecture

### State Management
- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Local State**: All state managed within main component
- **Persistence**: LocalStorage for graph state

### Component Communication
```
page.jsx (Main)
    ├── GraphVisualizer (displays graph, emits events)
    ├── ControlPanel (user controls, triggers actions)
    ├── RouteDetails (displays computed path)
    ├── EdgeEditorModal (edit edge properties)
    ├── AlgorithmSelector (choose algorithm)
    └── Legend (visual guide)
```

### Data Flow
1. User interacts with ControlPanel or GraphVisualizer
2. Event handlers in page.jsx update state
3. State changes trigger re-renders
4. useEffect hooks recalculate shortest path
5. Updated results displayed in RouteDetails

## 🛠️ Technical Stack

### Core Technologies
- **Next.js 15.5.5**: React framework with App Router
- **React 19.1.0**: UI library with hooks
- **Vis.js (vis-network 9.1.9)**: Graph visualization
- **Tailwind CSS 4**: Utility-first styling
- **UUID 9.0.1**: Unique ID generation

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundler (dev mode)

## 📊 Example Scenarios

### Scenario 1: Basic Route Finding
1. Load sample graph
2. Select Node A as ambulance
3. Select Node F as hospital
4. View calculated shortest path (A → C → B → D → E → F)

### Scenario 2: Road Closure
1. Click edge between D and E
2. Toggle "Block this road"
3. Watch path recalculate to avoid blocked road

### Scenario 3: Toll Roads
1. Click any edge
2. Set weight to negative value (e.g., -2)
3. Algorithm automatically switches to Bellman-Ford
4. View reduced total cost due to toll benefit

## 🔧 Configuration

### Customization Options

**Graph Physics** (in GraphVisualizer.jsx):
```javascript
physics: {
  barnesHut: {
    gravitationalConstant: -2000,
    springConstant: 0.001,
    springLength: 200
  }
}
```

**Node Appearance**:
- Modify `getNodeColor()` function for custom colors
- Adjust `getNodeShape()` for different shapes
- Change size in node configuration

**Edge Styling**:
- Update `getEdgeColor()` for custom edge colors
- Modify dash patterns in edge configuration
- Adjust line widths

## 🐛 Troubleshooting

### Common Issues

**Issue**: Graph not rendering
- **Solution**: Ensure vis-network is installed and GraphVisualizer uses dynamic import

**Issue**: Path not updating
- **Solution**: Check that ambulance and hospital nodes are properly selected

**Issue**: LocalStorage not persisting
- **Solution**: Verify browser allows localStorage, check browser console for errors

**Issue**: Algorithm warning appearing incorrectly
- **Solution**: Ensure all edge weights are properly set (positive or negative)

## 📝 Development Notes

### Best Practices
- Always use unique IDs for nodes and edges
- Validate user input before state updates
- Use memoization for expensive calculations
- Batch state updates when possible

### Performance Optimization
- Dynamic import for vis-network (avoids SSR issues)
- useMemo for negative weight detection
- useCallback for stable function references
- Efficient edge/node lookup with filter/find

### Future Enhancements
- [ ] Undo/Redo functionality
- [ ] Multiple ambulance support
- [ ] Alternative route display
- [ ] Export/Import graph as JSON
- [ ] Mobile touch controls
- [ ] Graph templates library
- [ ] A* algorithm implementation
- [ ] Real map integration

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional pathfinding algorithms (A*, Floyd-Warshall)
- Enhanced UI/UX with animations
- Mobile responsive improvements
- Unit tests and integration tests
- Performance optimizations for large graphs

## 👨‍💻 Author

Built with ❤️ using React, Next.js, and Graph Theory

## 🙏 Acknowledgments

- **Vis.js**: Powerful graph visualization library
- **Next.js Team**: Excellent React framework
- **Tailwind CSS**: Beautiful utility-first CSS
- **Graph Theory**: Foundation for pathfinding algorithms

---

**Happy Pathfinding! 🚑🏥**
