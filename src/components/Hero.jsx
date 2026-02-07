import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sun, Star, Monitor, ShoppingBag, Terminal } from 'lucide-react';

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
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#003366' }}>LEGOL</div>

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
                            fontWeight: i === 0 ? '600' : '500',
                            color: i === 0 ? '#003366' : '#64748b',
                            cursor: 'pointer',
                            background: i === 0 ? '#FFFFFF' : 'transparent',
                            boxShadow: i === 0 ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
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

const FeatureCard = ({ icon: Icon, title, subtitle }) => (
    <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        minHeight: '200px',
        justifyContent: 'space-between'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={20} color="#334155" />
        </div>

        <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', margin: 0 }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, marginTop: '8px' }}>{subtitle}</p>
        </div>
    </div>
);

const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <section ref={containerRef} style={{
            minHeight: '140vh',
            position: 'relative',
            overflow: 'hidden',
            background: '#FFFFFF'
        }}>
            {/* Background Gradient Blob matching the design */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '120vw',
                height: '120vh',
                background: 'radial-gradient(circle, #003366 0%, rgba(0, 51, 102, 0.8) 50%, rgba(0, 51, 102, 0) 70%)',
                filter: 'blur(80px)',
                opacity: 0.95,
                zIndex: 0,
                transform: 'rotate(-10deg)'
            }} />
            {/* Secondary lighter blur for "depth" */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '40vw',
                height: '40vh',
                background: '#818cf8', // Indigo tint
                filter: 'blur(120px)',
                opacity: 0.1,
                zIndex: 0
            }} />

            <Navbar />

            <div style={{
                position: 'relative',
                zIndex: 10,
                paddingTop: '200px',
                paddingLeft: '64px', // Reduced left padding to separate from edge
                paddingRight: '64px',
                maxWidth: '1440px',
                margin: '0 auto'
            }}>

                {/* Hero Text */}
                <motion.div style={{ y, opacity, marginBottom: '100px' }}>
                    <h1 style={{
                        fontSize: '96px',
                        fontWeight: '400',
                        lineHeight: '1.1',
                        color: '#FFFFFF', // Text on dark blob is white
                        marginBottom: '40px',
                        letterSpacing: '-2px'
                    }}>
                        One Platform.<br />
                        <span style={{ opacity: 0.9 }}>Every Piece, </span>
                        <span style={{ fontStyle: 'italic', fontWeight: '500' }}>Pieced.</span>
                    </h1>

                    <button style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#003366',
                        border: 'none',
                        padding: '16px 32px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        Upload Documents
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '24px',
                    paddingBottom: '100px'
                }}>
                    <FeatureCard icon={Sun} title="Step-by-Step Guide" subtitle="slkdfjsd;f" />
                    <FeatureCard icon={Star} title="Chatbox" subtitle="skflksd'fksdf" />
                    <FeatureCard icon={Monitor} title="Checklist" subtitle="lskdjflksd'fksjdf" />
                    <FeatureCard icon={ShoppingBag} title="Resources" subtitle="slkdfj'slkdfs'" />

                    {/* Second Row */}
                    <FeatureCard icon={Terminal} title="slkf'aks'flsd" subtitle="slkjfsdjks" />
                    <FeatureCard icon={Terminal} title="slakdnf'lskd'fksd" subtitle="slkdfnslkf's" />
                </div>

            </div>
        </section>
    );
};

export default Hero;
