import React, { useState } from 'react';

const QueryInput = ({ onQuery, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onQuery(query);
            setQuery('');
        }
    };

    return (
        <div className="query-input-component" style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a legal question..."
                disabled={isLoading}
                style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !query.trim()}
                style={{
                    padding: '0 24px',
                    backgroundColor: isLoading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                }}
            >
                {isLoading ? 'Thinking...' : 'Ask'}
            </button>
        </div>
    );
};

export default QueryInput;
