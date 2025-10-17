/**
 * Bellman-Ford Algorithm Implementation
 * Finds the shortest path in a graph with negative edge weights
 * Can detect negative cycles
 *
 * @param {Array} nodes - Array of node objects with 'id' property
 * @param {Array} edges - Array of edge objects with 'from', 'to', 'weight', 'id', 'blocked' properties
 * @param {string} startId - Starting node ID
 * @param {string} endId - Destination node ID
 * @returns {Object} - { path: [], totalCost: number, steps: [], found: boolean, hasNegativeCycle: boolean }
 */
export function bellmanFord(nodes, edges, startId, endId) {
  // Input validation
  if (!nodes || !edges || nodes.length === 0) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: false,
      error: 'Invalid input: nodes and edges are required'
    };
  }

  if (!startId || !endId) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: false,
      error: 'Start and end node IDs are required'
    };
  }

  if (startId === endId) {
    return {
      path: [startId],
      totalCost: 0,
      steps: [],
      found: true,
      hasNegativeCycle: false
    };
  }

  // Verify start and end nodes exist
  const nodeIds = new Set(nodes.map(n => n.id));
  if (!nodeIds.has(startId) || !nodeIds.has(endId)) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: false,
      error: 'Start or end node not found in graph'
    };
  }

  // Initialize distances and predecessors
  const distances = {};
  const previous = {};
  const nodeCount = nodes.length;

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startId] = 0;

  // Filter active edges and create bidirectional edges
  const activeEdges = edges.filter(edge => !edge.blocked);
  const bidirectionalEdges = [];
  const edgeMap = new Map(); // For faster edge lookup during path reconstruction

  activeEdges.forEach(edge => {
    // Forward direction
    bidirectionalEdges.push({
      from: edge.from,
      to: edge.to,
      weight: edge.weight,
      id: edge.id
    });
    
    // Backward direction
    bidirectionalEdges.push({
      from: edge.to,
      to: edge.from,
      weight: edge.weight,
      id: edge.id
    });

    // Store in map for quick lookup (use sorted key to handle both directions)
    const key1 = `${edge.from}-${edge.to}`;
    const key2 = `${edge.to}-${edge.from}`;
    edgeMap.set(key1, edge);
    edgeMap.set(key2, edge);
  });

  if (bidirectionalEdges.length === 0) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: false,
      error: 'No active edges in graph'
    };
  }

  // Relax edges |V| - 1 times
  for (let iteration = 0; iteration < nodeCount - 1; iteration++) {
    let updated = false;

    for (const edge of bidirectionalEdges) {
      const { from, to, weight } = edge;

      // Relax edge if possible
      if (distances[from] !== Infinity) {
        const newDistance = distances[from] + weight;
        if (newDistance < distances[to]) {
          distances[to] = newDistance;
          previous[to] = from;
          updated = true;
        }
      }
    }

    // Early termination: if no updates in this iteration, we're done
    if (!updated) {
      break;
    }
  }

  // Check for negative weight cycles
  const nodesInNegativeCycle = new Set();
  
  for (const edge of bidirectionalEdges) {
    const { from, to, weight } = edge;

    if (distances[from] !== Infinity) {
      const newDistance = distances[from] + weight;
      if (newDistance < distances[to]) {
        // Found a node that can still be relaxed - it's in a negative cycle
        nodesInNegativeCycle.add(to);
      }
    }
  }

  // If negative cycle exists, propagate to find all affected nodes
  if (nodesInNegativeCycle.size > 0) {
    // Run additional iterations to find all nodes affected by negative cycles
    for (let i = 0; i < nodeCount; i++) {
      for (const edge of bidirectionalEdges) {
        const { from, to } = edge;
        if (nodesInNegativeCycle.has(from)) {
          nodesInNegativeCycle.add(to);
        }
      }
    }

    // Check if the destination is affected by a negative cycle
    if (nodesInNegativeCycle.has(endId)) {
      return {
        path: [],
        totalCost: -Infinity,
        steps: [],
        found: false,
        hasNegativeCycle: true,
        error: 'Destination is affected by a negative weight cycle'
      };
    }
  }

  // Check if destination is reachable
  if (distances[endId] === Infinity) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: nodesInNegativeCycle.size > 0
    };
  }

  // Reconstruct path from end to start
  const path = [];
  let current = endId;
  const visited = new Set();

  while (current !== null) {
    // Detect cycles in path reconstruction (shouldn't happen with correct algorithm)
    if (visited.has(current)) {
      return {
        path: [],
        totalCost: 0,
        steps: [],
        found: false,
        hasNegativeCycle: false,
        error: 'Cycle detected in path reconstruction'
      };
    }

    visited.add(current);
    path.unshift(current);
    current = previous[current];
  }

  // Verify path is valid
  if (path.length === 0 || path[0] !== startId || path[path.length - 1] !== endId) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: nodesInNegativeCycle.size > 0
    };
  }

  // Build steps with edge details
  const steps = [];
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const edgeKey = `${from}-${to}`;
    const edge = edgeMap.get(edgeKey);

    if (edge) {
      steps.push({
        from,
        to,
        cost: edge.weight,
        edgeId: edge.id
      });
    } else {
      // This shouldn't happen if algorithm is correct
      console.warn(`Edge not found for ${from} -> ${to}`);
    }
  }

  return {
    path,
    totalCost: distances[endId],
    steps,
    found: true,
    hasNegativeCycle: nodesInNegativeCycle.size > 0
  };
}