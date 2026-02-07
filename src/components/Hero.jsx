import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, FileText, Landmark } from 'lucide-react';

/* ─── Staggered letter reveal (exat-style) ─── */
const RevealText = ({ text, delay = 0, className, style }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <span ref={ref} style={{ ...style, display: 'inline-block', overflow: 'hidden' }} className={className}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={isInView ? { y: '0%', opacity: 1 } : {}}
                    transition={{
                        duration: 0.6,
                        delay: delay + i * 0.025,
                        ease: [0.215, 0.61, 0.355, 1]
                    }}
                    style={{ display: 'inline-block', willChange: 'transform' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
};

/* ─── Reveal block (fade + slide up) ─── */
const RevealBlock = ({ children, delay = 0, style }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <div ref={ref} style={{ overflow: 'hidden', ...style }}>
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{
                    duration: 0.9,
                    delay,
                    ease: [0.215, 0.61, 0.355, 1]
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

/* ─── Horizontal marquee strip (exat-style) ─── */
const Marquee = ({ items, speed = 30, reverse = false }) => (
    <div style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100vw',
        position: 'relative',
        marginLeft: '-64px',
        marginRight: '-64px'
    }}>
        <div style={{
            display: 'inline-flex',
            animation: `${reverse ? 'marqueeReverse' : 'marquee'} ${speed}s linear infinite`,
            willChange: 'transform'
        }}>
            {[...items, ...items, ...items].map((item, i) => (
                <span key={i} style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255,255,255,0.18)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    padding: '0 32px',
                    flexShrink: 0
                }}>
                    {item}
                </span>
            ))}
        </div>
    </div>
);

/* ─── Navbar ─── */
const Navbar = () => {
    const navigate = useNavigate();

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '32px 64px',
                width: '100%',
                position: 'absolute',
                top: 0,
                zIndex: 20,
                boxSizing: 'border-box'
            }}
        >
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <img src="/legol-icon.png" alt="LEGOL" style={{ height: '28px' }} />
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#003366' }}>LEGOL</span>
            </div>

            <div style={{
                background: 'rgba(230, 235, 240, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '4px 6px',
                borderRadius: '100px',
                display: 'flex',
                gap: '4px'
            }}>
                {['Home', 'Chat', 'Flowchart', 'Timeline', 'Resources'].map((item, i) => (
                    <div key={item}
                        onClick={() => {
                            if (item === 'Home') navigate('/');
                            if (item === 'Chat') navigate('/chat');
                            if (item === 'Flowchart') navigate('/flowchart');
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
                            boxShadow: i === 0 ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (i !== 0) {
                                e.currentTarget.style.color = '#003366';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (i !== 0) {
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
                    onClick={() => navigate('/account')}
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
        </motion.nav>
    );
};

/* ─── Feature Card with stagger ─── */
const FeatureCard = ({ icon: Icon, title, subtitle, route, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const navigate = useNavigate();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1]
            }}
            onClick={() => route && navigate(route)}
            style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                minHeight: '200px',
                justifyContent: 'space-between',
                cursor: route ? 'pointer' : 'default',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0, 51, 102, 0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
            }}
        >
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
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, marginTop: '8px', lineHeight: '1.5' }}>{subtitle}</p>
            </div>
        </motion.div>
    );
};

/* ─── Scroll indicator (subtle bouncing arrow) ─── */
const ScrollIndicator = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            cursor: 'pointer'
        }}
        onClick={() => window.scrollBy({ top: 400, behavior: 'smooth' })}
    >
        <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,51,102,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </motion.div>
    </motion.div>
);

/* ─── EDITORIAL SCROLL SECTIONS (fouroom-style typography + image parallax) ─── */

const SECTIONS = [
    {
        tag: '01',
        headline: ['Navigate your', 'immigration journey', 'with clarity.'],
        body: 'One unified platform for every visa application, document, and deadline. AI-powered guidance that actually understands immigration law.',
        gradient: 'linear-gradient(135deg, #001a33 0%, #003366 40%, #1a4d80 100%)',
        mockup: 'chat',
    },
    {
        tag: '02',
        headline: ['Every document.', 'Tracked, verified,', 'and organized.'],
        body: 'Upload once, access everywhere. Intelligent categorization, deadline alerts, and automated verification — your paperwork, handled.',
        gradient: 'linear-gradient(135deg, #003366 0%, #1a4d80 50%, #336699 100%)',
        mockup: 'docs',
    },
    {
        tag: '03',
        headline: ['Your timeline.', 'Every milestone,', 'mapped.'],
        body: 'From filing dates to biometrics appointments to final decisions — see your entire journey laid out with real-time status updates.',
        gradient: 'linear-gradient(135deg, #002244 0%, #003366 60%, #4d7faa 100%)',
        mockup: 'timeline',
    },
];

/* ─── Product Mockup (visual placeholder inside the image block) ─── */
const Mockup = ({ type, gradient }) => (
    <div style={{
        width: '100%',
        height: '100%',
        background: gradient,
        position: 'relative',
        overflow: 'hidden',
        padding: '40px'
    }}>
        {/* Glow orb */}
        <div style={{
            position: 'absolute', top: '-20%', right: '-10%',
            width: '60%', height: '60%', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', filter: 'blur(60px)'
        }} />

        {type === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
                {/* Chat bubbles */}
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: '16px 16px 16px 4px', padding: '16px 22px', maxWidth: '75%' }}>
                    <div style={{ height: '8px', width: '180px', borderRadius: '100px', background: 'rgba(255,255,255,0.3)', marginBottom: '8px' }} />
                    <div style={{ height: '6px', width: '120px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)' }} />
                </div>
                <div style={{ alignSelf: 'flex-end', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '16px 16px 4px 16px', padding: '16px 22px', maxWidth: '65%' }}>
                    <div style={{ height: '8px', width: '140px', borderRadius: '100px', background: 'rgba(255,255,255,0.4)', marginBottom: '8px' }} />
                    <div style={{ height: '6px', width: '200px', borderRadius: '100px', background: 'rgba(255,255,255,0.2)', marginBottom: '8px' }} />
                    <div style={{ height: '6px', width: '100px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)' }} />
                </div>
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: '16px 16px 16px 4px', padding: '16px 22px', maxWidth: '70%' }}>
                    <div style={{ height: '8px', width: '160px', borderRadius: '100px', background: 'rgba(255,255,255,0.3)', marginBottom: '8px' }} />
                    <div style={{ height: '6px', width: '90px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)' }} />
                </div>
            </div>
        )}

        {type === 'docs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                        borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', marginBottom: '14px' }} />
                        <div style={{ height: '7px', width: '80%', borderRadius: '100px', background: 'rgba(255,255,255,0.25)', marginBottom: '8px' }} />
                        <div style={{ height: '5px', width: '55%', borderRadius: '100px', background: 'rgba(255,255,255,0.12)' }} />
                    </div>
                ))}
            </div>
        )}

        {type === 'timeline' && (
            <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingLeft: '20px' }}>
                {/* Vertical line */}
                <div style={{ width: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '100px', position: 'relative', minHeight: '260px' }}>
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: '-5px', top: `${p * 100}%`,
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: i < 3 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
                            border: '2px solid rgba(255,255,255,0.2)'
                        }} />
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
                    {['Filed', 'Biometrics', 'Interview', 'Decision', 'Approved'].map((step, i) => (
                        <div key={i} style={{ opacity: i < 3 ? 1 : 0.4 }}>
                            <div style={{ height: '7px', width: `${60 + i * 8}%`, borderRadius: '100px', background: 'rgba(255,255,255,0.25)', marginBottom: '6px' }} />
                            <div style={{ height: '5px', width: '40%', borderRadius: '100px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

/* ─── Single Feature Section (text + image, alternating layout) ─── */
const ScrollFeature = ({ section, reversed }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.25 });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    /* Image parallax + scale */
    const imgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const imgScale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.92, 1, 1]);

    return (
        <section ref={ref} style={{
            padding: '140px 64px',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: reversed ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: '80px'
        }}>
            {/* ─── Text side ─── */}
            <div style={{ flex: '1 1 45%' }}>
                {/* Tag number */}
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        fontSize: '13px', fontWeight: '600', letterSpacing: '3px',
                        textTransform: 'uppercase', color: 'rgba(0,51,102,0.3)',
                        display: 'block', marginBottom: '28px'
                    }}
                >
                    {section.tag}
                </motion.span>

                {/* Headline — line-by-line reveal */}
                <div style={{ marginBottom: '28px' }}>
                    {section.headline.map((line, i) => (
                        <div key={i} style={{ overflow: 'hidden' }}>
                            <motion.div
                                initial={{ y: '110%' }}
                                animate={isInView ? { y: 0 } : {}}
                                transition={{
                                    duration: 0.9,
                                    delay: 0.15 + i * 0.1,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                <span style={{
                                    fontSize: '52px',
                                    fontWeight: '500',
                                    color: '#003366',
                                    lineHeight: '1.15',
                                    letterSpacing: '-1.5px',
                                    display: 'block'
                                }}>
                                    {line}
                                </span>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Body text */}
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        fontSize: '17px', color: '#64748b', lineHeight: '1.8',
                        maxWidth: '420px', margin: 0
                    }}
                >
                    {section.body}
                </motion.p>
            </div>

            {/* ─── Image side (parallax + scale) ─── */}
            <motion.div
                style={{
                    flex: '1 1 50%',
                    y: imgY,
                    scale: imgScale
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        width: '100%',
                        aspectRatio: '4 / 3',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 24px 80px rgba(0, 51, 102, 0.12), 0 4px 12px rgba(0,51,102,0.04)'
                    }}
                >
                    <Mockup type={section.mockup} gradient={section.gradient} />
                </motion.div>
            </motion.div>
        </section>
    );
};

/* ─── Full-width statement (big typography reveal) ─── */
const StatementSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.4 });

    const words = ['AI-powered.', 'Document-ready.', 'Deadline-proof.'];

    return (
        <section ref={ref} style={{
            padding: '180px 64px',
            maxWidth: '1400px',
            margin: '0 auto',
            textAlign: 'center'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px 24px'
            }}>
                {words.map((word, i) => (
                    <div key={i} style={{ overflow: 'hidden' }}>
                        <motion.span
                            initial={{ y: '110%' }}
                            animate={isInView ? { y: 0 } : {}}
                            transition={{
                                duration: 1,
                                delay: i * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            style={{
                                fontSize: '76px',
                                fontWeight: '500',
                                color: '#003366',
                                letterSpacing: '-2px',
                                display: 'block',
                                lineHeight: '1.1'
                            }}
                        >
                            {word}
                        </motion.span>
                    </div>
                ))}
            </div>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={{
                    fontSize: '17px', color: '#94a3b8', lineHeight: '1.7',
                    maxWidth: '500px', margin: '40px auto 0', textAlign: 'center'
                }}
            >
                Built for international students navigating one of the most complex systems in the world.
            </motion.p>
        </section>
    );
};

/* ─── CTA Section (end of page — invite to sign up / login) ─── */
const CTASection = () => {
    const ref = useRef(null);
    const navigate = useNavigate();
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section ref={ref} style={{
            padding: '140px 64px 120px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F6FA 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Soft background glow */}
            <div style={{
                position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
                width: '60vw', height: '50vh',
                background: 'radial-gradient(circle, rgba(0,51,102,0.05) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none'
            }} />

            <div style={{
                maxWidth: '680px', margin: '0 auto', textAlign: 'center',
                position: 'relative', zIndex: 2
            }}>
                {/* Tag */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        fontSize: '11px', fontWeight: '600', letterSpacing: '3px',
                        textTransform: 'uppercase', color: 'rgba(0,51,102,0.3)',
                        display: 'block', marginBottom: '24px'
                    }}
                >
                    Get Started
                </motion.span>

                {/* Headline */}
                <div style={{ marginBottom: '20px' }}>
                    {['Ready to simplify', 'your immigration journey?'].map((line, i) => (
                        <div key={i} style={{ overflow: 'hidden' }}>
                            <motion.div
                                initial={{ y: '110%' }}
                                animate={isInView ? { y: 0 } : {}}
                                transition={{ duration: 0.85, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span style={{
                                    fontSize: '48px', fontWeight: '500', color: '#003366',
                                    lineHeight: '1.15', letterSpacing: '-1.5px', display: 'block'
                                }}>
                                    {line}
                                </span>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    style={{
                        fontSize: '17px', color: '#64748b', lineHeight: '1.7',
                        maxWidth: '460px', margin: '0 auto 40px'
                    }}
                >
                    Join thousands of students already navigating visas, documents, and deadlines with confidence.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}
                >
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: '#003366', color: '#FFFFFF', border: 'none',
                            padding: '16px 36px', borderRadius: '10px',
                            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(0,51,102,0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,51,102,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,51,102,0.25)';
                        }}
                    >
                        Sign Up Free →
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'rgba(0,51,102,0.06)', color: '#003366',
                            border: '1px solid rgba(0,51,102,0.12)',
                            padding: '16px 36px', borderRadius: '10px',
                            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            transition: 'transform 0.3s ease, background 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.background = 'rgba(0,51,102,0.10)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'rgba(0,51,102,0.06)';
                        }}
                    >
                        Log In
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

/* ─── Combined editorial section (replaces old card animations) ─── */
const FileDrawerSection = () => (
    <div style={{ background: '#FFFFFF' }}>
        <StatementSection />
        {SECTIONS.map((section, i) => (
            <ScrollFeature key={i} section={section} reversed={i % 2 !== 0} />
        ))}
        <CTASection />
    </div>
);

/* ─── MAIN HERO ─── */

const MARQUEE_ITEMS_1 = ['Citizenship', 'Green Cards', 'Work Visas', 'H-1B', 'Naturalization', 'Dual Nationality', 'Travel Documents', 'Immigration', 'USCIS'];
const MARQUEE_ITEMS_2 = ['Document Filing', 'Biometrics', 'Background Check', 'Consulate Interview', 'Status Monitoring', 'Visa Stamping', 'Compliance', 'Tax Filing'];

const Hero = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 600], [0, 120]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);
    const marqueeOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const cardsY = useTransform(scrollY, [200, 700], [0, -40]);

    return (
        <section ref={containerRef} style={{
            minHeight: '160vh',
            position: 'relative',
            overflow: 'hidden',
            background: '#FFFFFF'
        }}>
            {/* CSS Keyframes for marquee */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                @keyframes marqueeReverse {
                    0% { transform: translateX(-33.333%); }
                    100% { transform: translateX(0); }
                }
                @keyframes orbDrift {
                    0%   { transform: translate(0%, 0%) rotate(-10deg) scale(1); }
                    15%  { transform: translate(8%, 4%) rotate(-6deg) scale(1.03); }
                    30%  { transform: translate(3%, -6%) rotate(-12deg) scale(0.98); }
                    50%  { transform: translate(-5%, 3%) rotate(-8deg) scale(1.05); }
                    65%  { transform: translate(6%, -3%) rotate(-14deg) scale(1.01); }
                    80%  { transform: translate(-3%, 5%) rotate(-5deg) scale(0.97); }
                    100% { transform: translate(0%, 0%) rotate(-10deg) scale(1); }
                }
                @keyframes orbDriftSecondary {
                    0%   { transform: translate(0%, 0%) scale(1); }
                    20%  { transform: translate(-6%, 5%) scale(1.06); }
                    40%  { transform: translate(5%, -4%) scale(0.95); }
                    60%  { transform: translate(-3%, -6%) scale(1.04); }
                    80%  { transform: translate(4%, 3%) scale(0.98); }
                    100% { transform: translate(0%, 0%) scale(1); }
                }
            `}</style>

            {/* Background Gradient Blob — slow organic drift */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.95, scale: 1 }}
                transition={{ duration: 1.8, ease: [0.215, 0.61, 0.355, 1] }}
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-25%',
                    width: '120vw',
                    height: '120vh',
                    background: 'radial-gradient(ellipse 70% 80%, #003366 0%, rgba(0, 51, 102, 0.8) 40%, rgba(0, 51, 102, 0) 68%)',
                    filter: 'blur(80px)',
                    zIndex: 0,
                    animation: 'orbDrift 25s ease-in-out infinite',
                    willChange: 'transform'
                }}
            />
            {/* Secondary lighter blur — counter-drift */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '40vw',
                height: '40vh',
                background: '#818cf8',
                filter: 'blur(120px)',
                opacity: 0.1,
                zIndex: 0,
                animation: 'orbDriftSecondary 30s ease-in-out infinite',
                willChange: 'transform'
            }} />

            <Navbar />

            <div style={{
                position: 'relative',
                zIndex: 10,
                paddingTop: '160px',
                paddingLeft: '64px',
                paddingRight: '64px',
                maxWidth: '1440px',
                margin: '0 auto'
            }}>
                {/* ─── Hero Text with letter-by-letter animation ─── */}
                <motion.div style={{ y, opacity, marginBottom: '44px' }}>
                    <div style={{
                        fontSize: '96px',
                        fontWeight: '400',
                        lineHeight: '1.1',
                        color: '#FFFFFF',
                        marginBottom: '40px',
                        letterSpacing: '-2px'
                    }}>
                        <div style={{ overflow: 'hidden' }}>
                            <RevealText text="One Platform." delay={0.5} />
                        </div>
                        <div style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
                            <RevealText text="Every Piece, " delay={0.9} style={{ opacity: 0.9 }} />
                            <RevealText text="Pieced." delay={1.3} style={{ fontStyle: 'italic', fontWeight: '500' }} />
                        </div>
                    </div>

                    <RevealBlock delay={1.8}>
                        <p style={{
                            fontSize: '18px',
                            color: 'rgba(255,255,255,0.55)',
                            maxWidth: '500px',
                            lineHeight: '1.7',
                            margin: 0,
                            marginBottom: '32px'
                        }}>
                            Navigate immigration with clarity. One platform for every visa, document, and deadline.
                        </p>
                    </RevealBlock>

                    <RevealBlock delay={2.0}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#003366',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                        >
                            Get Started →
                        </button>
                    </RevealBlock>
                </motion.div>

                {/* ─── Marquee Strips (exat-style) ─── */}
                <motion.div style={{ opacity: marqueeOpacity, marginBottom: '56px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Marquee items={MARQUEE_ITEMS_1} speed={35} />
                        <Marquee items={MARQUEE_ITEMS_2} speed={40} reverse />
                    </div>
                </motion.div>

                {/* ─── Feature Grid with staggered reveal ─── */}
                <motion.div style={{ y: cardsY, paddingBottom: '100px' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px'
                    }}>
                        <FeatureCard
                            icon={MessageSquare}
                            title="AI Chat Assistant"
                            subtitle="Get instant answers about immigration law, visa requirements, and document needs."
                            route="/chat"
                            index={0}
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Timeline Planner"
                            subtitle="Track every milestone and deadline in your immigration journey."
                            route="/timeline"
                            index={1}
                        />
                        <FeatureCard
                            icon={FileText}
                            title="Document Manager"
                            subtitle="Organize, verify, and track all required documents in one place."
                            route="/chat"
                            index={2}
                        />
                        <FeatureCard
                            icon={Landmark}
                            title="Agency Resources"
                            subtitle="Direct access to USCIS, State Department, and every agency you need."
                            route="/resources"
                            index={3}
                        />
                    </div>
                </motion.div>
            </div>

            <ScrollIndicator />
        </section>
    );
};

/* ─── Combined Page Export ─── */
const HomePage = () => (
    <>
        <Hero />
        <FileDrawerSection />
    </>
);

export default HomePage;
