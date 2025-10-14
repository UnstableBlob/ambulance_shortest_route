/**
 * Bellman-Ford Algorithm Implementation
 * Finds the shortest path in a graph with negative edge weights
 * Can detect negative cycles
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {string} startId - Starting node ID
 * @param {string} endId - Destination node ID
 * @returns {Object} - { path: [], totalCost: number, steps: [], found: boolean, hasNegativeCycle: boolean }
 */
export function bellmanFord(nodes, edges, startId, endId) {
  if (!startId || !endId || startId === endId) {
    return { path: [], totalCost: 0, steps: [], found: false, hasNegativeCycle: false };
  }

  // Initialize distances and previous nodes
  const distances = {};
  const previous = {};
  
  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startId] = 0;

  // Filter out blocked edges
  const activeEdges = edges.filter(edge => !edge.blocked);

  // Create bidirectional edges (undirected graph)
  const bidirectionalEdges = [];
  activeEdges.forEach(edge => {
    bidirectionalEdges.push({ from: edge.from, to: edge.to, weight: edge.weight, id: edge.id });
    bidirectionalEdges.push({ from: edge.to, to: edge.from, weight: edge.weight, id: edge.id });
  });

  // Relax edges |V| - 1 times
  const nodeCount = nodes.length;
  for (let i = 0; i < nodeCount - 1; i++) {
    let updated = false;
    
    bidirectionalEdges.forEach(edge => {
      const { from, to, weight } = edge;
      
      if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
        distances[to] = distances[from] + weight;
        previous[to] = from;
        updated = true;
      }
    });

    // Early termination if no updates occurred
    if (!updated) break;
  }

  // Check for negative weight cycles
  let hasNegativeCycle = false;
  bidirectionalEdges.forEach(edge => {
    const { from, to, weight } = edge;
    
    if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
      hasNegativeCycle = true;
    }
  });

  if (hasNegativeCycle) {
    return {
      path: [],
      totalCost: 0,
      steps: [],
      found: false,
      hasNegativeCycle: true,
      error: 'Negative weight cycle detected in the graph'
    };
  }

  // Reconstruct path
  if (distances[endId] === Infinity) {
    return { path: [], totalCost: 0, steps: [], found: false, hasNegativeCycle: false };
  }

  const path = [];
  let current = endId;
  const visited = new Set(); // Prevent infinite loops

  while (current !== null && !visited.has(current)) {
    visited.add(current);
    path.unshift(current);
    current = previous[current];
  }

  // Verify path starts with startId
  if (path[0] !== startId) {
    return { path: [], totalCost: 0, steps: [], found: false, hasNegativeCycle: false };
  }

  // Build steps with edge details
  const steps = [];
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const edge = edges.find(
      e => (e.from === from && e.to === to) || (e.to === from && e.from === to)
    );
    if (edge) {
      steps.push({
        from,
        to,
        cost: edge.weight,
        edgeId: edge.id
      });
    }
  }

  return {
    path,
    totalCost: distances[endId],
    steps,
    found: true,
    hasNegativeCycle: false
  };
}
