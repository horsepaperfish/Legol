import React, { useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DocumentNode, AgencyNode, ActionNode, DefaultNode } from './nodeTypes';

const MosaicGraph = ({ initialNodes, initialEdges }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = React.useMemo(() => ({
        document: DocumentNode,
        agency: AgencyNode,
        action: ActionNode,
        default: DefaultNode
    }), []);

    useEffect(() => {
        if (initialNodes) setNodes(initialNodes);
        if (initialEdges) setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default MosaicGraph;
