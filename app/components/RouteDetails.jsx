'use client';

/**
 * RouteDetails Component
 * Displays the calculated shortest path details including steps and total cost
 * 
 * @param {Object} routeResult - Result from pathfinding algorithm
 * @param {Array} nodes - Array of all nodes for label lookup
 * @param {String} algorithm - Current algorithm being used
 */
export default function RouteDetails({ routeResult, nodes, algorithm }) {
  if (!routeResult) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
          Route Details
        </h2>
        <p className="text-gray-500 text-center py-8">
          Select ambulance and hospital nodes to calculate route
        </p>
      </div>
    );
  }

  const { found, path, totalCost, steps, hasNegativeCycle, error } = routeResult;

  // Get node label by ID
  const getNodeLabel = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.label : nodeId;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Route Details
      </h2>

      {/* Algorithm Badge */}
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          algorithm === 'dijkstra' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {algorithm === 'dijkstra' ? 'Dijkstra' : 'Bellman-Ford'}
        </span>
      </div>

      {/* Error Messages */}
      {hasNegativeCycle && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800">Negative Cycle Detected!</h3>
              <p className="text-sm text-red-700 mt-1">
                {error || 'The graph contains a negative weight cycle. No valid shortest path exists.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!found && !hasNegativeCycle && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-start">
            <span className="text-2xl mr-3">ℹ️</span>
            <div>
              <h3 className="font-bold text-yellow-800">No Path Found</h3>
              <p className="text-sm text-yellow-700 mt-1">
                There is no valid path between the ambulance and hospital. This may be due to blocked roads or disconnected nodes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success - Path Found */}
      {found && (
        <>
          {/* Total Cost */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Total Distance/Cost:</span>
              <span className="text-3xl font-bold text-green-600">
                {totalCost.toFixed(2)}
              </span>
            </div>
            {totalCost < 0 && (
              <p className="text-sm text-orange-600 mt-2">
                💰 Net toll benefit: {Math.abs(totalCost).toFixed(2)}
              </p>
            )}
          </div>

          {/* Path Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Path Overview ({path.length} nodes)
            </h3>
            <div className="flex flex-wrap gap-2">
              {path.map((nodeId, index) => (
                <div key={nodeId} className="flex items-center">
                  <span className={`px-3 py-1 rounded-lg font-medium ${
                    index === 0 
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : index === path.length - 1
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {index === 0 && '🚑 '}
                    {index === path.length - 1 && '🏥 '}
                    {getNodeLabel(nodeId)}
                  </span>
                  {index < path.length - 1 && (
                    <span className="mx-2 text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Step-by-Step Route
            </h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={`${step.from}-${step.to}-${index}`}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700">
                        {getNodeLabel(step.from)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-700">
                        {getNodeLabel(step.to)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.cost < 0 && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          TOLL
                        </span>
                      )}
                      <span className={`font-bold ${
                        step.cost < 0 ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                        {step.cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Total Segments</p>
              <p className="text-2xl font-bold text-blue-600">{steps.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Nodes Visited</p>
              <p className="text-2xl font-bold text-green-600">{path.length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
