import React, { useState, useEffect } from 'react';
import MosaicGraph from './components/MosaicGraph';
import QueryInput from './components/QueryInput';
import { api } from './api';
import './App.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetchGraph();
  }, []);

  const processGraphData = (data) => {
    if (!data.nodes) return { nodes: [], edges: [] };

    const processedNodes = data.nodes.map(node => {
      // Map backend types to React Flow node types
      const backendType = node.data?.type?.toLowerCase() || 'default';

      let nodeType = 'default';
      if (['document', 'agency', 'action'].includes(backendType)) {
        nodeType = backendType; // e.g., 'document' maps to DocumentNode
      } else if (backendType === 'event') {
        nodeType = 'action'; // Map event to action for now
      }

      return {
        ...node,
        type: nodeType, // Valid React Flow type
      };
    });

    return { nodes: processedNodes, edges: data.edges || [] };
  };

  const fetchGraph = async () => {
    try {
      const data = await api.getGraph();
      if (data.nodes && data.nodes.length > 0) {
        const { nodes, edges } = processGraphData(data);
        setNodes(nodes);
        setEdges(edges);
        setShowWelcome(false);
      } else {
        setShowWelcome(true);
      }
    } catch (err) {
      console.error("Failed to fetch graph:", err);
      // Don't show error immediately on load, just show welcome
    }
  };

  const handleQuery = async (queryText) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.sendQuery(queryText);
      if (result.graph) {
        const { nodes, edges } = processGraphData(result.graph);
        setNodes(nodes);
        setEdges(edges);
        setShowWelcome(false);
      }
    } catch (err) {
      console.error("Query failed:", err);
      setError("Failed to process query. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await api.clearGraph();
      setNodes([]);
      setEdges([]);
      setShowWelcome(true);
    } catch (err) {
      console.error("Clear failed", err);
    }
  };

  const suggestedQueries = [
    "How do I get a US Student Visa?",
    "What documents do I need for OPT?",
    "Renewing a passport in Taiwan"
  ];

  return (
    <div className="App">
      {/* Header / Actions */}
      {!showWelcome && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 20,
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Graph
        </button>
      )}

      {error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px 20px',
          borderRadius: '4px',
          zIndex: 30
        }}>
          {error}
        </div>
      )}

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="welcome-container">
          <h1 className="welcome-title">Mosaic</h1>
          <p className="welcome-subtitle">Your interactive legal document assistant.</p>

          <div className="suggestions">
            {suggestedQueries.map((q, i) => (
              <div key={i} className="suggestion-chip" onClick={() => handleQuery(q)}>
                {q}
              </div>
            ))}
          </div>

          <QueryInput onQuery={handleQuery} isLoading={isLoading} />
        </div>
      )}

      {/* Graph Area */}
      <MosaicGraph initialNodes={nodes} initialEdges={edges} />

      {/* Floating Input (only show if not welcome screen) */}
      {!showWelcome && (
        <div className="floating-input-container">
          <QueryInput onQuery={handleQuery} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}

export default App;
