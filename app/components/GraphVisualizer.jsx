'use client';

import { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';

/**
 * GraphVisualizer Component
 * Renders an interactive graph using Vis.js Network
 * Handles all graph interactions and visual styling
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {Array} shortestPath - Array of node IDs in the shortest path
 * @param {Function} onNodeSelect - Callback when a node is selected
 * @param {Function} onEdgeSelect - Callback when an edge is selected
 * @param {Function} onNodeMove - Callback when a node is moved
 * @param {String} mode - Current interaction mode ('select', 'addNode', 'addEdge', 'delete')
 */
export default function GraphVisualizer({
  nodes,
  edges,
  shortestPath = [],
  onNodeSelect,
  onEdgeSelect,
  onNodeMove,
  mode = 'select'
}) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prepare nodes with visual styling
    const visNodes = nodes.map(node => ({
      id: node.id,
      label: node.label,
      color: getNodeColor(node.type),
      shape: getNodeShape(node.type),
      size: node.type === 'normal' ? 20 : 25,
      font: {
        size: 14,
        color: '#000000',
        bold: node.type !== 'normal'
      },
      borderWidth: 2,
      borderWidthSelected: 3
    }));

    // Prepare edges with visual styling
    const visEdges = edges.map(edge => {
      const isInPath = isEdgeInPath(edge, shortestPath);
      const isToll = edge.weight < 0;
      const isBlocked = edge.blocked;

      return {
        id: edge.id,
        from: edge.from,
        to: edge.to,
        label: `${edge.weight}`,
        color: getEdgeColor(isInPath, isBlocked, isToll),
        width: isInPath ? 4 : 2,
        dashes: isBlocked ? [5, 5] : false,
        font: {
          size: 12,
          align: 'middle',
          background: 'white',
          strokeWidth: 0
        },
        smooth: {
          type: 'continuous'
        },
        arrows: {
          to: {
            enabled: false
          }
        }
      };
    });

    // Vis.js options
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true
      },
      edges: {
        shadow: true,
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 100
        },
        barnesHut: {
          gravitationalConstant: -2000,
          springConstant: 0.001,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        dragNodes: true,
        dragView: true,
        zoomView: true
      },
      manipulation: {
        enabled: false
      }
    };

    // Create network
    const network = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      options
    );

    networkRef.current = network;

    // Event handlers
    network.on('click', (params) => {
      if (mode === 'addNode' && params.nodes.length === 0) {
        // Add node at click position
        const { x, y } = params.pointer.canvas;
        // This would need to be handled by parent component
      } else if (params.nodes.length > 0) {
        onNodeSelect?.(params.nodes[0]);
      } else if (params.edges.length > 0) {
        onEdgeSelect?.(params.edges[0]);
      }
    });

    network.on('dragEnd', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const position = network.getPositions([nodeId])[nodeId];
        onNodeMove?.(nodeId, position);
      }
    });

    // Cleanup
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [nodes, edges, shortestPath, mode, onNodeSelect, onEdgeSelect, onNodeMove]);

  // Helper function to determine node color based on type
  function getNodeColor(type) {
    switch (type) {
      case 'ambulance':
        return {
          background: '#3b82f6', // Blue
          border: '#1e40af',
          highlight: { background: '#60a5fa', border: '#1e3a8a' }
        };
      case 'hospital':
        return {
          background: '#10b981', // Green
          border: '#059669',
          highlight: { background: '#34d399', border: '#047857' }
        };
      default:
        return {
          background: '#6b7280', // Gray
          border: '#374151',
          highlight: { background: '#9ca3af', border: '#1f2937' }
        };
    }
  }

  // Helper function to determine node shape
  function getNodeShape(type) {
    switch (type) {
      case 'ambulance':
        return 'star';
      case 'hospital':
        return 'diamond';
      default:
        return 'dot';
    }
  }

  // Helper function to determine edge color
  function getEdgeColor(isInPath, isBlocked, isToll) {
    if (isBlocked) {
      return {
        color: '#ef4444', // Red
        highlight: '#dc2626',
        hover: '#f87171'
      };
    }
    if (isInPath) {
      return {
        color: '#10b981', // Green
        highlight: '#059669',
        hover: '#34d399'
      };
    }
    if (isToll) {
      return {
        color: '#f59e0b', // Orange/amber for tolls
        highlight: '#d97706',
        hover: '#fbbf24'
      };
    }
    return {
      color: '#6b7280', // Gray
      highlight: '#4b5563',
      hover: '#9ca3af'
    };
  }

  // Check if edge is in the shortest path
  function isEdgeInPath(edge, path) {
    if (path.length < 2) return false;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (edge.from === path[i] && edge.to === path[i + 1]) ||
        (edge.to === path[i] && edge.from === path[i + 1])
      ) {
        return true;
      }
    }
    return false;
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-300"
      style={{ minHeight: '500px' }}
    />
  );
}
