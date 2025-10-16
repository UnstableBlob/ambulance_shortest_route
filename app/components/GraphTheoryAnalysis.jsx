'use client';

import { useMemo } from 'react';
import { analyzeEulerian, analyzeHamiltonian } from '../utils/graphTheoryAnalysis';

/**
 * GraphTheoryAnalysis Component
 * Provides comprehensive mathematical analysis of Eulerian and Hamiltonian properties
 * 
 * Displays:
 * - Eulerian Path/Circuit existence with mathematical proofs
 * - Hamiltonian Path/Circuit existence with theorem applications
 * - Vertex degrees and connectivity information
 * - Educational explanations suitable for academic presentation
 * 
 * @param {Array} nodes - Graph nodes
 * @param {Array} edges - Graph edges
 */
export default function GraphTheoryAnalysis({ nodes, edges }) {
  // Perform Eulerian analysis
  const eulerianAnalysis = useMemo(() => {
    return analyzeEulerian(nodes, edges);
  }, [nodes, edges]);

  // Perform Hamiltonian analysis
  const hamiltonianAnalysis = useMemo(() => {
    return analyzeHamiltonian(nodes, edges);
  }, [nodes, edges]);

  // Get node label by ID
  const getNodeLabel = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.label : nodeId;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b-2 border-indigo-500 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">
          📐 Graph Theory Analysis
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Mathematical analysis of Eulerian and Hamiltonian properties
        </p>
      </div>

      {/* Graph Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-xl">📊</span>
          Graph Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">Vertices</p>
            <p className="text-2xl font-bold text-blue-600">|V| = {nodes.length}</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">Edges</p>
            <p className="text-2xl font-bold text-green-600">
              |E| = {edges.filter(e => !e.blocked).length}
            </p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">Components</p>
            <p className="text-2xl font-bold text-purple-600">
              {eulerianAnalysis.components || 0}
            </p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">Connected</p>
            <p className="text-2xl font-bold text-indigo-600">
              {eulerianAnalysis.connected ? '✓' : '✗'}
            </p>
          </div>
        </div>
      </div>

      {/* Vertex Degrees */}
      {Object.keys(eulerianAnalysis.degrees || {}).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-xl">🔢</span>
            Vertex Degrees
          </h3>
          <div className="text-black grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(eulerianAnalysis.degrees).map(([nodeId, degree]) => (
              <div 
                key={nodeId}
                className={`p-2 rounded text-center ${
                  degree % 2 === 0 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-orange-100 border border-orange-300'
                }`}
              >
                <p className="text-xs text-gray-600 font-medium">{getNodeLabel(nodeId)}</p>
                <p className="text-lg font-bold">
                  deg = {degree}
                </p>
                <p className="text-xs text-gray-600">
                  {degree % 2 === 0 ? 'even' : 'odd'}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2 italic">
            Note: Green = even degree, Orange = odd degree
          </p>
        </div>
      )}

      {/* Eulerian Analysis */}
      <div className="border-2 border-blue-300 rounded-lg overflow-hidden text-black">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            Eulerian Analysis
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            Analysis of paths/circuits that traverse every EDGE exactly once
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Eulerian Circuit */}
          <div className={`p-4 rounded-lg border-2 ${
            eulerianAnalysis.hasEulerianCircuit
              ? 'bg-green-50 border-green-400'
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">
                {eulerianAnalysis.hasEulerianCircuit ? '✅' : '❌'}
              </span>
              <div>
                <h4 className="font-bold text-lg">
                  Eulerian Circuit
                </h4>
                <p className="text-sm text-gray-700">
                  {eulerianAnalysis.hasEulerianCircuit 
                    ? 'EXISTS - Can traverse all edges and return to start'
                    : 'DOES NOT EXIST'}
                </p>
              </div>
            </div>
          </div>

          {/* Eulerian Path */}
          <div className={`p-4 rounded-lg border-2 ${
            eulerianAnalysis.hasEulerianPath
              ? 'bg-green-50 border-green-400'
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">
                {eulerianAnalysis.hasEulerianPath ? '✅' : '❌'}
              </span>
              <div>
                <h4 className="font-bold text-lg">
                  Eulerian Path
                </h4>
                <p className="text-sm text-gray-700">
                  {eulerianAnalysis.hasEulerianPath 
                    ? 'EXISTS - Can traverse all edges exactly once'
                    : 'DOES NOT EXIST'}
                </p>
              </div>
            </div>
            
            {eulerianAnalysis.startEndVertices && (
              <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
                <p className="text-sm font-medium text-blue-900">
                  Path must start at <span className="font-bold">{getNodeLabel(eulerianAnalysis.startEndVertices.start)}</span>
                  {' '}and end at <span className="font-bold">{getNodeLabel(eulerianAnalysis.startEndVertices.end)}</span>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  (The two vertices with odd degree)
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>💡</span>
              Explanation
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {eulerianAnalysis.explanation}
            </p>
          </div>

          {/* Mathematical Reasoning */}
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>📐</span>
              Mathematical Theorem
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              {eulerianAnalysis.mathematicalReasoning}
            </p>
          </div>

          {/* NEW: Step-by-Step Solving Process */}
          {eulerianAnalysis.solvingSteps && eulerianAnalysis.solvingSteps.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-400 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                Step-by-Step Solution Process
              </h4>
              <div className="space-y-3">
                {eulerianAnalysis.solvingSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-lg p-3 border-l-4 ${
                      step.passed === true 
                        ? 'border-green-500' 
                        : step.passed === false 
                        ? 'border-red-500' 
                        : 'border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {step.step}
                      </span>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 text-sm mb-1">
                          {step.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2">
                          {step.description}
                        </p>
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-sm font-medium text-gray-800">
                            <span className="text-gray-600">Result:</span> {step.result}
                          </p>
                          {step.details && (
                            <p className="text-xs text-gray-600 mt-1">
                              {step.details}
                            </p>
                          )}
                          {step.conclusion && (
                            <p className="text-xs text-blue-700 mt-1 font-medium">
                              → {step.conclusion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Odd Degree Vertices */}
          {eulerianAnalysis.oddDegreeCount > 0 && (
            <div className="bg-orange-50 border border-orange-300 p-4 rounded">
              <h4 className="font-bold text-orange-900 mb-2">
                Odd Degree Vertices: {eulerianAnalysis.oddDegreeCount}
              </h4>
              <div className="flex flex-wrap gap-2">
                {eulerianAnalysis.oddDegreeVertices.map(nodeId => (
                  <span 
                    key={nodeId}
                    className="bg-orange-200 px-3 py-1 rounded-full text-sm font-medium text-orange-900"
                  >
                    {getNodeLabel(nodeId)} (deg = {eulerianAnalysis.degrees[nodeId]})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hamiltonian Analysis */}
      <div className="border-2 border-purple-300 rounded-lg overflow-hidden text-black">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔁</span>
            Hamiltonian Analysis
          </h3>
          <p className="text-purple-100 text-sm mt-1">
            Analysis of paths/circuits that visit every VERTEX exactly once
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Certainty Level */}
          <div className={`p-3 rounded-lg border-2 ${
            hamiltonianAnalysis.certainty === 'definite'
              ? 'bg-blue-50 border-blue-400'
              : 'bg-yellow-50 border-yellow-400'
          }`}>
            <p className="text-sm font-medium">
              <span className="font-bold">Certainty: </span>
              {hamiltonianAnalysis.certainty === 'definite' 
                ? '✓ Definite (Proven)' 
                : '⚠ Unknown (NP-Complete Problem)'}
            </p>
          </div>

          {/* Hamiltonian Circuit */}
          <div className={`p-4 rounded-lg border-2 ${
            hamiltonianAnalysis.hasHamiltonianCircuit === true
              ? 'bg-green-50 border-green-400'
              : hamiltonianAnalysis.hasHamiltonianCircuit === false
              ? 'bg-red-50 border-red-400'
              : 'bg-gray-50 border-gray-400'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">
                {hamiltonianAnalysis.hasHamiltonianCircuit === true
                  ? '✅'
                  : hamiltonianAnalysis.hasHamiltonianCircuit === false
                  ? '❌'
                  : '❓'}
              </span>
              <div>
                <h4 className="font-bold text-lg">
                  Hamiltonian Circuit
                </h4>
                <p className="text-sm text-gray-700">
                  {hamiltonianAnalysis.hasHamiltonianCircuit === true
                    ? 'EXISTS - Can visit all vertices and return to start'
                    : hamiltonianAnalysis.hasHamiltonianCircuit === false
                    ? 'DOES NOT EXIST'
                    : 'UNKNOWN - Cannot be determined'}
                </p>
              </div>
            </div>
          </div>

          {/* Hamiltonian Path */}
          <div className={`p-4 rounded-lg border-2 ${
            hamiltonianAnalysis.hasHamiltonianPath === true
              ? 'bg-green-50 border-green-400'
              : hamiltonianAnalysis.hasHamiltonianPath === false
              ? 'bg-red-50 border-red-400'
              : 'bg-gray-50 border-gray-400'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">
                {hamiltonianAnalysis.hasHamiltonianPath === true
                  ? '✅'
                  : hamiltonianAnalysis.hasHamiltonianPath === false
                  ? '❌'
                  : '❓'}
              </span>
              <div>
                <h4 className="font-bold text-lg">
                  Hamiltonian Path
                </h4>
                <p className="text-sm text-gray-700">
                  {hamiltonianAnalysis.hasHamiltonianPath === true
                    ? 'EXISTS - Can visit all vertices exactly once'
                    : hamiltonianAnalysis.hasHamiltonianPath === false
                    ? 'DOES NOT EXIST'
                    : 'UNKNOWN - Cannot be determined'}
                </p>
              </div>
            </div>

            {/* Sample Path */}
            {hamiltonianAnalysis.samplePath && Array.isArray(hamiltonianAnalysis.samplePath) && (
              <div className="mt-3 p-3 bg-purple-100 rounded border border-purple-300">
                <p className="text-sm font-medium text-purple-900 mb-2">
                  Sample {hamiltonianAnalysis.hasHamiltonianCircuit ? 'Circuit' : 'Path'}:
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  {hamiltonianAnalysis.samplePath.map((nodeId, idx) => (
                    <span key={idx} className="flex items-center gap-2">
                      <span className="bg-purple-200 px-3 py-1 rounded font-medium text-purple-900">
                        {getNodeLabel(nodeId)}
                      </span>
                      {idx < hamiltonianAnalysis.samplePath.length - 1 && (
                        <span className="text-purple-600">→</span>
                      )}
                    </span>
                  ))}
                  {hamiltonianAnalysis.hasHamiltonianCircuit && (
                    <span className="flex items-center gap-2">
                      <span className="text-purple-600">→</span>
                      <span className="bg-purple-200 px-3 py-1 rounded font-medium text-purple-900">
                        {getNodeLabel(hamiltonianAnalysis.samplePath[0])}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>💡</span>
              Explanation
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {hamiltonianAnalysis.explanation}
            </p>
          </div>

          {/* Mathematical Reasoning */}
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>📐</span>
              Theorem Applied: {hamiltonianAnalysis.theoremApplied}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              {hamiltonianAnalysis.mathematicalReasoning}
            </p>
          </div>

          {/* NEW: Step-by-Step Solving Process */}
          {hamiltonianAnalysis.solvingSteps && hamiltonianAnalysis.solvingSteps.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                Step-by-Step Solution Process
              </h4>
              <div className="space-y-3">
                {hamiltonianAnalysis.solvingSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-lg p-3 border-l-4 ${
                      step.result?.includes('✓') 
                        ? 'border-green-500' 
                        : step.result?.includes('✗') 
                        ? 'border-red-500' 
                        : 'border-purple-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {step.step}
                      </span>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 text-sm mb-1">
                          {step.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2">
                          {step.description}
                        </p>
                        {step.calculation && (
                          <div className="bg-yellow-50 rounded p-2 mb-2 border border-yellow-200">
                            <p className="text-xs font-mono text-gray-700">
                              <span className="font-bold text-gray-800">Calculation:</span> {step.calculation}
                            </p>
                          </div>
                        )}
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-sm font-medium text-gray-800">
                            <span className="text-gray-600">Result:</span> {step.result}
                          </p>
                          {step.details && (
                            <p className="text-xs text-gray-600 mt-1">
                              {step.details}
                            </p>
                          )}
                          {step.conclusion && (
                            <p className="text-xs text-purple-700 mt-1 font-medium">
                              → {step.conclusion}
                            </p>
                          )}
                          {step.proof && (
                            <p className="text-xs text-indigo-700 mt-1 italic bg-indigo-50 p-2 rounded">
                              <strong>Proof:</strong> {step.proof}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimum Degree Info */}
          {hamiltonianAnalysis.minDegree !== undefined && (
            <div className="bg-blue-50 border border-blue-300 p-4 rounded">
              <h4 className="font-bold text-blue-900 mb-2">
                Minimum Vertex Degree
              </h4>
              <p className="text-sm text-gray-700">
                min(deg) = {hamiltonianAnalysis.minDegree}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Dirac's condition: min(deg) ≥ n/2 = {nodes.length / 2} 
                {hamiltonianAnalysis.minDegree >= nodes.length / 2 ? ' ✓ Satisfied' : ' ✗ Not satisfied'}
              </p>
            </div>
          )}

          {/* Suggestion for unknown cases */}
          {hamiltonianAnalysis.suggestion && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <span>💭</span>
                Suggestion
              </h4>
              <p className="text-gray-700 text-sm">
                {hamiltonianAnalysis.suggestion}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key Differences */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 border-2 border-cyan-300">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-xl">📚</span>
          Key Differences: Eulerian vs Hamiltonian
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border border-blue-200">
            <h4 className="font-bold text-blue-700 mb-2">🔄 Eulerian</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Traverses every <strong>EDGE</strong> exactly once</li>
              <li>• Vertices can be visited multiple times</li>
              <li>• Simple condition: check vertex degrees</li>
              <li>• Polynomial-time solvable (O(V+E))</li>
              <li>• Discovered by Euler (1736)</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded border border-purple-200">
            <h4 className="font-bold text-purple-700 mb-2">🔁 Hamiltonian</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Visits every <strong>VERTEX</strong> exactly once</li>
              <li>• Edges can be unused</li>
              <li>• No simple necessary/sufficient condition</li>
              <li>• NP-complete (no known efficient algorithm)</li>
              <li>• Named after Hamilton (1850s)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded">
        <h4 className="font-bold text-gray-800 mb-2">
          📖 Educational Note
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          This analysis uses classical theorems from graph theory including Euler's Theorem (1736), 
          Dirac's Theorem (1952), and Ore's Theorem (1960). The Hamiltonian path problem's NP-completeness 
          was proven by Richard Karp in 1972 as one of his 21 NP-complete problems. For graphs with 
          ≤8 vertices, we use backtracking to find exact solutions. For larger graphs, we rely on 
          sufficient conditions or indicate that the answer is unknown.
        </p>
      </div>
    </div>
  );
}
