import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Paperclip, X } from 'lucide-react';
import { api } from '../api';

/* ─── Navbar ─── */
const Navbar = ({ activePage = 'Chat' }) => {
    const navigate = useNavigate();
    const navItems = ['Home', 'Chat', 'Timeline', 'Resources'];

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '32px 64px',
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 20,
            boxSizing: 'border-box'
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
                            fontWeight: item === activePage ? '600' : '500',
                            color: item === activePage ? '#003366' : '#64748b',
                            cursor: 'pointer',
                            background: item === activePage ? '#FFFFFF' : 'transparent',
                            boxShadow: item === activePage ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (item !== activePage) {
                                e.currentTarget.style.color = '#003366';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (item !== activePage) {
                                e.currentTarget.style.color = '#64748b';
                                e.currentTarget.style.background = 'transparent';
                            }
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

/* ─── Filter Dropdown (bottom bar) ─── */
const FilterDropdown = ({ label, value, options, isOpen, onToggle, onChange }) => {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customValue, setCustomValue] = useState('');

    const handleOptionClick = (option) => {
        if (option === 'Other...') {
            setShowCustomInput(true);
        } else {
            onChange(option);
            onToggle();
        }
    };

    const handleCustomSubmit = () => {
        if (customValue.trim()) {
            onChange(customValue.trim());
            setCustomValue('');
            setShowCustomInput(false);
            onToggle();
        }
    };

    return (
        <div style={{ position: 'relative', flex: 1 }}>
            <button
                onClick={onToggle}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '60px',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 20px rgba(0, 51, 102, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#003366',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                }}
            >
                <span>
                    {label}{value && ' : '}
                    {value && <em style={{ fontStyle: 'italic', fontWeight: '600' }}>{value}</em>}
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && options && (
                <div style={{
                    position: 'absolute',
                    bottom: '110%',
                    left: 0,
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    padding: '12px 0',
                    boxShadow: '0 8px 32px rgba(0, 51, 102, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                    zIndex: 30,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                }}>
                    {!showCustomInput ? (
                        options.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: '#003366',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(0, 51, 102, 0.05)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                                type="text"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCustomSubmit();
                                    if (e.key === 'Escape') {
                                        setShowCustomInput(false);
                                        setCustomValue('');
                                    }
                                }}
                                placeholder={`Enter ${label.toLowerCase()}...`}
                                autoFocus
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid rgba(0, 51, 102, 0.2)',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => {
                                        setShowCustomInput(false);
                                        setCustomValue('');
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        background: 'transparent',
                                        color: '#64748b',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCustomSubmit}
                                    style={{
                                        padding: '6px 12px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        background: '#003366',
                                        color: 'white',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── Sample documents data ─── */
const DOCUMENTS = [
    {
        id: 'birth-cert',
        title: 'Birth Certificate (Original)',
        source: 'Vital Records Office',
        due: 'Feb 1, 2026',
        description: 'Original or certified copy of birth certificate',
        status: 'VERIFIED',
        category: 'Identity'
    },
    {
        id: 'passport',
        title: 'Passport Copy',
        source: 'Department of State',
        due: null,
        description: 'Valid passport identification page copy',
        status: 'VERIFIED',
        category: 'Identity'
    },
    {
        id: 'n400',
        title: 'Form N-400 (Naturalization Application)',
        source: 'USCIS',
        due: 'Feb 7, 2026',
        description: 'Application for naturalization form',
        status: 'UPLOADED',
        category: 'Applications'
    },
    {
        id: 'tax-returns',
        title: 'Tax Returns (Last 5 Years)',
        source: 'IRS',
        due: 'Feb 14, 2026',
        description: 'Federal tax return transcripts for the last 5 years',
        status: 'UPLOADED',
        category: 'Financial'
    },
    {
        id: 'employment-letter',
        title: 'Employment Verification Letter',
        source: 'Current Employer',
        due: 'Feb 10, 2026',
        description: 'Letter confirming current employment status',
        status: 'UPLOADED',
        category: 'Work'
    },
    {
        id: 'marriage-cert',
        title: 'Marriage Certificate',
        source: 'County Clerk',
        due: null,
        description: 'Certified copy of marriage certificate',
        status: 'VERIFIED',
        category: 'Family'
    },
    {
        id: 'background-check',
        title: 'FBI Background Check',
        source: 'FBI',
        due: 'Mar 1, 2026',
        description: 'Criminal background check clearance',
        status: 'UPLOADED',
        category: 'Background'
    },
    {
        id: 'lease-agreement',
        title: 'Lease Agreement',
        source: 'Landlord / Property Management',
        due: null,
        description: 'Current residential lease or mortgage statement',
        status: 'VERIFIED',
        category: 'Residence'
    }
];

const DOC_CATEGORIES = ['All Documents', 'Identity', 'Applications', 'Financial', 'Work', 'Family', 'Background', 'Residence'];

/* ─── Document Card (draggable) ─── */
const DocumentCard = ({ doc }) => {
    const isVerified = doc.status === 'VERIFIED';

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', `[Document: ${doc.title}]`);
        e.dataTransfer.setData('application/json', JSON.stringify(doc));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '20px 24px',
                cursor: 'grab',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 51, 102, 0.04)',
                borderLeft: `3px solid ${isVerified ? '#28a745' : '#2563eb'}`,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 51, 102, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 51, 102, 0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                {/* Status Icon */}
                <div style={{ paddingTop: '2px', flexShrink: 0 }}>
                    {isVerified
                        ? <CheckCircle size={22} color="#28a745" />
                        : <AlertCircle size={22} color="#2563eb" />
                    }
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <h4 style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1E272D',
                            lineHeight: '1.35'
                        }}>
                            {doc.title}
                        </h4>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: isVerified ? '#155724' : '#004085',
                            letterSpacing: '0.3px',
                            flexShrink: 0,
                            paddingTop: '2px'
                        }}>
                            {doc.status}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#8896a6' }}>{doc.source}</span>
                        {doc.due && (
                            <>
                                <span style={{ fontSize: '13px', color: '#8896a6' }}>·</span>
                                <span style={{ fontSize: '13px', color: '#dc3545', fontWeight: '500' }}>Due: {doc.due}</span>
                            </>
                        )}
                    </div>

                    <p style={{
                        margin: '6px 0 0',
                        fontSize: '13px',
                        color: '#8896a6',
                        lineHeight: '1.45'
                    }}>
                        {doc.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Chat Page ─── */
const Chat = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Hello! I\u2019m your LEGOL immigration assistant. I can help answer questions about dual citizenship, work visas, document requirements, and more. How can I assist you today?"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All Documents');
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [studentCountry, setStudentCountry] = useState('Singapore');
    const [institution, setInstitution] = useState('Carnegie Mellon University');
    const [topic, setTopic] = useState(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    const filteredDocs = activeCategory === 'All Documents'
        ? DOCUMENTS
        : DOCUMENTS.filter(d => d.category === activeCategory);

    /* ── Send message ── */
    const handleSend = async () => {
        if ((!query.trim() && uploadedFiles.length === 0) || isLoading) return;

        const userMessage = query.trim();
        let messageText = userMessage;
        let fileContents = [];

        // Add user context from dropdowns
        let contextPrefix = '';
        if (studentCountry || institution || topic) {
            contextPrefix = '[User Context: ';
            const contexts = [];
            if (studentCountry) contexts.push(`Student from ${studentCountry}`);
            if (institution) contexts.push(`Studying at ${institution}`);
            if (topic) contexts.push(`Topic: ${topic}`);
            contextPrefix += contexts.join(', ') + ']\n\n';
        }

        // Upload files if any
        if (uploadedFiles.length > 0) {
            try {
                const uploadResult = await api.uploadFiles(uploadedFiles);
                const fileNames = uploadResult.files.map(f => f.filename).join(', ');
                messageText = userMessage
                    ? `${userMessage}\n\n[Uploaded files: ${fileNames}]`
                    : `[Uploaded files: ${fileNames}]`;

                // Store file contents for sending to Claude
                fileContents = uploadResult.files;
            } catch (err) {
                console.error('File upload failed:', err);
                setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, file upload failed. Please try again.' }]);
                setIsLoading(false);
                return;
            }
        }

        const newMessages = [...messages, { role: 'user', text: messageText }];
        setMessages(newMessages);
        setQuery('');
        setUploadedFiles([]);
        setIsLoading(true);

        try {
            // Send conversation history for context (excluding the initial greeting)
            const history = newMessages.slice(1).map(msg => ({
                role: msg.role,
                text: msg.text
            }));

            // Add context prefix to the actual message sent to Claude
            const messageWithContext = contextPrefix + messageText;

            const result = await api.chat(messageWithContext, history, fileContents);
            if (result.answer) {
                setMessages(prev => [...prev, { role: 'assistant', text: result.answer }]);
            }
        } catch (err) {
            console.error('Chat query failed:', err);
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleDropdown = (name) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    /* ── Drag-and-drop handlers for the input area ── */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const jsonData = e.dataTransfer.getData('application/json');
        if (jsonData) {
            try {
                const doc = JSON.parse(jsonData);
                const mention = `[📄 ${doc.title}] `;
                setQuery(prev => prev + mention);
                inputRef.current?.focus();
            } catch { /* ignore bad data */ }
            return;
        }

        const text = e.dataTransfer.getData('text/plain');
        if (text) {
            setQuery(prev => prev + text);
            inputRef.current?.focus();
        }
    };

    return (
        <div style={{
            height: '100vh',
            background: '#EEF2F7',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Background Gradient Blobs */}
            <div style={{
                position: 'absolute',
                top: '-5%',
                left: '10%',
                width: '80vw',
                height: '70vh',
                background: 'radial-gradient(ellipse, rgba(0, 51, 102, 0.18) 0%, rgba(0, 51, 102, 0.08) 40%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                top: '30%',
                left: '25%',
                width: '50vw',
                height: '50vh',
                background: 'radial-gradient(ellipse, rgba(100, 140, 200, 0.15) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '40vh',
                background: 'linear-gradient(to top, rgba(220, 228, 240, 0.6), transparent)',
                zIndex: 0
            }} />

            <Navbar activePage="Chat" />

            {/* ─── Two-Column Layout ─── */}
            <div style={{
                flex: 1,
                display: 'flex',
                gap: '24px',
                position: 'relative',
                zIndex: 10,
                paddingTop: '110px',
                paddingBottom: '32px',
                paddingLeft: '48px',
                paddingRight: '48px',
                maxWidth: '1440px',
                width: '100%',
                margin: '0 auto',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}>

                {/* ─── LEFT: Chat Column ─── */}
                <div style={{
                    flex: '1 1 55%',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    overflow: 'hidden'
                }}>
                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        paddingBottom: '20px',
                        paddingRight: '8px'
                    }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '18px 22px',
                                    borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    background: msg.role === 'user'
                                        ? 'rgba(0, 51, 102, 0.85)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                    color: msg.role === 'user' ? '#FFFFFF' : '#003366',
                                    fontSize: '15px',
                                    lineHeight: '1.65',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)'
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '18px 22px',
                                borderRadius: '20px 20px 20px 4px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                color: '#64748b',
                                fontSize: '15px',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 12px rgba(0, 51, 102, 0.08)'
                            }}>
                                Thinking...
                            </div>
                        )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>
                        <FilterDropdown
                            label="International Student"
                            value={studentCountry}
                            isOpen={openDropdown === 'student'}
                            onToggle={() => toggleDropdown('student')}
                            onChange={setStudentCountry}
                            options={['Singapore', 'India', 'China', 'South Korea', 'Japan', 'Other...']}
                        />
                        <FilterDropdown
                            label="Institution"
                            value={institution}
                            isOpen={openDropdown === 'institution'}
                            onToggle={() => toggleDropdown('institution')}
                            onChange={setInstitution}
                            options={['Carnegie Mellon University', 'MIT', 'Stanford', 'Harvard', 'Other...']}
                        />
                        <FilterDropdown
                            label="Topic"
                            value={topic}
                            isOpen={openDropdown === 'topic'}
                            onToggle={() => toggleDropdown('topic')}
                            onChange={setTopic}
                            options={['Work Visa', 'Financial Support', 'Immigration', 'Other...']}
                        />
                    </div>

                    {/* Uploaded Files Display */}
                    {uploadedFiles.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '8px'
                        }}>
                            {uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        background: 'rgba(0, 51, 102, 0.08)',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#003366'
                                    }}
                                >
                                    <span>{file.name}</span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <X size={14} color="#003366" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Input Bar (drop target) */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: isDragOver ? 'rgba(0, 51, 102, 0.06)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '16px',
                            padding: '6px 8px 6px 24px',
                            boxShadow: isDragOver
                                ? '0 0 0 2px rgba(0, 51, 102, 0.25), 0 4px 20px rgba(0, 51, 102, 0.1)'
                                : '0 4px 20px rgba(0, 51, 102, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isDragOver ? 'Drop document here...' : 'Ask anything...'}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: '15px',
                                color: '#003366',
                                fontFamily: 'inherit',
                                padding: '12px 0'
                            }}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        {/* Send Button (frosted glass pill) */}
                        <button
                            onClick={handleSend}
                            disabled={isLoading || (!query.trim() && uploadedFiles.length === 0)}
                            style={{
                                position: 'relative',
                                width: '54px',
                                height: '42px',
                                borderRadius: '100px',
                                border: (query.trim() || uploadedFiles.length > 0)
                                    ? '1px solid rgba(255, 255, 255, 0.35)'
                                    : '1px solid rgba(0, 51, 102, 0.08)',
                                background: (query.trim() || uploadedFiles.length > 0)
                                    ? 'linear-gradient(160deg, rgba(51, 102, 153, 0.75) 0%, rgba(0, 51, 102, 0.85) 100%)'
                                    : 'rgba(0, 51, 102, 0.06)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                cursor: (query.trim() || uploadedFiles.length > 0) ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                flexShrink: 0,
                                overflow: 'hidden',
                                boxShadow: (query.trim() || uploadedFiles.length > 0)
                                    ? '0 4px 16px rgba(0, 51, 102, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 0 0 0.5px rgba(0, 51, 102, 0.15)'
                                    : 'inset 0 1px 1px rgba(255, 255, 255, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (query.trim() || uploadedFiles.length > 0) {
                                    e.currentTarget.style.transform = 'scale(1.07)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 51, 102, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 0 0.5px rgba(0, 51, 102, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = (query.trim() || uploadedFiles.length > 0)
                                    ? '0 4px 16px rgba(0, 51, 102, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 0 0 0.5px rgba(0, 51, 102, 0.15)'
                                    : 'inset 0 1px 1px rgba(255, 255, 255, 0.3)';
                            }}
                        >
                            {/* Glass highlight overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '10%',
                                right: '10%',
                                height: '45%',
                                borderRadius: '0 0 50% 50%',
                                background: (query.trim() || uploadedFiles.length > 0)
                                    ? 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
                                    : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                                pointerEvents: 'none'
                            }} />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={(query.trim() || uploadedFiles.length > 0) ? '#FFFFFF' : 'rgba(0,51,102,0.3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                                <line x1="12" y1="19" x2="12" y2="5" />
                                <polyline points="5 12 12 5 19 12" />
                            </svg>
                        </button>
                        {/* Attach Files Button (frosted glass) */}
                        <button
                            onClick={handleFileButtonClick}
                            style={{
                                position: 'relative',
                                width: '54px',
                                height: '42px',
                                borderRadius: '14px',
                                border: '1px solid rgba(0, 51, 102, 0.12)',
                                background: 'rgba(0, 51, 102, 0.04)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                flexShrink: 0,
                                marginLeft: '6px',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 51, 102, 0.06)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 51, 102, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(0, 51, 102, 0.25)';
                                e.currentTarget.style.transform = 'scale(1.06)';
                                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 4px 14px rgba(0, 51, 102, 0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 51, 102, 0.04)';
                                e.currentTarget.style.borderColor = 'rgba(0, 51, 102, 0.12)';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 51, 102, 0.06)';
                            }}
                            title="Attach files"
                        >
                            {/* Glass highlight overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '15%',
                                right: '15%',
                                height: '40%',
                                borderRadius: '0 0 50% 50%',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
                                pointerEvents: 'none'
                            }} />
                            <Paperclip size={18} color="#003366" style={{ position: 'relative', zIndex: 1 }} />
                        </button>
                    </div>
                </div>

                {/* ─── RIGHT: Documents Panel ─── */}
                <div style={{
                    flex: '0 0 400px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    gap: '16px'
                }}>
                    {/* Category Chips */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {DOC_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: activeCategory === cat ? '#003366' : 'rgba(255,255,255,0.75)',
                                    color: activeCategory === cat ? '#FFFFFF' : '#64748b',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: activeCategory === cat
                                        ? '0 4px 12px rgba(0, 51, 102, 0.2)'
                                        : '0 2px 6px rgba(0, 51, 102, 0.04)',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Document Cards (scrollable) */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        paddingRight: '4px',
                        paddingBottom: '8px'
                    }}>
                        {filteredDocs.map((doc) => (
                            <DocumentCard key={doc.id} doc={doc} />
                        ))}

                        {filteredDocs.length === 0 && (
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                color: '#94a3b8',
                                fontSize: '14px'
                            }}>
                                No documents in this category.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
