import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    FileText, Scale, AlertTriangle, CheckCircle,
    ChevronRight, ZoomIn, ZoomOut, Maximize2, X, Clock,
    Shield, BookOpen, Landmark, Users, Briefcase, Home, GitBranch
} from 'lucide-react';

/* ─── Navbar (consistent with other pages) ─── */
const Navbar = () => {
    const navigate = useNavigate();
    const navItems = ['Home', 'Chat', 'Timeline', 'Resources'];

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 48px',
            width: '100%',
            position: 'fixed',
            top: 0,
            zIndex: 100,
            boxSizing: 'border-box',
            background: 'rgba(232, 237, 242, 0.75)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,51,102,0.06)'
        }}>
            <div
                style={{ fontSize: '24px', fontWeight: '700', color: '#003366', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                LEGOL
            </div>

            <div style={{
                background: 'rgba(230, 235, 240, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '4px 6px',
                borderRadius: '100px',
                display: 'flex',
                gap: '4px'
            }}>
                {navItems.map((item) => (
                    <div key={item}
                        onClick={() => {
                            if (item === 'Home') navigate('/');
                            if (item === 'Chat') navigate('/chat');
                            if (item === 'Timeline') navigate('/timeline');
                            if (item === 'Resources') navigate('/resources');
                        }}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '100px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#64748b',
                            cursor: 'pointer',
                            background: 'transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#003366';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.background = 'transparent';
                        }}>
                        {item}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span
                    onClick={() => navigate('/login')}
                    style={{ fontSize: '14px', fontWeight: '500', color: '#003366', cursor: 'pointer', transition: 'opacity 0.25s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >Sign In</span>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: '#003366',
                        color: 'white',
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 51, 102, 0.2)',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 51, 102, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 51, 102, 0.2)';
                    }}
                >My Profile</button>
            </div>
        </nav>
    );
};


/* ═══════════════════════════════════════════════════
   FLOWCHART DATA
   ═══════════════════════════════════════════════════ */

const FLOWCHART_DATA = {
    documents: [
        { id: 'birth-cert', label: 'Birth Certificate', icon: FileText, category: 'Identity', status: 'verified' },
        { id: 'passport', label: 'Passport Copy', icon: Shield, category: 'Identity', status: 'verified' },
        { id: 'n400', label: 'Form N-400', icon: BookOpen, category: 'Applications', status: 'uploaded' },
        { id: 'tax-returns', label: 'Tax Returns (5yr)', icon: Briefcase, category: 'Financial', status: 'uploaded' },
        { id: 'employment-letter', label: 'Employment Letter', icon: Briefcase, category: 'Work', status: 'uploaded' },
        { id: 'marriage-cert', label: 'Marriage Certificate', icon: Users, category: 'Family', status: 'verified' },
        { id: 'background-check', label: 'FBI Background Check', icon: Shield, category: 'Background', status: 'uploaded' },
        { id: 'lease-agreement', label: 'Lease Agreement', icon: Home, category: 'Residence', status: 'verified' },
    ],
    analyses: [
        { id: 'identity-verification', label: 'Identity Verification', icon: Shield, description: 'Cross-references identity documents for authenticity and consistency' },
        { id: 'eligibility-check', label: 'Eligibility Assessment', icon: Scale, description: 'Evaluates applicant qualifications against statutory requirements' },
        { id: 'financial-review', label: 'Financial Review', icon: Briefcase, description: 'Analyzes financial standing and tax compliance history' },
        { id: 'background-analysis', label: 'Background Analysis', icon: AlertTriangle, description: 'Reviews criminal history and moral character requirements' },
        { id: 'residency-proof', label: 'Residency Verification', icon: Home, description: 'Confirms continuous residency and physical presence' },
    ],
    legalTexts: [
        { id: 'ina-316', label: 'INA § 316', subtitle: 'General Naturalization Requirements', description: 'Residency, physical presence, and good moral character requirements for naturalization.', icon: Landmark },
        { id: 'ina-312', label: 'INA § 312', subtitle: 'English & Civics Requirements', description: 'Language proficiency and knowledge of US history and government.', icon: BookOpen },
        { id: 'ina-101', label: 'INA § 101(f)', subtitle: 'Good Moral Character', description: 'Statutory bars and conditions defining good moral character for immigration purposes.', icon: Scale },
        { id: '8cfr-316', label: '8 CFR § 316.2', subtitle: 'Continuous Residence', description: 'Regulatory definition of continuous residence and exceptions for breaks.', icon: Clock },
        { id: '8cfr-319', label: '8 CFR § 319.1', subtitle: 'Spouse of US Citizen', description: 'Reduced residency requirements for applicants married to US citizens.', icon: Users },
        { id: 'uscis-policy', label: 'USCIS Policy Manual', subtitle: 'Vol. 12, Part D', description: 'General eligibility requirements including age, residency, and moral character.', icon: BookOpen },
    ],
    connections: [
        { from: 'birth-cert', to: 'identity-verification' },
        { from: 'passport', to: 'identity-verification' },
        { from: 'n400', to: 'eligibility-check' },
        { from: 'tax-returns', to: 'financial-review' },
        { from: 'employment-letter', to: 'financial-review' },
        { from: 'marriage-cert', to: 'eligibility-check' },
        { from: 'background-check', to: 'background-analysis' },
        { from: 'lease-agreement', to: 'residency-proof' },
        { from: 'tax-returns', to: 'residency-proof' },
        { from: 'identity-verification', to: 'ina-316' },
        { from: 'eligibility-check', to: 'ina-316' },
        { from: 'eligibility-check', to: '8cfr-319' },
        { from: 'eligibility-check', to: 'ina-312' },
        { from: 'financial-review', to: 'ina-101' },
        { from: 'financial-review', to: 'ina-316' },
        { from: 'background-analysis', to: 'ina-101' },
        { from: 'background-analysis', to: 'uscis-policy' },
        { from: 'residency-proof', to: '8cfr-316' },
        { from: 'residency-proof', to: 'ina-316' },
    ]
};


/* ═══════════════════════════════════════════════════
   Flow Node (HTML-based, no SVG foreignObject)
   ═══════════════════════════════════════════════════ */
const FlowNode = ({ id, label, subtitle, icon: Icon, type, status, highlighted, dimmed, onClick, onHover, onLeave, delay }) => {
    const isDoc = type === 'document';
    const isAnalysis = type === 'analysis';
    const isLegal = type === 'legal';

    let tagBg, tagColor, tagText;
    if (isDoc) {
        tagBg = status === 'verified' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(37, 99, 235, 0.1)';
        tagColor = status === 'verified' ? '#28a745' : '#2563eb';
        tagText = status === 'verified' ? 'Verified' : 'Uploaded';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: dimmed ? 0.3 : 1, y: 0 }}
            transition={{ duration: 0.45, delay: delay || 0, ease: [0.215, 0.61, 0.355, 1] }}
            onClick={() => onClick && onClick(id)}
            onMouseEnter={() => onHover && onHover(id)}
            onMouseLeave={() => onLeave && onLeave()}
            style={{
                borderRadius: '16px',
                background: highlighted
                    ? 'rgba(255, 255, 255, 0.95)'
                    : isAnalysis ? 'rgba(0, 51, 102, 0.06)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${highlighted ? 'rgba(0, 51, 102, 0.2)' : 'rgba(0, 51, 102, 0.08)'}`,
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.25s ease',
                boxShadow: highlighted
                    ? '0 8px 28px rgba(0, 51, 102, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : '0 2px 10px rgba(0, 51, 102, 0.04), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {Icon && (
                    <div style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        background: isAnalysis ? 'rgba(0, 51, 102, 0.08)' : 'rgba(0, 51, 102, 0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Icon size={14} color="#003366" strokeWidth={1.8} />
                    </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                        fontSize: '13px', fontWeight: '600', color: '#003366',
                        lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                        {label}
                    </div>
                    {subtitle && (
                        <div style={{
                            fontSize: '11px', color: '#8896a6', marginTop: '1px',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>

            {isDoc && tagText && (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '2px 8px', borderRadius: '100px', background: tagBg, alignSelf: 'flex-start'
                }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: tagColor }} />
                    <span style={{ fontSize: '10px', fontWeight: '600', color: tagColor, letterSpacing: '0.3px' }}>{tagText}</span>
                </div>
            )}
            {isAnalysis && (
                <span style={{ fontSize: '10px', color: 'rgba(0,51,102,0.45)', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    AI Analysis
                </span>
            )}
            {isLegal && (
                <span style={{ fontSize: '10px', color: 'rgba(0,51,102,0.4)', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Legal Reference
                </span>
            )}
        </motion.div>
    );
};


/* ═══════════════════════════════════════════════════
   Detail Panel (slide-in)
   ═══════════════════════════════════════════════════ */
const DetailPanel = ({ node, type, onClose }) => {
    if (!node) return null;

    const relatedEdges = FLOWCHART_DATA.connections.filter(c => c.from === node.id || c.to === node.id);
    const allNodes = [...FLOWCHART_DATA.documents, ...FLOWCHART_DATA.analyses, ...FLOWCHART_DATA.legalTexts];
    const connectedIds = relatedEdges.map(e => e.from === node.id ? e.to : e.from);
    const connectedNodes = allNodes.filter(n => connectedIds.includes(n.id));

    return (
        <motion.div
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
                position: 'fixed', top: '84px', right: '20px',
                width: '320px', maxHeight: 'calc(100vh - 104px)',
                background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(24px)',
                borderRadius: '20px', border: '1px solid rgba(0, 51, 102, 0.1)',
                boxShadow: '0 16px 48px rgba(0, 51, 102, 0.12)',
                padding: '28px 24px', zIndex: 60, overflowY: 'auto', boxSizing: 'border-box'
            }}
        >
            <button onClick={onClose} style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(0,51,102,0.05)', border: 'none',
                borderRadius: '8px', padding: '6px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <X size={16} color="#003366" />
            </button>

            <div style={{
                fontSize: '10px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
                color: type === 'document' ? '#2563eb' : type === 'analysis' ? '#003366' : '#64748b',
                marginBottom: '12px'
            }}>
                {type === 'document' ? 'Source Document' : type === 'analysis' ? 'AI Analysis' : 'Legal Reference'}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#003366', margin: '0 0 6px', lineHeight: '1.3' }}>
                {node.label}
            </h3>

            {node.subtitle && <p style={{ fontSize: '14px', color: '#8896a6', margin: '0 0 16px', lineHeight: '1.5' }}>{node.subtitle}</p>}
            {node.description && <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px', lineHeight: '1.65' }}>{node.description}</p>}

            {node.status && (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '100px', marginBottom: '24px',
                    background: node.status === 'verified' ? 'rgba(40,167,69,0.08)' : 'rgba(37,99,235,0.08)'
                }}>
                    {node.status === 'verified' ? <CheckCircle size={14} color="#28a745" /> : <Clock size={14} color="#2563eb" />}
                    <span style={{ fontSize: '12px', fontWeight: '600', color: node.status === 'verified' ? '#28a745' : '#2563eb' }}>
                        {node.status === 'verified' ? 'Verified' : 'Uploaded'}
                    </span>
                </div>
            )}

            {connectedNodes.length > 0 && (
                <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(0,51,102,0.4)', marginBottom: '12px' }}>
                        Connected to
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {connectedNodes.map(cn => (
                            <div key={cn.id} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 14px', borderRadius: '12px',
                                background: 'rgba(0,51,102,0.03)', border: '1px solid rgba(0,51,102,0.06)'
                            }}>
                                {cn.icon && <cn.icon size={14} color="#003366" />}
                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#003366' }}>{cn.label}</span>
                                <ChevronRight size={12} color="#8896a6" style={{ marginLeft: 'auto' }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};


/* ═══════════════════════════════════════════════════
   SVG Connector Lines (drawn in an overlay SVG)
   ═══════════════════════════════════════════════════ */
const ConnectorLines = ({ nodeRefs, connections, highlightedIds, hasHighlight, zoom, pan }) => {
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        // Recalculate connector paths when refs change
        const timer = setTimeout(() => {
            const newPaths = [];
            connections.forEach((conn, i) => {
                const fromEl = nodeRefs.current[conn.from];
                const toEl = nodeRefs.current[conn.to];
                if (!fromEl || !toEl) return;

                const container = fromEl.closest('[data-canvas]');
                if (!container) return;
                const cRect = container.getBoundingClientRect();
                const fRect = fromEl.getBoundingClientRect();
                const tRect = toEl.getBoundingClientRect();

                const fx = (fRect.right - cRect.left) / zoom;
                const fy = (fRect.top + fRect.height / 2 - cRect.top) / zoom;
                const tx = (tRect.left - cRect.left) / zoom;
                const ty = (tRect.top + tRect.height / 2 - cRect.top) / zoom;
                const mx = (fx + tx) / 2;

                const highlighted = hasHighlight && highlightedIds.has(conn.from) && highlightedIds.has(conn.to);

                newPaths.push({
                    key: i,
                    d: `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`,
                    highlighted
                });
            });
            setPaths(newPaths);
        }, 100);
        return () => clearTimeout(timer);
    }, [connections, highlightedIds, hasHighlight, zoom, pan, nodeRefs]);

    if (paths.length === 0) return null;

    return (
        <svg style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 1, overflow: 'visible'
        }}>
            <defs>
                <marker id="ah" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" fill="rgba(0,51,102,0.15)" />
                </marker>
                <marker id="ah-active" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" fill="rgba(0,51,102,0.5)" />
                </marker>
            </defs>
            {paths.map(p => (
                <path
                    key={p.key}
                    d={p.d}
                    fill="none"
                    stroke={p.highlighted ? 'rgba(0,51,102,0.45)' : 'rgba(0,51,102,0.1)'}
                    strokeWidth={p.highlighted ? 2 : 1.2}
                    strokeDasharray={p.highlighted ? 'none' : '6 4'}
                    markerEnd={p.highlighted ? 'url(#ah-active)' : 'url(#ah)'}
                    style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                />
            ))}
        </svg>
    );
};


/* ═══════════════════════════════════════════════════
   Main Flowchart Component
   ═══════════════════════════════════════════════════ */
const Flowchart = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const nodeRefs = useRef({});

    const highlightDoc = searchParams.get('doc');

    /* ─── Determine highlighted nodes ─── */
    const getHighlighted = useCallback(() => {
        const active = hoveredNode || selectedNode?.id || highlightDoc;
        if (!active) return new Set();
        const ids = new Set([active]);
        FLOWCHART_DATA.connections.forEach(c => {
            if (c.from === active || c.to === active) { ids.add(c.from); ids.add(c.to); }
        });
        const first = new Set(ids);
        FLOWCHART_DATA.connections.forEach(c => {
            if (first.has(c.from) || first.has(c.to)) { ids.add(c.from); ids.add(c.to); }
        });
        return ids;
    }, [hoveredNode, selectedNode, highlightDoc]);

    const highlightedIds = getHighlighted();
    const hasHighlight = highlightedIds.size > 0;

    /* ─── Pan handlers ─── */
    const handleMouseDown = (e) => {
        if (e.target.closest('[data-node]')) return;
        setIsPanning(true);
        panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };
    const handleMouseMove = (e) => {
        if (!isPanning) return;
        setPan({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
    };
    const handleMouseUp = () => setIsPanning(false);

    /* ─── Zoom with wheel ─── */
    const canvasRef = useRef(null);
    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;
        const onWheel = (e) => {
            e.preventDefault();
            setZoom(z => Math.min(2, Math.max(0.35, z + (e.deltaY > 0 ? -0.06 : 0.06))));
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    /* ─── Node click ─── */
    const handleNodeClick = (id) => {
        const doc = FLOWCHART_DATA.documents.find(d => d.id === id);
        if (doc) { setSelectedNode(doc); setSelectedType('document'); return; }
        const analysis = FLOWCHART_DATA.analyses.find(a => a.id === id);
        if (analysis) { setSelectedNode(analysis); setSelectedType('analysis'); return; }
        const legal = FLOWCHART_DATA.legalTexts.find(l => l.id === id);
        if (legal) { setSelectedNode(legal); setSelectedType('legal'); return; }
    };

    /* ─── Register node ref ─── */
    const setNodeRef = useCallback((id, el) => {
        if (el) nodeRefs.current[id] = el;
    }, []);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(145deg, #e8edf2 0%, #d5dde6 35%, #c2cdda 65%, #b8c5d4 100%)',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'inherit'
        }}>
            <Navbar />

            {/* Background blurs */}
            <div style={{
                position: 'absolute', top: '-8%', left: '-6%',
                width: '55vw', height: '55vh',
                background: 'radial-gradient(circle, rgba(0,51,102,0.07) 0%, transparent 70%)',
                filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} />
            <div style={{
                position: 'absolute', bottom: '-8%', right: '-4%',
                width: '45vw', height: '45vh',
                background: 'radial-gradient(circle, rgba(180,195,210,0.2) 0%, transparent 70%)',
                filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} />

            {/* Page title */}
            <div style={{
                position: 'fixed', top: '88px', left: '32px', zIndex: 40,
                display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: '20px', fontWeight: '600', color: '#003366', margin: 0, letterSpacing: '-0.3px' }}
                >
                    Document Flowchart
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    style={{ fontSize: '12px', color: '#8896a6', margin: 0, maxWidth: '260px', lineHeight: '1.45' }}
                >
                    Trace how each document connects to AI analysis and legal references
                </motion.p>
            </div>

            {/* Zoom controls */}
            <div style={{ position: 'fixed', bottom: '24px', left: '24px', display: 'flex', gap: '6px', zIndex: 40 }}>
                {[
                    { icon: ZoomIn, action: () => setZoom(z => Math.min(2, z + 0.15)) },
                    { icon: ZoomOut, action: () => setZoom(z => Math.max(0.35, z - 0.15)) },
                    { icon: Maximize2, action: () => { setZoom(1); setPan({ x: 0, y: 0 }); } },
                ].map(({ icon: Ic, action }, i) => (
                    <button key={i} onClick={action} style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0,51,102,0.1)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,51,102,0.06)', transition: 'background 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.95)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                    >
                        <Ic size={15} color="#003366" />
                    </button>
                ))}
                <div style={{
                    padding: '6px 12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,51,102,0.06)',
                    fontSize: '11px', fontWeight: '600', color: '#003366',
                    display: 'flex', alignItems: 'center'
                }}>
                    {Math.round(zoom * 100)}%
                </div>
            </div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                    position: 'fixed', bottom: '24px',
                    right: selectedNode ? '356px' : '24px',
                    display: 'flex', gap: '14px', padding: '10px 18px',
                    borderRadius: '12px', background: 'rgba(255,255,255,0.65)',
                    backdropFilter: 'blur(16px)', border: '1px solid rgba(0,51,102,0.08)',
                    zIndex: 40, transition: 'right 0.35s ease'
                }}
            >
                {[
                    { label: 'Your Documents', color: '#2563eb' },
                    { label: 'AI Analysis', color: '#003366' },
                    { label: 'Legal Text', color: '#64748b' },
                ].map(({ label, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, opacity: 0.6 }} />
                        <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>{label}</span>
                    </div>
                ))}
            </motion.div>

            {/* ═══ CANVAS ═══ */}
            <div
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    position: 'absolute',
                    top: '72px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    cursor: isPanning ? 'grabbing' : 'grab',
                    overflow: 'hidden',
                    zIndex: 1
                }}
            >
                <div
                    data-canvas
                    style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'top left',
                        transition: isPanning ? 'none' : 'transform 0.12s ease-out',
                        position: 'relative',
                        width: '1200px',
                        height: '900px',
                        padding: '40px 0 0 220px'
                    }}
                >
                    {/* Connector lines */}
                    <ConnectorLines
                        nodeRefs={nodeRefs}
                        connections={FLOWCHART_DATA.connections}
                        highlightedIds={highlightedIds}
                        hasHighlight={hasHighlight}
                        zoom={zoom}
                        pan={pan}
                    />

                    {/* Three columns of nodes */}
                    <div style={{
                        display: 'flex',
                        gap: '80px',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        {/* ─── Column 1: Documents ─── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '220px', flexShrink: 0 }}>
                            <div style={{
                                fontSize: '10px', fontWeight: '600', letterSpacing: '2.5px',
                                textTransform: 'uppercase', color: 'rgba(0,51,102,0.3)',
                                marginBottom: '6px', paddingLeft: '4px'
                            }}>
                                Your Documents
                                <span style={{ fontSize: '10px', fontWeight: '400', marginLeft: '8px', color: 'rgba(0,51,102,0.2)' }}>
                                    {FLOWCHART_DATA.documents.length} files
                                </span>
                            </div>
                            {FLOWCHART_DATA.documents.map((doc, i) => (
                                <div key={doc.id} ref={(el) => setNodeRef(doc.id, el)} data-node>
                                    <FlowNode
                                        id={doc.id}
                                        label={doc.label}
                                        icon={doc.icon}
                                        type="document"
                                        status={doc.status}
                                        highlighted={highlightedIds.has(doc.id) || doc.id === highlightDoc}
                                        dimmed={hasHighlight && !highlightedIds.has(doc.id)}
                                        onClick={handleNodeClick}
                                        onHover={setHoveredNode}
                                        onLeave={() => setHoveredNode(null)}
                                        delay={0.05 + i * 0.04}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ─── Column 2: Analyses ─── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '240px', flexShrink: 0, paddingTop: '28px' }}>
                            <div style={{
                                fontSize: '10px', fontWeight: '600', letterSpacing: '2.5px',
                                textTransform: 'uppercase', color: 'rgba(0,51,102,0.3)',
                                marginBottom: '6px', paddingLeft: '4px'
                            }}>
                                AI Analysis
                                <span style={{ fontSize: '10px', fontWeight: '400', marginLeft: '8px', color: 'rgba(0,51,102,0.2)' }}>Processing</span>
                            </div>
                            {FLOWCHART_DATA.analyses.map((a, i) => (
                                <div key={a.id} ref={(el) => setNodeRef(a.id, el)} data-node>
                                    <FlowNode
                                        id={a.id}
                                        label={a.label}
                                        icon={a.icon}
                                        type="analysis"
                                        highlighted={highlightedIds.has(a.id)}
                                        dimmed={hasHighlight && !highlightedIds.has(a.id)}
                                        onClick={handleNodeClick}
                                        onHover={setHoveredNode}
                                        onLeave={() => setHoveredNode(null)}
                                        delay={0.2 + i * 0.05}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ─── Column 3: Legal Texts ─── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '240px', flexShrink: 0, paddingTop: '14px' }}>
                            <div style={{
                                fontSize: '10px', fontWeight: '600', letterSpacing: '2.5px',
                                textTransform: 'uppercase', color: 'rgba(0,51,102,0.3)',
                                marginBottom: '6px', paddingLeft: '4px'
                            }}>
                                Legal References
                                <span style={{ fontSize: '10px', fontWeight: '400', marginLeft: '8px', color: 'rgba(0,51,102,0.2)' }}>Source texts</span>
                            </div>
                            {FLOWCHART_DATA.legalTexts.map((l, i) => (
                                <div key={l.id} ref={(el) => setNodeRef(l.id, el)} data-node>
                                    <FlowNode
                                        id={l.id}
                                        label={l.label}
                                        subtitle={l.subtitle}
                                        icon={l.icon}
                                        type="legal"
                                        highlighted={highlightedIds.has(l.id)}
                                        dimmed={hasHighlight && !highlightedIds.has(l.id)}
                                        onClick={handleNodeClick}
                                        onHover={setHoveredNode}
                                        onLeave={() => setHoveredNode(null)}
                                        delay={0.35 + i * 0.05}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail panel */}
            <AnimatePresence>
                {selectedNode && (
                    <DetailPanel
                        node={selectedNode}
                        type={selectedType}
                        onClose={() => { setSelectedNode(null); setSelectedType(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Flowchart;
