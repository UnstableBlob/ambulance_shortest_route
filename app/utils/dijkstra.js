/**
 * Dijkstra's Algorithm Implementation
 * Finds the shortest path in a graph with non-negative edge weights
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {string} startId - Starting node ID
 * @param {string} endId - Destination node ID
 * @returns {Object} - { path: [], totalCost: number, steps: [], found: boolean }
 */
export function dijkstra(nodes, edges, startId, endId) {
  if (!startId || !endId || startId === endId) {
    return { path: [], totalCost: 0, steps: [], found: false };
  }

  // Build adjacency list from edges (excluding blocked edges)
  const graph = {};
  nodes.forEach(node => {
    graph[node.id] = [];
  });

  edges.forEach(edge => {
    if (!edge.blocked) {
      graph[edge.from].push({ node: edge.to, weight: edge.weight, edgeId: edge.id });
      // Undirected graph: add reverse edge
      graph[edge.to].push({ node: edge.from, weight: edge.weight, edgeId: edge.id });
    }
  });

  // Check if start and end nodes exist
  if (!graph[startId] || !graph[endId]) {
    return { path: [], totalCost: 0, steps: [], found: false };
  }

  // Initialize distances and previous nodes
  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = []; // Priority queue (min-heap simulation)

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startId] = 0;

  pq.push({ node: startId, distance: 0 });

  while (pq.length > 0) {
    // Sort to simulate min-heap (for production, use a proper heap implementation)
    pq.sort((a, b) => a.distance - b.distance);
    const { node: currentNode, distance: currentDistance } = pq.shift();

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    // Early exit if we reached the destination
    if (currentNode === endId) break;

    // Skip if we found a better path already
    if (currentDistance > distances[currentNode]) continue;

    // Explore neighbors
    graph[currentNode].forEach(({ node: neighbor, weight }) => {
      if (visited.has(neighbor)) return;

      const newDistance = distances[currentNode] + weight;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
        pq.push({ node: neighbor, distance: newDistance });
      }
    });
  }

  // Reconstruct path
  if (distances[endId] === Infinity) {
    return { path: [], totalCost: 0, steps: [], found: false };
  }

  const path = [];
  let current = endId;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
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
    found: true
  };
}

/**
 * Check if graph has negative weights
 * @param {Array} edges - Array of edge objects
 * @returns {boolean}
 */
export function hasNegativeWeights(edges) {
  return edges.some(edge => !edge.blocked && edge.weight < 0);
}
