'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GraphTheoryAnalysis from "../components/GraphTheoryAnalysis";

// Default sample graph data (used if no data from main page)
const defaultNodes = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
  { id: 'G', label: 'G' }
];

const defaultEdges = [
  { id: 'e1', from: 'A', to: 'B', weight: 2, blocked: false },
  { id: 'e2', from: 'B', to: 'C', weight: 3, blocked: false },
  { id: 'e3', from: 'C', to: 'D', weight: 1, blocked: false },
  { id: 'e4', from: 'D', to: 'A', weight: 4, blocked: false },
  { id: 'e5', from: 'A', to: 'E', weight: 2, blocked: false },
  { id: 'e6', from: 'E', to: 'F', weight: 3, blocked: false },
  { id: 'e7', from: 'F', to: 'G', weight: 1, blocked: false },
  { id: 'e8', from: 'G', to: 'B', weight: 2, blocked: false },
  { id: 'e9', from: 'B', to: 'E', weight: 1, blocked: false }
];

export default function GraphAnalysisPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState(defaultNodes);
  const [edges, setEdges] = useState(defaultEdges);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load graph data from localStorage if available (from main page)
    try {
      const savedNodes = localStorage.getItem('graphAnalysisNodes');
      const savedEdges = localStorage.getItem('graphAnalysisEdges');
      
      if (savedNodes && savedEdges) {
        const parsedNodes = JSON.parse(savedNodes);
        const parsedEdges = JSON.parse(savedEdges);
        
        if (parsedNodes.length > 0) {
          setNodes(parsedNodes);
          setEdges(parsedEdges);
        }
      }
    } catch (error) {
      console.error('Error loading graph data:', error);
    }
    
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading graph analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <span className="text-xl">←</span>
            <span>Back to Route Planner</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📐 Graph Theory Analysis
          </h1>
          <p className="text-gray-600">
            Mathematical analysis of Eulerian and Hamiltonian properties
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Analyzing graph with {nodes.length} vertices and {edges.filter(e => !e.blocked).length} edges
          </p>
        </div>
        
        <GraphTheoryAnalysis nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}