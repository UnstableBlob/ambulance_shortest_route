'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import RouteDetails from './components/RouteDetails';
import EdgeEditorModal from './components/EdgeEditorModal';
import AlgorithmSelector from './components/AlgorithmSelector';
import Legend from './components/Legend';
import { dijkstra, hasNegativeWeights } from './utils/dijkstra';
import { bellmanFord } from './utils/bellmanFord';

// Dynamic import for GraphVisualizer to avoid SSR issues with vis-network
const GraphVisualizer = dynamic(() => import('./components/GraphVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-300">
      <p className="text-gray-600">Loading graph visualizer...</p>
    </div>
  )
});

/**
 * Main Application Component
 * Ambulance Shortest Route Planner
 * 
 * Features:
 * - Interactive graph editing (add/remove nodes and edges)
 * - Set ambulance (start) and hospital (destination) nodes
 * - Block roads and add tolls (negative weights)
 * - Real-time shortest path calculation using Dijkstra or Bellman-Ford
 * - Visual path highlighting and route details
 * - LocalStorage persistence
 */
export default function Home() {
  // Graph state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Selection state
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  
  // Role assignments
  const [ambulanceId, setAmbulanceId] = useState(null);
  const [hospitalId, setHospitalId] = useState(null);
  
  // Modal state
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [edgeToEdit, setEdgeToEdit] = useState(null);
  
  // Algorithm state
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [autoDetectAlgorithm, setAutoDetectAlgorithm] = useState(true);
  
  // Route calculation result
  const [routeResult, setRouteResult] = useState(null);

  // Node counter for labeling
  const [nodeCounter, setNodeCounter] = useState(1);

  // Initialize with sample data
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setNodes(savedData.nodes);
      setEdges(savedData.edges);
      setAmbulanceId(savedData.ambulanceId);
      setHospitalId(savedData.hospitalId);
      setNodeCounter(savedData.nodeCounter || savedData.nodes.length + 1);
    } else {
      initializeSampleGraph();
    }
  }, []);

  // Initialize sample graph for demo
  const initializeSampleGraph = () => {
    const sampleNodes = [
      { id: 'A', label: 'Node A', type: 'normal' },
      { id: 'B', label: 'Node B', type: 'normal' },
      { id: 'C', label: 'Node C', type: 'normal' },
      { id: 'D', label: 'Node D', type: 'normal' },
      { id: 'E', label: 'Node E', type: 'normal' },
      { id: 'F', label: 'Node F', type: 'normal' },
    ];

    const sampleEdges = [
      { id: uuidv4(), from: 'A', to: 'B', weight: 4, blocked: false },
      { id: uuidv4(), from: 'A', to: 'C', weight: 2, blocked: false },
      { id: uuidv4(), from: 'B', to: 'C', weight: 1, blocked: false },
      { id: uuidv4(), from: 'B', to: 'D', weight: 5, blocked: false },
      { id: uuidv4(), from: 'C', to: 'D', weight: 8, blocked: false },
      { id: uuidv4(), from: 'C', to: 'E', weight: 10, blocked: false },
      { id: uuidv4(), from: 'D', to: 'E', weight: 2, blocked: false },
      { id: uuidv4(), from: 'D', to: 'F', weight: 6, blocked: false },
      { id: uuidv4(), from: 'E', to: 'F', weight: 3, blocked: false },
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setAmbulanceId('A');
    setHospitalId('F');
    setNodeCounter(7);
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (nodes.length > 0) {
      saveToLocalStorage({
        nodes,
        edges,
        ambulanceId,
        hospitalId,
        nodeCounter
      });
    }
  }, [nodes, edges, ambulanceId, hospitalId, nodeCounter]);

  // Check for negative weights and auto-detect algorithm
  const graphHasNegativeWeights = useMemo(() => {
    return hasNegativeWeights(edges);
  }, [edges]);

  useEffect(() => {
    if (autoDetectAlgorithm) {
      setAlgorithm(graphHasNegativeWeights ? 'bellman-ford' : 'dijkstra');
    }
  }, [graphHasNegativeWeights, autoDetectAlgorithm]);

  // Calculate shortest path whenever relevant state changes
  useEffect(() => {
    if (ambulanceId && hospitalId) {
      calculateShortestPath();
    } else {
      setRouteResult(null);
    }
  }, [nodes, edges, ambulanceId, hospitalId, algorithm]);

  // Calculate shortest path using selected algorithm
  const calculateShortestPath = useCallback(() => {
    if (!ambulanceId || !hospitalId) {
      setRouteResult(null);
      return;
    }

    let result;
    if (algorithm === 'dijkstra') {
      result = dijkstra(nodes, edges, ambulanceId, hospitalId);
    } else {
      result = bellmanFord(nodes, edges, ambulanceId, hospitalId);
    }

    setRouteResult(result);
  }, [nodes, edges, ambulanceId, hospitalId, algorithm]);

  // Handler: Add new node
  const handleAddNode = () => {
    const newNode = {
      id: `N${nodeCounter}`,
      label: `Node ${nodeCounter}`,
      type: 'normal'
    };
    setNodes([...nodes, newNode]);
    setNodeCounter(nodeCounter + 1);
  };

  // Handler: Add new edge (between last two nodes for simplicity)
  const handleAddEdge = () => {
    if (nodes.length < 2) {
      alert('Need at least 2 nodes to create an edge!');
      return;
    }

    // Simple implementation: connect last two nodes if not already connected
    const lastNode = nodes[nodes.length - 1];
    const secondLastNode = nodes[nodes.length - 2];
    
    const edgeExists = edges.some(
      e => (e.from === lastNode.id && e.to === secondLastNode.id) ||
           (e.from === secondLastNode.id && e.to === lastNode.id)
    );

    if (edgeExists) {
      alert('These nodes are already connected!');
      return;
    }

    const newEdge = {
      id: uuidv4(),
      from: secondLastNode.id,
      to: lastNode.id,
      weight: 1,
      blocked: false
    };

    setEdges([...edges, newEdge]);
  };

  // Handler: Delete selected node
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;

    // Remove node
    setNodes(nodes.filter(n => n.id !== selectedNodeId));
    
    // Remove connected edges
    setEdges(edges.filter(e => e.from !== selectedNodeId && e.to !== selectedNodeId));
    
    // Clear selections if deleting selected nodes
    if (ambulanceId === selectedNodeId) setAmbulanceId(null);
    if (hospitalId === selectedNodeId) setHospitalId(null);
    
    setSelectedNodeId(null);
  };

  // Handler: Delete selected edge
  const handleDeleteEdge = () => {
    if (!selectedEdgeId) return;
    setEdges(edges.filter(e => e.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  };

  // Handler: Set ambulance node
  const handleSetAmbulance = (nodeId) => {
    if (!nodeId) {
      setAmbulanceId(null);
      setNodes(nodes.map(n => n.id === ambulanceId ? { ...n, type: 'normal' } : n));
      return;
    }

    // Update previous ambulance node to normal
    const updatedNodes = nodes.map(n => {
      if (n.id === ambulanceId) return { ...n, type: 'normal' };
      if (n.id === nodeId) return { ...n, type: 'ambulance' };
      return n;
    });

    setNodes(updatedNodes);
    setAmbulanceId(nodeId);
  };

  // Handler: Set hospital node
  const handleSetHospital = (nodeId) => {
    if (!nodeId) {
      setHospitalId(null);
      setNodes(nodes.map(n => n.id === hospitalId ? { ...n, type: 'normal' } : n));
      return;
    }

    // Update previous hospital node to normal
    const updatedNodes = nodes.map(n => {
      if (n.id === hospitalId) return { ...n, type: 'normal' };
      if (n.id === nodeId) return { ...n, type: 'hospital' };
      return n;
    });

    setNodes(updatedNodes);
    setHospitalId(nodeId);
  };

  // Handler: Node selection
  const handleNodeSelect = (nodeId) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  };

  // Handler: Edge selection
  const handleEdgeSelect = (edgeId) => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
    
    // Open edge editor modal
    const edge = edges.find(e => e.id === edgeId);
    if (edge) {
      setEdgeToEdit(edge);
      setIsEdgeModalOpen(true);
    }
  };

  // Handler: Save edge changes
  const handleSaveEdge = (updatedEdge) => {
    setEdges(edges.map(e => e.id === updatedEdge.id ? updatedEdge : e));
    setIsEdgeModalOpen(false);
    setEdgeToEdit(null);
  };

  // Handler: Node moved
  const handleNodeMove = (nodeId, position) => {
    // Position updates are handled by vis-network internally
    // This is mainly for tracking if needed for other features
  };

  // Handler: Clear graph
  const handleClearGraph = () => {
    if (confirm('Are you sure you want to clear the entire graph?')) {
      setNodes([]);
      setEdges([]);
      setAmbulanceId(null);
      setHospitalId(null);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setRouteResult(null);
      setNodeCounter(1);
      localStorage.removeItem('ambulance-route-planner');
    }
  };

  // Handler: Reset to sample
  const handleResetToSample = () => {
    if (confirm('Reset to sample graph?')) {
      initializeSampleGraph();
    }
  };

  // LocalStorage helpers
  function saveToLocalStorage(data) {
    try {
      localStorage.setItem('ambulance-route-planner', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('ambulance-route-planner');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return null;
    }
  }

  // Get shortest path node IDs for highlighting
  const shortestPath = routeResult?.path || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🚑 Ambulance Shortest Route Planner
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Interactive graph-based pathfinding with real-time visualization
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResetToSample}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🔄 Load Sample
              </button>
              <button
                onClick={handleClearGraph}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Controls and Algorithm */}
          <div className="space-y-6">
            <ControlPanel
              nodes={nodes}
              onAddNode={handleAddNode}
              onAddEdge={handleAddEdge}
              onDeleteNode={handleDeleteNode}
              onDeleteEdge={handleDeleteEdge}
              onSetAmbulance={handleSetAmbulance}
              onSetHospital={handleSetHospital}
              selectedNodeId={selectedNodeId}
              selectedEdgeId={selectedEdgeId}
              ambulanceId={ambulanceId}
              hospitalId={hospitalId}
              algorithm={algorithm}
              hasNegativeWeights={graphHasNegativeWeights}
            />
            
            <AlgorithmSelector
              algorithm={algorithm}
              hasNegativeWeights={graphHasNegativeWeights}
              onAlgorithmChange={setAlgorithm}
              autoDetect={autoDetectAlgorithm}
              onAutoDetectChange={setAutoDetectAlgorithm}
            />

            <Legend />
          </div>

          {/* Middle Column: Graph Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="h-[700px]">
                <GraphVisualizer
                  nodes={nodes}
                  edges={edges}
                  shortestPath={shortestPath}
                  onNodeSelect={handleNodeSelect}
                  onEdgeSelect={handleEdgeSelect}
                  onNodeMove={handleNodeMove}
                />
              </div>
            </div>

            <RouteDetails
              routeResult={routeResult}
              nodes={nodes}
              algorithm={algorithm}
            />
          </div>
        </div>
      </main>

      {/* Edge Editor Modal */}
      <EdgeEditorModal
        isOpen={isEdgeModalOpen}
        edge={edgeToEdit}
        onClose={() => {
          setIsEdgeModalOpen(false);
          setEdgeToEdit(null);
        }}
        onSave={handleSaveEdge}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            Built with Next.js, React, Vis.js, and Pathfinding Algorithms
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Implements Dijkstra's and Bellman-Ford algorithms for optimal route finding
          </p>
        </div>
      </footer>
    </div>
  );
}
