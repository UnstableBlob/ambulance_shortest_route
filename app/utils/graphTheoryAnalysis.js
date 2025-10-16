/**
 * Graph Theory Analysis Utilities
 * Comprehensive Eulerian and Hamiltonian Path/Circuit Analysis
 * 
 * Mathematical Definitions:
 * - Eulerian Path: A path that visits every EDGE exactly once
 * - Eulerian Circuit: An Eulerian path that starts and ends at the same vertex
 * - Hamiltonian Path: A path that visits every VERTEX exactly once
 * - Hamiltonian Circuit: A Hamiltonian path that starts and ends at the same vertex
 */

/**
 * Calculate the degree of each vertex in an undirected graph
 * Degree = number of edges incident to a vertex
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects (unblocked only)
 * @returns {Object} Map of nodeId -> degree
 */
function calculateDegrees(nodes, edges) {
  const degrees = {};
  
  // Initialize all nodes with degree 0
  nodes.forEach(node => {
    degrees[node.id] = 0;
  });
  
  // Count edges for each node (undirected graph, so count both endpoints)
  edges.forEach(edge => {
    if (!edge.blocked) {
      degrees[edge.from]++;
      degrees[edge.to]++;
    }
  });
  
  return degrees;
}

/**
 * Check if the graph is connected using DFS
 * A graph is connected if there is a path between every pair of vertices
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} { connected: boolean, components: number }
 */
function isGraphConnected(nodes, edges) {
  if (nodes.length === 0) {
    return { connected: true, components: 0 };
  }
  
  if (nodes.length === 1) {
    return { connected: true, components: 1 };
  }
  
  // Build adjacency list
  const graph = {};
  nodes.forEach(node => {
    graph[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (!edge.blocked) {
      graph[edge.from].push(edge.to);
      graph[edge.to].push(edge.from);
    }
  });
  
  // DFS to find connected components
  const visited = new Set();
  let components = 0;
  
  function dfs(nodeId) {
    visited.add(nodeId);
    graph[nodeId].forEach(neighbor => {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    });
  }
  
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      components++;
      dfs(node.id);
    }
  });
  
  return {
    connected: components === 1,
    components
  };
}

/**
 * Analyze Eulerian properties of the graph
 * 
 * Theorem (Euler, 1736):
 * - A connected graph has an Eulerian Circuit if and only if every vertex has even degree
 * - A connected graph has an Eulerian Path if and only if it has exactly 0 or 2 vertices of odd degree
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} Eulerian analysis results
 */
export function analyzeEulerian(nodes, edges) {
  const activeEdges = edges.filter(e => !e.blocked);
  
  // Special case: no edges
  if (activeEdges.length === 0) {
    return {
      hasEulerianCircuit: nodes.length <= 1,
      hasEulerianPath: nodes.length <= 1,
      oddDegreeVertices: [],
      oddDegreeCount: 0,
      degrees: calculateDegrees(nodes, activeEdges),
      explanation: nodes.length === 0 
        ? "Empty graph (trivially Eulerian)"
        : nodes.length === 1
        ? "Single vertex with no edges (trivially Eulerian)"
        : "Graph has vertices but no edges (not connected, not Eulerian)",
      mathematicalReasoning: nodes.length <= 1
        ? "A graph with no edges or a single vertex is considered to have an Eulerian circuit by convention."
        : "Disconnected graph with isolated vertices cannot have an Eulerian path or circuit."
    };
  }
  
  const connectivity = isGraphConnected(nodes, activeEdges);
  const degrees = calculateDegrees(nodes, activeEdges);
  
  // Find vertices with odd degree
  const oddDegreeVertices = [];
  Object.keys(degrees).forEach(nodeId => {
    if (degrees[nodeId] % 2 === 1) {
      oddDegreeVertices.push(nodeId);
    }
  });
  
  const oddDegreeCount = oddDegreeVertices.length;
  
  // Apply Euler's theorem
  let hasEulerianCircuit = false;
  let hasEulerianPath = false;
  let explanation = "";
  let mathematicalReasoning = "";
  
  if (!connectivity.connected) {
    explanation = `Graph is not connected (${connectivity.components} components). Eulerian paths/circuits require connectivity.`;
    mathematicalReasoning = "Theorem: An Eulerian path or circuit can only exist in a connected graph, as it must traverse all edges, which is impossible across disconnected components.";
  } else if (oddDegreeCount === 0) {
    hasEulerianCircuit = true;
    hasEulerianPath = true;
    explanation = "Graph has an Eulerian Circuit (and therefore an Eulerian Path). All vertices have even degree.";
    mathematicalReasoning = "Euler's Theorem (1736): A connected graph has an Eulerian circuit if and only if every vertex has even degree. Since we can start and end at any vertex, an Eulerian circuit is also an Eulerian path.";
  } else if (oddDegreeCount === 2) {
    hasEulerianPath = true;
    explanation = `Graph has an Eulerian Path but NOT an Eulerian Circuit. Exactly 2 vertices (${oddDegreeVertices.join(', ')}) have odd degree.`;
    mathematicalReasoning = "Theorem: A connected graph has an Eulerian path if and only if it has exactly 0 or 2 vertices of odd degree. The path must start at one odd-degree vertex and end at the other. Since the start and end vertices are different, it cannot be a circuit.";
  } else {
    explanation = `Graph has neither Eulerian Path nor Circuit. ${oddDegreeCount} vertices have odd degree (need 0 or 2).`;
    mathematicalReasoning = `Mathematical Proof: A path entering a vertex must also leave it (except for start/end vertices). This requires even degree for all intermediate vertices. With ${oddDegreeCount} odd-degree vertices, we cannot construct an Eulerian path.`;
  }
  
  return {
    hasEulerianCircuit,
    hasEulerianPath,
    oddDegreeVertices,
    oddDegreeCount,
    degrees,
    connected: connectivity.connected,
    components: connectivity.components,
    explanation,
    mathematicalReasoning,
    startEndVertices: oddDegreeCount === 2 ? {
      start: oddDegreeVertices[0],
      end: oddDegreeVertices[1]
    } : null
  };
}

/**
 * Analyze Hamiltonian properties of the graph
 * 
 * Note: Unlike Eulerian paths, there is NO simple necessary and sufficient condition
 * for Hamiltonian paths/circuits. The problem is NP-complete.
 * 
 * We use several sufficient conditions and heuristics:
 * - Dirac's Theorem (1952): If n ≥ 3 and deg(v) ≥ n/2 for all v, then G has a Hamiltonian circuit
 * - Ore's Theorem (1960): If n ≥ 3 and deg(u) + deg(v) ≥ n for all non-adjacent u,v, then G has a Hamiltonian circuit
 * - For small graphs, we can use backtracking to find actual paths
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} Hamiltonian analysis results
 */
export function analyzeHamiltonian(nodes, edges) {
  const activeEdges = edges.filter(e => !e.blocked);
  const n = nodes.length;
  
  // Special cases
  if (n === 0) {
    return {
      hasHamiltonianCircuit: true,
      hasHamiltonianPath: true,
      certainty: "definite",
      explanation: "Empty graph (trivially Hamiltonian)",
      mathematicalReasoning: "By convention, an empty graph has a Hamiltonian circuit.",
      theoremApplied: "Convention",
      samplePath: []
    };
  }
  
  if (n === 1) {
    return {
      hasHamiltonianCircuit: true,
      hasHamiltonianPath: true,
      certainty: "definite",
      explanation: "Single vertex (trivially Hamiltonian)",
      mathematicalReasoning: "A single vertex trivially forms both a Hamiltonian path and circuit.",
      theoremApplied: "Convention",
      samplePath: [nodes[0].id]
    };
  }
  
  if (n === 2) {
    const hasEdge = activeEdges.some(e => 
      (e.from === nodes[0].id && e.to === nodes[1].id) ||
      (e.from === nodes[1].id && e.to === nodes[0].id)
    );
    return {
      hasHamiltonianCircuit: false,
      hasHamiltonianPath: hasEdge,
      certainty: "definite",
      explanation: hasEdge 
        ? "Two vertices connected by an edge form a Hamiltonian path but not a circuit (n=2)"
        : "Two vertices not connected - no Hamiltonian path",
      mathematicalReasoning: "A Hamiltonian circuit requires at least 3 vertices. With 2 vertices, only a Hamiltonian path is possible if they are connected.",
      theoremApplied: "Definition",
      samplePath: hasEdge ? [nodes[0].id, nodes[1].id] : null
    };
  }
  
  // Build adjacency list and check connectivity
  const graph = {};
  nodes.forEach(node => {
    graph[node.id] = new Set();
  });
  
  activeEdges.forEach(edge => {
    graph[edge.from].add(edge.to);
    graph[edge.to].add(edge.from);
  });
  
  const connectivity = isGraphConnected(nodes, activeEdges);
  const degrees = calculateDegrees(nodes, activeEdges);
  
  // If not connected, definitely no Hamiltonian path/circuit
  if (!connectivity.connected) {
    return {
      hasHamiltonianCircuit: false,
      hasHamiltonianPath: false,
      certainty: "definite",
      explanation: `Graph is not connected (${connectivity.components} components). Hamiltonian paths require visiting all vertices.`,
      mathematicalReasoning: "Theorem: A Hamiltonian path must visit all vertices, which is impossible in a disconnected graph as there is no path between vertices in different components.",
      theoremApplied: "Connectivity requirement",
      degrees,
      samplePath: null
    };
  }
  
  // Check Dirac's Theorem (sufficient condition for Hamiltonian circuit)
  const minDegree = Math.min(...Object.values(degrees));
  const diracCondition = minDegree >= n / 2;
  
  if (diracCondition && n >= 3) {
    return {
      hasHamiltonianCircuit: true,
      hasHamiltonianPath: true,
      certainty: "definite",
      explanation: `Graph has a Hamiltonian Circuit (by Dirac's Theorem). Minimum degree ${minDegree} ≥ n/2 = ${n/2}`,
      mathematicalReasoning: `Dirac's Theorem (1952): If G is a simple connected graph with n ≥ 3 vertices, and every vertex has degree at least n/2, then G has a Hamiltonian circuit. Since min(deg) = ${minDegree} ≥ ${n/2}, the condition is satisfied.`,
      theoremApplied: "Dirac's Theorem",
      degrees,
      minDegree,
      samplePath: "Guaranteed to exist (construction not computed)"
    };
  }
  
  // Check Ore's Theorem (another sufficient condition)
  let oreConditionSatisfied = true;
  const nodeIds = nodes.map(n => n.id);
  
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const u = nodeIds[i];
      const v = nodeIds[j];
      
      // Check if u and v are not adjacent
      if (!graph[u].has(v)) {
        const degreeSum = degrees[u] + degrees[v];
        if (degreeSum < n) {
          oreConditionSatisfied = false;
          break;
        }
      }
    }
    if (!oreConditionSatisfied) break;
  }
  
  if (oreConditionSatisfied && n >= 3) {
    return {
      hasHamiltonianCircuit: true,
      hasHamiltonianPath: true,
      certainty: "definite",
      explanation: "Graph has a Hamiltonian Circuit (by Ore's Theorem). For all non-adjacent vertices u,v: deg(u) + deg(v) ≥ n",
      mathematicalReasoning: `Ore's Theorem (1960): If G is a simple connected graph with n ≥ 3 vertices, and for every pair of non-adjacent vertices u and v, deg(u) + deg(v) ≥ n, then G has a Hamiltonian circuit.`,
      theoremApplied: "Ore's Theorem",
      degrees,
      samplePath: "Guaranteed to exist (construction not computed)"
    };
  }
  
  // For small graphs (n ≤ 8), use backtracking to find actual Hamiltonian path
  if (n <= 8) {
    const hamiltonianPath = findHamiltonianPath(nodes, graph);
    const hamiltonianCircuit = findHamiltonianCircuit(nodes, graph);
    
    return {
      hasHamiltonianCircuit: hamiltonianCircuit !== null,
      hasHamiltonianPath: hamiltonianPath !== null,
      certainty: "definite",
      explanation: hamiltonianCircuit 
        ? "Hamiltonian Circuit found by exhaustive search"
        : hamiltonianPath
        ? "Hamiltonian Path found (but no circuit) by exhaustive search"
        : "No Hamiltonian Path found by exhaustive search",
      mathematicalReasoning: hamiltonianCircuit
        ? "A Hamiltonian circuit was found through backtracking algorithm, visiting all vertices exactly once and returning to the start."
        : hamiltonianPath
        ? "A Hamiltonian path was found through backtracking algorithm, visiting all vertices exactly once, but no circuit exists."
        : "Exhaustive backtracking search of all possible paths found no Hamiltonian path. Since the search is complete for this graph size, we can definitively say no Hamiltonian path exists.",
      theoremApplied: "Backtracking Algorithm (Exhaustive Search)",
      degrees,
      samplePath: hamiltonianCircuit || hamiltonianPath
    };
  }
  
  // For larger graphs, provide heuristic analysis
  return {
    hasHamiltonianCircuit: "unknown",
    hasHamiltonianPath: "unknown",
    certainty: "unknown",
    explanation: "Graph is too large for exhaustive search, and doesn't satisfy known sufficient conditions (Dirac/Ore theorems)",
    mathematicalReasoning: `The Hamiltonian path problem is NP-complete (proven by Richard Karp, 1972). No polynomial-time algorithm is known. For this graph with ${n} vertices, exhaustive search is computationally infeasible. Neither Dirac's nor Ore's sufficient conditions are met.`,
    theoremApplied: "NP-completeness",
    degrees,
    minDegree,
    suggestion: "Try reducing graph size (≤8 vertices) for definite answer, or add more edges to satisfy Dirac's condition (all degrees ≥ n/2)"
  };
}

/**
 * Find a Hamiltonian path using backtracking
 * @param {Array} nodes - Array of nodes
 * @param {Object} graph - Adjacency list
 * @returns {Array|null} Path as array of node IDs, or null if none exists
 */
function findHamiltonianPath(nodes, graph) {
  const n = nodes.length;
  const nodeIds = nodes.map(n => n.id);
  
  // Try starting from each vertex
  for (let startIdx = 0; startIdx < n; startIdx++) {
    const visited = new Set();
    const path = [];
    
    if (hamiltonianPathDFS(nodeIds[startIdx], graph, visited, path, n)) {
      return path;
    }
  }
  
  return null;
}

/**
 * DFS helper for finding Hamiltonian path
 */
function hamiltonianPathDFS(current, graph, visited, path, targetLength) {
  visited.add(current);
  path.push(current);
  
  if (path.length === targetLength) {
    return true; // Found Hamiltonian path
  }
  
  const neighbors = Array.from(graph[current]);
  for (let neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      if (hamiltonianPathDFS(neighbor, graph, visited, path, targetLength)) {
        return true;
      }
    }
  }
  
  // Backtrack
  visited.delete(current);
  path.pop();
  return false;
}

/**
 * Find a Hamiltonian circuit using backtracking
 * @param {Array} nodes - Array of nodes
 * @param {Object} graph - Adjacency list
 * @returns {Array|null} Circuit as array of node IDs, or null if none exists
 */
function findHamiltonianCircuit(nodes, graph) {
  const n = nodes.length;
  const nodeIds = nodes.map(n => n.id);
  
  // Start from first vertex
  const start = nodeIds[0];
  const visited = new Set([start]);
  const path = [start];
  
  if (hamiltonianCircuitDFS(start, start, graph, visited, path, n)) {
    return path;
  }
  
  return null;
}

/**
 * DFS helper for finding Hamiltonian circuit
 */
function hamiltonianCircuitDFS(start, current, graph, visited, path, targetLength) {
  if (path.length === targetLength) {
    // Check if we can return to start
    if (graph[current].has(start)) {
      return true;
    }
    return false;
  }
  
  const neighbors = Array.from(graph[current]);
  for (let neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      path.push(neighbor);
      
      if (hamiltonianCircuitDFS(start, neighbor, graph, visited, path, targetLength)) {
        return true;
      }
      
      // Backtrack
      visited.delete(neighbor);
      path.pop();
    }
  }
  
  return false;
}
