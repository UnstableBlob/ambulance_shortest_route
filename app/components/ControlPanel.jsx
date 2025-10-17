'use client';

/**
 * ControlPanel Component
 * Provides UI controls for graph manipulation and configuration
 * 
 * @param {Array} nodes - Array of all nodes
 * @param {Array} edges - Array of all edges
 * @param {Function} onAddNode - Handler for adding a node
 * @param {Function} onAddEdge - Handler for adding an edge
 * @param {Function} onDeleteNode - Handler for deleting selected node
 * @param {Function} onDeleteEdge - Handler for deleting selected edge
 * @param {Function} onSetAmbulance - Handler for setting ambulance node
 * @param {Function} onSetHospital - Handler for setting hospital node
 * @param {String} selectedNodeId - Currently selected node ID
 * @param {String} selectedEdgeId - Currently selected edge ID
 * @param {String} ambulanceId - Current ambulance node ID
 * @param {String} hospitalId - Current hospital node ID
 * @param {String} algorithm - Current algorithm ('dijkstra' or 'bellman-ford')
 * @param {Boolean} hasNegativeWeights - Whether graph has negative weights
 */
export default function ControlPanel({
  nodes,
  edges,
  onAddNode,
  onAddEdge,
  onDeleteNode,
  onDeleteEdge,
  onSetAmbulance,
  onSetHospital,
  selectedNodeId,
  selectedEdgeId,
  ambulanceId,
  hospitalId,
  algorithm,
  hasNegativeWeights
}) {
  // Build adjacency matrix
  const buildAdjacencyMatrix = () => {
    if (nodes.length === 0) return null;
    
    const matrix = {};
    
    // Initialize matrix with 0s
    nodes.forEach(node1 => {
      matrix[node1.id] = {};
      nodes.forEach(node2 => {
        matrix[node1.id][node2.id] = node1.id === node2.id ? 0 : '∞';
      });
    });
    
    // Fill in edge weights
    edges.forEach(edge => {
      if (!edge.blocked) {
        matrix[edge.from][edge.to] = edge.weight;
        matrix[edge.to][edge.from] = edge.weight; // Undirected graph
      }
    });
    
    return matrix;
  };

  const adjacencyMatrix = buildAdjacencyMatrix();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Control Panel
      </h2>

      {/* Graph Editing Controls */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Graph Editing</h3>
        
        <button
          onClick={onAddNode}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ➕ Add Node
        </button>

        <button
          onClick={onAddEdge}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={nodes.length < 2}
        >
          🔗 Add Edge
        </button>

        <button
          onClick={onDeleteNode}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!selectedNodeId}
        >
          🗑️ Delete Node
        </button>

        <button
          onClick={onDeleteEdge}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!selectedEdgeId}
        >
          ✂️ Delete Edge
        </button>
      </div>

      {/* Node Assignment Controls */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Node Assignments</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🚑 Ambulance (Start)
          </label>
          <select
            value={ambulanceId || ''}
            onChange={(e) => onSetAmbulance(e.target.value)}
            className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select ambulance node...</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏥 Hospital (Destination)
          </label>
          <select
            value={hospitalId || ''}
            onChange={(e) => onSetHospital(e.target.value)}
            className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select hospital node...</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>

        {selectedNodeId && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected Node:</strong> {nodes.find(n => n.id === selectedNodeId)?.label}
            </p>
          </div>
        )}

        {selectedEdgeId && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Selected Edge:</strong> {selectedEdgeId}
            </p>
          </div>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="space-y-3 text-black">
        <h3 className="text-lg font-semibold text-gray-700">Algorithm Status</h3>
        
        <div className={`p-4 rounded-lg ${
          algorithm === 'dijkstra' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
        }`}>
          <p className="font-medium mb-2">
            {algorithm === 'dijkstra' ? '🔵 Dijkstra\'s Algorithm' : '🟣 Bellman-Ford Algorithm'}
          </p>
          <p className="text-sm text-gray-600">
            {algorithm === 'dijkstra' 
              ? 'Optimal for non-negative weights. Fast and efficient.'
              : 'Handles negative weights. Can detect negative cycles.'}
          </p>
        </div>

        {hasNegativeWeights && algorithm === 'dijkstra' && (
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Warning:</strong> Graph contains negative weights. Dijkstra's algorithm may not produce correct results. Automatically switching to Bellman-Ford.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Quick Guide:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Add nodes and edges to build your network</li>
          <li>Click edges to edit weight or block roads</li>
          <li>Set ambulance and hospital locations</li>
          <li>View the shortest path automatically</li>
          <li>Negative weights = tolls (use Bellman-Ford)</li>
        </ul>
      </div>

      {/* Adjacency Matrix */}
      {adjacencyMatrix && nodes.length > 0 && (
        <div className="space-y-3 text-black">
          <h3 className="text-lg font-semibold text-gray-700">📊 Adjacency Matrix</h3>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-2 py-1 font-semibold text-gray-700">
                      {/* Empty corner cell */}
                    </th>
                    {nodes.map(node => (
                      <th 
                        key={node.id}
                        className="border border-gray-300 bg-gray-100 px-2 py-1 font-semibold text-gray-700 min-w-[40px]"
                        title={node.label}
                      >
                        {node.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(rowNode => (
                    <tr key={rowNode.id}>
                      <td className="border border-gray-300 bg-gray-100 px-2 py-1 font-semibold text-gray-700">
                        {rowNode.label}
                      </td>
                      {nodes.map(colNode => {
                        const value = adjacencyMatrix[rowNode.id][colNode.id];
                        const isInfinity = value === '∞';
                        const isSelf = rowNode.id === colNode.id;
                        
                        return (
                          <td 
                            key={colNode.id}
                            className={`border border-gray-300 px-2 py-1 text-center ${
                              isSelf ? 'bg-gray-200' :
                              isInfinity ? 'bg-gray-50 text-gray-400' :
                              'bg-green-50 text-green-700 font-semibold'
                            }`}
                            title={
                              isSelf ? 'Same node' :
                              isInfinity ? 'No direct edge' :
                              `Weight: ${value}`
                            }
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-3 text-xs text-gray-600">
              <p><strong>Legend:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-semibold text-green-700">Numbers</span> = Edge weights (distance/time)</li>
                <li><span className="text-gray-400">∞</span> = No direct connection</li>
                <li><span className="bg-gray-200 px-1">Diagonal</span> = Same node (always 0)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
