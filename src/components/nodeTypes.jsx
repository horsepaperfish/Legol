import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Building2, Activity, Calendar, AlertTriangle } from 'lucide-react';

const NodeBase = ({ data, Icon, color, borderColor }) => {
    return (
        <div style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: `2px solid ${borderColor}`,
            backgroundColor: 'white',
            minWidth: '150px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            position: 'relative'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                <Icon size={16} color={color} />
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{data.label}</span>
            </div>

            <div style={{ fontSize: '12px', color: '#666' }}>
                {data.description}
            </div>

            {data.deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#d9534f', marginTop: '5px' }}>
                    <Calendar size={12} />
                    <span>{data.deadline}</span>
                </div>
            )}

            {data.agency && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0275d8', marginTop: '2px' }}>
                    <Building2 size={12} />
                    <span>{data.agency}</span>
                </div>
            )}

            {data.status === 'warning' && (
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#fff3cd', padding: '4px', borderRadius: '50%', border: '1px solid #ffeeba' }}>
                    <AlertTriangle size={16} color="#856404" />
                </div>
            )}

            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

export const DocumentNode = memo((props) => (
    <NodeBase {...props} Icon={FileText} color="#007bff" borderColor="#badce3" />
));

export const AgencyNode = memo((props) => (
    <NodeBase {...props} Icon={Building2} color="#6610f2" borderColor="#e2cdfc" />
));

export const ActionNode = memo((props) => (
    <NodeBase {...props} Icon={Activity} color="#28a745" borderColor="#c3e6cb" />
));

export const DefaultNode = memo((props) => (
    <NodeBase {...props} Icon={Activity} color="#6c757d" borderColor="#dee2e6" />
));
