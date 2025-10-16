'use client';

import { useState, useEffect } from 'react';

/**
 * EdgeEditorModal Component
 * Modal dialog for editing edge properties (weight, blocked status, toll)
 * 
 * @param {Boolean} isOpen - Whether modal is visible
 * @param {Object} edge - The edge being edited
 * @param {Function} onClose - Handler to close modal
 * @param {Function} onSave - Handler to save changes
 */
export default function EdgeEditorModal({ isOpen, edge, onClose, onSave }) {
  const [weight, setWeight] = useState(1);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (edge) {
      setWeight(edge.weight);
      setBlocked(edge.blocked);
    }
  }, [edge]);

  if (!isOpen || !edge) return null;

  const handleSave = () => {
    const updatedEdge = {
      ...edge,
      weight: parseFloat(weight),
      blocked
    };
    onSave(updatedEdge);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    setWeight(edge.weight);
    setBlocked(edge.blocked);
    onClose();
  };

  const isToll = weight < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Edit Edge
        </h2>

        {/* Edge Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>From:</strong> {edge.from}
          </p>
          <p className="text-sm text-gray-600">
            <strong>To:</strong> {edge.to}
          </p>
        </div>

        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (Distance/Cost)
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter weight..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Use positive values for distance/cost. Use negative values for tolls (requires Bellman-Ford).
          </p>
        </div>

        {/* Toll Indicator */}
        {isToll && (
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              💰 <strong>Toll Road:</strong> This edge has a negative weight and will be treated as a toll that reduces total cost.
            </p>
          </div>
        )}

        {/* Blocked Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-700">Block this road</p>
            <p className="text-xs text-gray-500">
              Blocked roads cannot be used in path calculation
            </p>
          </div>
          <button
            onClick={() => setBlocked(!blocked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              blocked ? 'bg-red-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                blocked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {blocked && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-3">
            <p className="text-sm text-red-800">
              🚧 <strong>Road Blocked:</strong> This edge will not be considered in pathfinding.
            </p>
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Presets:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setWeight(1)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded transition-colors"
            >
              Default (1)
            </button>
            <button
              onClick={() => setWeight(5)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm py-2 px-3 rounded transition-colors"
            >
              Far (5)
            </button>
            <button
              onClick={() => setWeight(-2)}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm py-2 px-3 rounded transition-colors"
            >
              Toll (-2)
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            💾 Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            ✖️ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
