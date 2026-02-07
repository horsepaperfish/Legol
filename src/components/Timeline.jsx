import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Clock, CheckCircle, ChevronRight, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { motion } from 'framer-motion';

const TimelineEvent = ({ status, title, date, location, description, isLast }) => {
    const isCompleted = status === 'COMPLETED';
    const isCurrent = status === 'CURRENT';

    return (
        <div style={{ display: 'flex', gap: '24px', position: 'relative' }}>
            {/* Timeline Line */}
            {!isLast && (
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '40px',
                    bottom: '-24px',
                    width: '2px',
                    background: '#003366'
                }} />
            )}

            {/* Icon Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: isCompleted ? '2px solid #28a745' : '2px solid #007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted ? '#28a745' : '#007bff',
                    zIndex: 1
                }}>
                    {isCompleted ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
            </div>

            {/* Content Card */}
            <div style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: '16px',
                border: isCompleted ? '2px solid #28a745' : '2px solid #007bff',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E272D', margin: 0 }}>{title}</h3>
                    <span style={{
                        background: isCompleted ? '#d4edda' : '#cce5ff',
                        color: isCompleted ? '#155724' : '#004085',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '700'
                    }}>
                        {status}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                    <span>{date}</span>
                    <span>•</span>
                    <span>{location}</span>
                </div>

                {description && (
                    <p style={{ color: '#4a5568', fontSize: '15px', margin: 0 }}>{description}</p>
                )}

                {/* Example Interaction for Current Item */}
                {isCurrent && (
                    <div style={{
                        marginTop: '16px',
                        background: '#F8F9FA',
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: 'fit-content',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#28a745', borderRadius: '50%', padding: '2px' }}>
                                <CheckCircle size={12} color="white" />
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>Done! How does this look?</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                            <ThumbsUp size={16} color="#666" style={{ cursor: 'pointer' }} />
                            <ThumbsDown size={16} color="#666" style={{ cursor: 'pointer' }} />
                            <X size={16} color="#666" style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Navbar = () => {
    const navigate = useNavigate();

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
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#003366', cursor: 'pointer' }} onClick={() => navigate('/')}>LEGOL</div>

            <div style={{
                background: 'rgba(230, 235, 240, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '4px 6px',
                borderRadius: '100px',
                display: 'flex',
                gap: '4px'
            }}>
                {['Home', 'Chat', 'Timeline', 'Resources'].map((item, i) => (
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
                            fontWeight: item === 'Timeline' ? '600' : '500',
                            color: item === 'Timeline' ? '#003366' : '#64748b',
                            cursor: 'pointer',
                            background: item === 'Timeline' ? '#FFFFFF' : 'transparent',
                            boxShadow: item === 'Timeline' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}>
                        {item}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#003366', cursor: 'pointer' }}>Sign Out</span>
                <button style={{
                    background: '#003366',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 51, 102, 0.2)'
                }}>My Profile</button>
            </div>
        </nav>
    );
};

const Timeline = () => {
    const [activeTab, setActiveTab] = useState('All Events');
    const tabs = ['All Events', 'Documents', 'Applications', 'Appointments', 'Visa', 'Milestones'];

    return (
        <div style={{ minHeight: '100vh', background: '#F6F8FA', position: 'relative', overflow: 'hidden' }}>

            {/* Background Graphic */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60vw',
                height: '100vh',
                background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(0,51,102,0.05) 50%, rgba(0,51,102,0.1) 100%)',
                clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '80vw',
                height: '80vh',
                background: 'radial-gradient(circle, rgba(0, 51, 102, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <Navbar />

            <main style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', paddingTop: '160px', paddingLeft: '20px', paddingRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <div style={{ background: '#003366', padding: '12px', borderRadius: '12px', color: 'white' }}>
                        <Calendar size={32} />
                    </div>
                    <h1 style={{ fontSize: '48px', fontWeight: '400', color: '#003366', margin: 0 }}>Timeline Planner</h1>
                </div>
                <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', marginLeft: '72px' }}>
                    Track your immigration journey with a personalized timeline of important milestones and deadlines.
                </p>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '48px', flexWrap: 'wrap', marginLeft: '72px' }}>
                    {tabs.map(tab => (
                        <button key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab ? '#003366' : '#FFFFFF',
                                color: activeTab === tab ? '#FFFFFF' : '#64748b',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s'
                            }}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Timeline Events */}
                <div style={{ paddingLeft: '50px' }}>
                    <TimelineEvent
                        status="COMPLETED"
                        title="Gather Birth Certificate"
                        date="Feb 1, 2026"
                        location="Vital Records Office"
                        description="Original birth certificate obtained and certified"
                    />

                    <TimelineEvent
                        status="CURRENT"
                        title="Submit Citizenship Application"
                        date="Feb 7, 2026"
                        location="USCIS"
                        description="Complete Form N-400 and submit to USCIS"
                        isLast={true}
                    />
                </div>
            </main>
        </div>
    );
};

export default Timeline;
