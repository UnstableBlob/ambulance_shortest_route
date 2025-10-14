'use client';

/**
 * Legend Component
 * Visual legend explaining node and edge types
 */
export default function Legend() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Legend
      </h2>

      {/* Node Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Node Types</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white"></div>
            </div>
            <span className="text-gray-700">Normal Node (Intersection)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 border-2 border-blue-700 flex items-center justify-center" 
                 style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
            </div>
            <span className="text-gray-700">🚑 Ambulance (Start Point)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 border-2 border-green-700 transform rotate-45"></div>
            <span className="text-gray-700">🏥 Hospital (Destination)</span>
          </div>
        </div>
      </div>

      {/* Edge Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Road Types</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-1 bg-gray-500 rounded"></div>
            <span className="text-gray-700">Normal Road</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-16 h-1 bg-green-500 rounded shadow-lg"></div>
            <span className="text-gray-700">✅ Shortest Path</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-16 h-1 bg-orange-500 rounded"></div>
            <span className="text-gray-700">💰 Toll Road (Negative Weight)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-16 h-1 border-t-2 border-dashed border-red-500"></div>
            <span className="text-gray-700">🚧 Blocked Road</span>
          </div>
        </div>
      </div>

      {/* Weight Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 About Weights</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Positive weights:</strong> Distance or travel cost</li>
          <li>• <strong>Negative weights:</strong> Tolls or benefits</li>
          <li>• Click any edge to edit its weight or block it</li>
        </ul>
      </div>

      {/* Interaction Guide */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">🖱️ Interactions</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Click nodes:</strong> Select for editing</li>
          <li>• <strong>Click edges:</strong> Open editor modal</li>
          <li>• <strong>Drag nodes:</strong> Reposition on canvas</li>
          <li>• <strong>Scroll:</strong> Zoom in/out</li>
        </ul>
      </div>
    </div>
  );
}
