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
  
  // Apply Euler's theorem with DETAILED step-by-step solving
  let hasEulerianCircuit = false;
  let hasEulerianPath = false;
  let explanation = "";
  let mathematicalReasoning = "";
  let solvingSteps = [];
  
  // Step 1: Check connectivity
  solvingSteps.push({
    step: 1,
    title: "Check Graph Connectivity",
    description: `Used Depth-First Search (DFS) to verify connectivity`,
    result: connectivity.connected 
      ? `✓ Graph is CONNECTED (${connectivity.components} component)` 
      : `✗ Graph is DISCONNECTED (${connectivity.components} components)`,
    passed: connectivity.connected
  });
  
  // Step 2: Calculate vertex degrees
  const degreeList = Object.entries(degrees).map(([id, deg]) => `${id}:${deg}`).join(', ');
  solvingSteps.push({
    step: 2,
    title: "Calculate Vertex Degrees",
    description: "Counted edges incident to each vertex",
    result: `Degrees: {${degreeList}}`,
    details: `Total vertices: ${nodes.length}, Total edges: ${activeEdges.length}`
  });
  
  // Step 3: Identify odd-degree vertices
  solvingSteps.push({
    step: 3,
    title: "Identify Odd-Degree Vertices",
    description: "Found vertices where degree is an odd number",
    result: oddDegreeCount === 0 
      ? "✓ No odd-degree vertices (all even)" 
      : oddDegreeCount === 2
      ? `Found exactly 2 odd-degree vertices: ${oddDegreeVertices.join(', ')}`
      : `Found ${oddDegreeCount} odd-degree vertices: ${oddDegreeVertices.join(', ')}`,
    passed: oddDegreeCount === 0 || oddDegreeCount === 2
  });
  
  // Step 4: Apply Euler's Theorem
  if (!connectivity.connected) {
    solvingSteps.push({
      step: 4,
      title: "Apply Euler's Theorem",
      description: "Graph must be connected for Eulerian properties",
      result: "✗ FAILED - Graph is disconnected",
      conclusion: "No Eulerian path or circuit can exist"
    });
    
    explanation = `Graph is not connected (${connectivity.components} components). Eulerian paths/circuits require connectivity.`;
    mathematicalReasoning = "Theorem: An Eulerian path or circuit can only exist in a connected graph, as it must traverse all edges, which is impossible across disconnected components.";
  } else if (oddDegreeCount === 0) {
    hasEulerianCircuit = true;
    hasEulerianPath = true;
    
    solvingSteps.push({
      step: 4,
      title: "Apply Euler's Theorem (Circuit)",
      description: "Connected graph + all even degrees ⟹ Eulerian Circuit",
      result: "✓ PASSED - All vertices have even degree",
      conclusion: "Eulerian Circuit EXISTS"
    });
    
    solvingSteps.push({
      step: 5,
      title: "Check for Eulerian Path",
      description: "An Eulerian Circuit is also an Eulerian Path",
      result: "✓ Eulerian Path also EXISTS",
      conclusion: "Can start at any vertex and traverse all edges exactly once, returning to start"
    });
    
    explanation = "Graph has an Eulerian Circuit (and therefore an Eulerian Path). All vertices have even degree.";
    mathematicalReasoning = "Euler's Theorem (1736): A connected graph has an Eulerian circuit if and only if every vertex has even degree. Since we can start and end at any vertex, an Eulerian circuit is also an Eulerian path.";
  } else if (oddDegreeCount === 2) {
    hasEulerianPath = true;
    
    solvingSteps.push({
      step: 4,
      title: "Apply Euler's Theorem (Path)",
      description: "Connected graph + exactly 2 odd-degree vertices ⟹ Eulerian Path",
      result: `✓ PASSED - Exactly 2 odd-degree vertices found`,
      conclusion: "Eulerian Path EXISTS"
    });
    
    solvingSteps.push({
      step: 5,
      title: "Check for Eulerian Circuit",
      description: "Circuit requires all even degrees",
      result: "✗ FAILED - Two vertices have odd degree",
      conclusion: "No Eulerian Circuit (start ≠ end)"
    });
    
    solvingSteps.push({
      step: 6,
      title: "Determine Path Endpoints",
      description: "Path must start and end at odd-degree vertices",
      result: `Start: ${oddDegreeVertices[0]}, End: ${oddDegreeVertices[1]}`,
      conclusion: "Path direction is determined by these two vertices"
    });
    
    explanation = `Graph has an Eulerian Path but NOT an Eulerian Circuit. Exactly 2 vertices have odd degree.`;
    mathematicalReasoning = "Theorem: A connected graph has an Eulerian path if and only if it has exactly 0 or 2 vertices of odd degree. The path must start at one odd-degree vertex and end at the other. Since the start and end vertices are different, it cannot be a circuit.";
  } else {
    solvingSteps.push({
      step: 4,
      title: "Apply Euler's Theorem",
      description: "Need exactly 0 or 2 odd-degree vertices",
      result: `✗ FAILED - Found ${oddDegreeCount} odd-degree vertices`,
      conclusion: "Neither Eulerian Path nor Circuit exists"
    });
    
    solvingSteps.push({
      step: 5,
      title: "Mathematical Proof Why It Fails",
      description: "Degree parity argument",
      result: `Each time we traverse an edge at vertex v, we use 2 degree units (in + out)`,
      conclusion: `With ${oddDegreeCount} odd vertices, we have ${oddDegreeCount - 2} "extra" vertices that can't be start/end points`
    });
    
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
    solvingSteps,  // NEW: Detailed solving steps
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
  
  // Initialize solving steps
  let solvingSteps = [];
  
  // If not connected, definitely no Hamiltonian path/circuit
  if (!connectivity.connected) {
    solvingSteps.push({
      step: 1,
      title: "Check Graph Connectivity",
      description: "Used Depth-First Search (DFS) to verify connectivity",
      result: `✗ Graph is DISCONNECTED (${connectivity.components} components)`,
      conclusion: "Hamiltonian path impossible - cannot visit all vertices"
    });
    
    return {
      hasHamiltonianCircuit: false,
      hasHamiltonianPath: false,
      certainty: "definite",
      explanation: `Graph is not connected (${connectivity.components} components). Hamiltonian paths require visiting all vertices.`,
      mathematicalReasoning: "Theorem: A Hamiltonian path must visit all vertices, which is impossible in a disconnected graph as there is no path between vertices in different components.",
      theoremApplied: "Connectivity requirement",
      degrees,
      solvingSteps,
      samplePath: null
    };
  }
  
  // Step 1: Check connectivity (passed)
  solvingSteps.push({
    step: 1,
    title: "Check Graph Connectivity",
    description: "Used Depth-First Search (DFS) to verify connectivity",
    result: `✓ Graph is CONNECTED`,
    conclusion: "Graph is connected - Hamiltonian path may be possible"
  });
  
  // Step 2: Calculate degrees
  const degreeList = Object.entries(degrees).map(([id, deg]) => `${id}:${deg}`).join(', ');
  solvingSteps.push({
    step: 2,
    title: "Calculate Vertex Degrees",
    description: "Counted edges incident to each vertex",
    result: `Degrees: {${degreeList}}`,
    details: `n = ${n} vertices, min(deg) = ${Math.min(...Object.values(degrees))}, max(deg) = ${Math.max(...Object.values(degrees))}`
  });
  
  // Check Dirac's Theorem (sufficient condition for Hamiltonian circuit)
  const minDegree = Math.min(...Object.values(degrees));
  const diracCondition = minDegree >= n / 2;
  
  solvingSteps.push({
    step: 3,
    title: "Check Dirac's Theorem (1952)",
    description: `Sufficient condition: n ≥ 3 AND deg(v) ≥ n/2 for ALL vertices`,
    calculation: `n = ${n}, n/2 = ${n/2}, min(deg) = ${minDegree}`,
    result: diracCondition && n >= 3
      ? `✓ SATISFIED - min(deg) = ${minDegree} ≥ ${n/2}` 
      : n < 3
      ? `⚠ Not applicable (n < 3)`
      : `✗ NOT SATISFIED - min(deg) = ${minDegree} < ${n/2}`,
    conclusion: diracCondition && n >= 3
      ? "Hamiltonian Circuit GUARANTEED to exist"
      : "Cannot conclude from Dirac's theorem"
  });
  
  if (diracCondition && n >= 3) {
    solvingSteps.push({
      step: 4,
      title: "Final Conclusion",
      description: "Dirac's sufficient condition met",
      result: "✓ Hamiltonian Circuit EXISTS",
      proof: "By Dirac's Theorem, a connected graph with n≥3 where all vertices have degree ≥n/2 must contain a Hamiltonian circuit"
    });
    
    return {
      hasHamiltonianCircuit: true,
      hasHamiltonianPath: true,
      certainty: "definite",
      explanation: `Graph has a Hamiltonian Circuit (by Dirac's Theorem). Minimum degree ${minDegree} ≥ n/2 = ${n/2}`,
      mathematicalReasoning: `Dirac's Theorem (1952): If G is a simple connected graph with n ≥ 3 vertices, and every vertex has degree at least n/2, then G has a Hamiltonian circuit. Since min(deg) = ${minDegree} ≥ ${n/2}, the condition is satisfied.`,
      theoremApplied: "Dirac's Theorem",
      degrees,
      minDegree,
      solvingSteps,
      samplePath: "Guaranteed to exist (construction not computed)"
    };
  }
  
  // Check Ore's Theorem (another sufficient condition)
  let oreConditionSatisfied = true;
  const nodeIds = nodes.map(n => n.id);
  let oreViolation = null;
  
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const u = nodeIds[i];
      const v = nodeIds[j];
      
      // Check if u and v are not adjacent
      if (!graph[u].has(v)) {
        const degreeSum = degrees[u] + degrees[v];
        if (degreeSum < n) {
          oreConditionSatisfied = false;
          oreViolation = { u, v, degreeSum };
          break;
        }
      }
    }
    if (!oreConditionSatisfied) break;
  }
  
  solvingSteps.push({
    step: 4,
    title: "Check Ore's Theorem (1960)",
    description: `Sufficient condition: n ≥ 3 AND deg(u) + deg(v) ≥ n for ALL non-adjacent vertex pairs`,
    calculation: oreConditionSatisfied 
      ? `All non-adjacent pairs satisfy deg(u) + deg(v) ≥ ${n}`
      : `Counter-example: vertices ${oreViolation.u} and ${oreViolation.v} are non-adjacent with deg sum = ${oreViolation.degreeSum} < ${n}`,
    result: oreConditionSatisfied && n >= 3
      ? `✓ SATISFIED - All non-adjacent pairs meet the condition`
      : n < 3
      ? `⚠ Not applicable (n < 3)`
      : `✗ NOT SATISFIED`,
    conclusion: oreConditionSatisfied && n >= 3
      ? "Hamiltonian Circuit GUARANTEED to exist"
      : "Cannot conclude from Ore's theorem"
  });
  
  if (oreConditionSatisfied && n >= 3) {
    solvingSteps.push({
      step: 5,
      title: "Final Conclusion",
      description: "Ore's sufficient condition met",
      result: "✓ Hamiltonian Circuit EXISTS",
      proof: "By Ore's Theorem, a connected graph with n≥3 where every pair of non-adjacent vertices has degree sum ≥n must contain a Hamiltonian circuit"
    });
    
    return {
      hasHamiltonianCircuit: true,
      hasHamiltonianPath: true,
      certainty: "definite",
      explanation: "Graph has a Hamiltonian Circuit (by Ore's Theorem). For all non-adjacent vertices u,v: deg(u) + deg(v) ≥ n",
      mathematicalReasoning: `Ore's Theorem (1960): If G is a simple connected graph with n ≥ 3 vertices, and for every pair of non-adjacent vertices u and v, deg(u) + deg(v) ≥ n, then G has a Hamiltonian circuit.`,
      theoremApplied: "Ore's Theorem",
      degrees,
      solvingSteps,
      samplePath: "Guaranteed to exist (construction not computed)"
    };
  }
  
  // For small graphs (n ≤ 8), use backtracking to find actual Hamiltonian path
  if (n <= 8) {
    solvingSteps.push({
      step: 5,
      title: "Attempt Exhaustive Backtracking Search",
      description: `Graph is small (${n} ≤ 8 vertices), so we can try all possible paths`,
      calculation: `Maximum paths to check: ${n}! = ${factorial(n)}`,
      result: "Running backtracking algorithm..."
    });
    
    const hamiltonianPath = findHamiltonianPath(nodes, graph);
    const hamiltonianCircuit = findHamiltonianCircuit(nodes, graph);
    
    solvingSteps.push({
      step: 6,
      title: "Backtracking Search Results",
      description: "Exhaustive search completed",
      result: hamiltonianCircuit
        ? "✓ Hamiltonian CIRCUIT found"
        : hamiltonianPath
        ? "✓ Hamiltonian PATH found (no circuit)"
        : "✗ NO Hamiltonian path or circuit found",
      conclusion: hamiltonianCircuit || hamiltonianPath
        ? "Definitive answer: Hamiltonian structure exists"
        : "Definitive answer: No Hamiltonian structure exists"
    });
    
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
      solvingSteps,
      samplePath: hamiltonianCircuit || hamiltonianPath
    };
  }
  
  // For larger graphs, provide heuristic analysis
  solvingSteps.push({
    step: 5,
    title: "Graph Size Analysis",
    description: `Graph has ${n} vertices (> 8)`,
    calculation: `Exhaustive search would require checking up to ${n}! paths`,
    result: "✗ Too large for exhaustive search",
    conclusion: "Computational infeasibility due to NP-completeness"
  });
  
  solvingSteps.push({
    step: 6,
    title: "NP-Completeness Limitation",
    description: "Hamiltonian path problem is NP-complete (Karp, 1972)",
    result: "⚠ UNKNOWN - Cannot determine definitively",
    conclusion: "No known efficient algorithm exists. Result cannot be determined without exponential-time search."
  });
  
  return {
    hasHamiltonianCircuit: "unknown",
    hasHamiltonianPath: "unknown",
    certainty: "unknown",
    explanation: "Graph is too large for exhaustive search, and doesn't satisfy known sufficient conditions (Dirac/Ore theorems)",
    mathematicalReasoning: `The Hamiltonian path problem is NP-complete (proven by Richard Karp, 1972). No polynomial-time algorithm is known. For this graph with ${n} vertices, exhaustive search is computationally infeasible. Neither Dirac's nor Ore's sufficient conditions are met.`,
    theoremApplied: "NP-completeness",
    degrees,
    minDegree,
    solvingSteps,
    suggestion: "Try reducing graph size (≤8 vertices) for definite answer, or add more edges to satisfy Dirac's condition (all degrees ≥ n/2)"
  };
}

// Helper function to calculate factorial for display
function factorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result.toLocaleString();
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
