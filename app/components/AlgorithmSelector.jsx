'use client';

/**
 * AlgorithmSelector Component
 * Displays the current algorithm and allows manual selection
 * Shows automatic detection reasoning
 * 
 * @param {String} algorithm - Current algorithm ('dijkstra' or 'bellman-ford')
 * @param {Boolean} hasNegativeWeights - Whether graph contains negative weights
 * @param {Function} onAlgorithmChange - Handler for manual algorithm selection
 * @param {Boolean} autoDetect - Whether to use automatic detection
 * @param {Function} onAutoDetectChange - Handler for auto-detect toggle
 */
export default function AlgorithmSelector({
  algorithm,
  hasNegativeWeights,
  onAlgorithmChange,
  autoDetect = true,
  onAutoDetectChange
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Algorithm Selection
      </h2>

      {/* Auto-detect Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-700">Automatic Detection</p>
          <p className="text-xs text-gray-500">
            Automatically choose the best algorithm based on edge weights
          </p>
        </div>
        <button
          onClick={() => onAutoDetectChange?.(!autoDetect)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoDetect ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoDetect ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Current Algorithm Display */}
      <div className={`p-4 rounded-lg text-black border-2 ${
        algorithm === 'dijkstra' 
          ? 'bg-blue-50 border-blue-300' 
          : 'bg-purple-50 border-purple-300'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">
            {algorithm === 'dijkstra' ? '🔵 Dijkstra\'s Algorithm' : '🟣 Bellman-Ford Algorithm'}
          </h3>
          {autoDetect && (
            <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-300">
              Auto-selected
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {algorithm === 'dijkstra' 
            ? 'Efficient greedy algorithm for graphs with non-negative edge weights. Time complexity: O((V + E) log V)'
            : 'Dynamic programming algorithm that can handle negative edge weights and detect negative cycles. Time complexity: O(V × E)'}
        </p>

        {/* Algorithm Features */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">
              {algorithm === 'dijkstra' ? 'Fast computation' : 'Handles negative weights'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">
              {algorithm === 'dijkstra' ? 'Optimal for positive weights' : 'Detects negative cycles'}
            </span>
          </div>
          {algorithm === 'dijkstra' && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600">✗</span>
              <span className="text-gray-700">Cannot handle negative weights</span>
            </div>
          )}
        </div>
      </div>

      {/* Auto-detection Reasoning */}
      {autoDetect && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="font-medium text-yellow-800 mb-1">🤖 Auto-Detection Logic</p>
          <p className="text-sm text-yellow-700">
            {hasNegativeWeights 
              ? 'Negative edge weights detected. Using Bellman-Ford to ensure correct shortest path calculation and detect any negative cycles.'
              : 'All edge weights are non-negative. Using Dijkstra\'s algorithm for optimal performance.'}
          </p>
        </div>
      )}

      {/* Manual Selection (when auto-detect is off) */}
      {!autoDetect && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Manual Selection:</p>
          
          <button
            onClick={() => onAlgorithmChange('dijkstra')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              algorithm === 'dijkstra'
                ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300'
                : 'bg-white border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-medium text-gray-800">Dijkstra's Algorithm</p>
                <p className="text-xs text-gray-600">Best for non-negative weights</p>
              </div>
              {algorithm === 'dijkstra' && (
                <span className="text-blue-600">✓</span>
              )}
            </div>
          </button>

          <button
            onClick={() => onAlgorithmChange('bellman-ford')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              algorithm === 'bellman-ford'
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300'
                : 'bg-white border-gray-300 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-medium text-gray-800">Bellman-Ford Algorithm</p>
                <p className="text-xs text-gray-600">Required for negative weights</p>
              </div>
              {algorithm === 'bellman-ford' && (
                <span className="text-purple-600">✓</span>
              )}
            </div>
          </button>

          {hasNegativeWeights && algorithm === 'dijkstra' && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-3">
              <p className="text-sm text-red-800">
                ⚠️ <strong>Warning:</strong> Your graph contains negative weights. Dijkstra's algorithm may produce incorrect results. Consider using Bellman-Ford.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Feature</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Dijkstra</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Bellman-Ford</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-black">
            <tr>
              <td className="px-3 py-2 text-gray-600">Negative weights</td>
              <td className="px-3 py-2 text-center">❌</td>
              <td className="px-3 py-2 text-center">✅</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-3 py-2 text-gray-600">Speed</td>
              <td className="px-3 py-2 text-center">⚡ Fast</td>
              <td className="px-3 py-2 text-center">🐢 Slower</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-gray-600">Cycle detection</td>
              <td className="px-3 py-2 text-center">❌</td>
              <td className="px-3 py-2 text-center">✅</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
