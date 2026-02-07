import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from '../firebase';

/* ─── Navbar (consistent with other pages) ─── */
const Navbar = () => {
    const navigate = useNavigate();
    const navItems = ['Home', 'Chat', 'Timeline', 'Resources'];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 48px',
                width: '100%',
                boxSizing: 'border-box',
                flexShrink: 0
            }}
        >
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
                    style={{ fontSize: '14px', fontWeight: '600', color: '#003366', cursor: 'default', opacity: 0.5 }}
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
        </motion.nav>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (isSignUp && !name) {
            setError('Please enter your full name');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                // Sign up with email and password
                const result = await createUserWithEmailAndPassword(auth, email, password);

                // Update user profile with display name
                await updateProfile(result.user, {
                    displayName: name
                });

                // Store user info
                localStorage.setItem('user', JSON.stringify({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: name
                }));
            } else {
                // Sign in with email and password
                const result = await signInWithEmailAndPassword(auth, email, password);

                // Store user info
                localStorage.setItem('user', JSON.stringify({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName
                }));
            }

            // Navigate to home page
            navigate('/');
        } catch (error) {
            console.error('Authentication error:', error);

            // User-friendly error messages
            let errorMessage = 'Authentication failed. Please try again.';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Try signing in instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Try signing up instead.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Use at least 6 characters.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password. Please check and try again.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Store user info in localStorage or your state management
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));

            // Navigate to home page
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError(error.message || 'Failed to sign in with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSchoolEmailSignIn = async () => {
        // For school email, we'll still use Google sign-in but could add validation
        // to check if the email domain is from an educational institution
        try {
            setLoading(true);
            setError('');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if email is from a school domain (optional validation)
            const email = user.email.toLowerCase();
            const isSchoolEmail = email.endsWith('.edu') ||
                                  email.includes('student') ||
                                  email.includes('school') ||
                                  email.includes('university');

            if (!isSchoolEmail) {
                // You can choose to allow all emails or restrict to school emails
                console.warn('Email may not be from an educational institution');
            }

            // Store user info
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                isSchoolEmail: isSchoolEmail
            }));

            navigate('/');
        } catch (error) {
            console.error('Error signing in with school email:', error);
            setError(error.message || 'Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            background: '#F6F8FA',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Rethink Sans', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle background blobs */}
            <div style={{
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: '60vw',
                height: '60vh',
                background: 'radial-gradient(circle, rgba(0, 51, 102, 0.04) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '50vw',
                height: '50vh',
                background: 'radial-gradient(circle, rgba(0, 51, 102, 0.03) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />

            {/* Navbar */}
            <Navbar />

            {/* Card container - fills remaining space */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 48px 24px 48px',
                minHeight: 0
            }}>
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                    style={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: '960px',
                        height: '100%',
                        maxHeight: '680px',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.55)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 32px 80px rgba(0, 51, 102, 0.08), 0 8px 32px rgba(0, 51, 102, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}
                >
                    {/* ─── Left Panel: Frosted Glass Showcase ─── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                        style={{
                            flex: '0 0 42%',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '48px',
                            paddingBottom: '56px',
                            borderRadius: '24px',
                            margin: '8px'
                        }}
                    >
                        {/* Gradient background — navy to grey */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(155deg, #001a33 0%, #003366 35%, #1a4d80 55%, #8899aa 75%, #CCCCD6 100%)',
                            zIndex: 0
                        }} />

                        {/* Frosted overlay blobs */}
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '15%',
                            width: '220px',
                            height: '220px',
                            borderRadius: '50%',
                            background: 'rgba(204, 204, 214, 0.12)',
                            filter: 'blur(50px)',
                            zIndex: 1
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '40%',
                            right: '5%',
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            background: 'rgba(0, 51, 102, 0.15)',
                            filter: 'blur(45px)',
                            zIndex: 1
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '15%',
                            left: '30%',
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            background: 'rgba(204, 204, 214, 0.18)',
                            filter: 'blur(55px)',
                            zIndex: 1
                        }} />

                        {/* Glass highlight at top */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '5%',
                            right: '5%',
                            height: '35%',
                            borderRadius: '0 0 50% 50%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
                            zIndex: 2,
                            pointerEvents: 'none'
                        }} />

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '48px',
                                zIndex: 3,
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'rgba(255, 255, 255, 0.9)',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            LEGOL
                        </motion.div>

                        {/* Text content — vertically centered */}
                        <div style={{ position: 'relative', zIndex: 3 }}>
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.7 }}
                                style={{
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.55)',
                                    margin: 0,
                                    marginBottom: '12px',
                                    fontWeight: '500'
                                }}
                            >
                                Built for students
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.7 }}
                                style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#FFFFFF',
                                    margin: 0,
                                    lineHeight: '1.3',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                Navigate your immigration journey with clarity
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.6 }}
                                style={{
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    margin: 0,
                                    marginTop: '16px',
                                    lineHeight: '1.5'
                                }}
                            >
                                Sign in with your school email for instant access to visa tracking, document management, and AI-powered guidance.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* ─── Right Panel: Form ─── */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '40px 48px',
                        overflowY: 'auto'
                    }}>
                        {/* Decorative star */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                            style={{
                                fontSize: '22px',
                                color: '#003366',
                                marginBottom: '20px'
                            }}
                        >
                            ✦
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isSignUp ? 'signup' : 'signin'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                            >
                                <h1 style={{
                                    fontSize: '26px',
                                    fontWeight: '700',
                                    color: '#0a1628',
                                    margin: 0,
                                    marginBottom: '8px'
                                }}>
                                    {isSignUp ? 'Create an account' : 'Welcome back'}
                                </h1>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#64748b',
                                    margin: 0,
                                    marginBottom: '24px',
                                    lineHeight: '1.6'
                                }}>
                                    {isSignUp
                                        ? 'Track your visas, documents, and deadlines — all in one place.'
                                        : 'Sign in to continue your immigration journey.'}
                                </p>

                                {/* Error message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            color: '#dc2626',
                                            fontSize: '13px',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* Name field (sign up only) */}
                                    <AnimatePresence>
                                        {isSignUp && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: '#334155',
                                                    display: 'block',
                                                    marginBottom: '6px'
                                                }}>
                                                    Full name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe"
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        borderRadius: '12px',
                                                        border: '1.5px solid rgba(0, 51, 102, 0.12)',
                                                        background: 'rgba(255, 255, 255, 0.7)',
                                                        backdropFilter: 'blur(8px)',
                                                        fontSize: '14px',
                                                        color: '#0a1628',
                                                        fontFamily: 'inherit',
                                                        outline: 'none',
                                                        boxSizing: 'border-box',
                                                        transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'rgba(0, 51, 102, 0.35)';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 51, 102, 0.06)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'rgba(0, 51, 102, 0.12)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Email */}
                                    <div>
                                        <label style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: '#334155',
                                            display: 'block',
                                            marginBottom: '6px'
                                        }}>
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                border: '1.5px solid rgba(0, 51, 102, 0.12)',
                                                background: 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(8px)',
                                                fontSize: '14px',
                                                color: '#0a1628',
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'rgba(0, 51, 102, 0.35)';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(0, 51, 102, 0.06)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'rgba(0, 51, 102, 0.12)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: '#334155',
                                            display: 'block',
                                            marginBottom: '6px'
                                        }}>
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••••"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 48px 12px 16px',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid rgba(0, 51, 102, 0.12)',
                                                    background: 'rgba(255, 255, 255, 0.7)',
                                                    backdropFilter: 'blur(8px)',
                                                    fontSize: '14px',
                                                    color: '#0a1628',
                                                    fontFamily: 'inherit',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'rgba(0, 51, 102, 0.35)';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 51, 102, 0.06)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(0, 51, 102, 0.12)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '14px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: '#94a3b8',
                                                    transition: 'color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#003366'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button — solid navy */}
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.015, y: -1 }}
                                        whileTap={{ scale: 0.985 }}
                                        style={{
                                            width: '100%',
                                            padding: '14px 24px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: '#003366',
                                            color: '#FFFFFF',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            fontFamily: 'inherit',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 12px rgba(0, 51, 102, 0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'box-shadow 0.25s ease',
                                            marginTop: '4px',
                                            opacity: loading ? 0.6 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 51, 102, 0.35)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 51, 102, 0.25)';
                                            }
                                        }}
                                    >
                                        {loading ? 'Please wait...' : (isSignUp ? 'Get Started' : 'Sign In')}
                                        {!loading && <ArrowRight size={16} />}
                                    </motion.button>
                                </form>

                                {/* Divider */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    margin: '18px 0'
                                }}>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0, 51, 102, 0.08)' }} />
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>or continue with</span>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0, 51, 102, 0.08)' }} />
                                </div>

                                {/* School Email Login — prominent */}
                                <motion.button
                                    type="button"
                                    onClick={handleSchoolEmailSignIn}
                                    disabled={loading}
                                    whileHover={{ scale: 1.015, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '13px 24px',
                                        borderRadius: '12px',
                                        border: '1.5px solid rgba(0, 51, 102, 0.15)',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        fontWeight: '600',
                                        color: '#003366',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.25s ease',
                                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 8px rgba(0,51,102,0.05)',
                                        opacity: loading ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.borderColor = 'rgba(0, 51, 102, 0.3)';
                                            e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.6), 0 4px 14px rgba(0,51,102,0.1)';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.borderColor = 'rgba(0, 51, 102, 0.15)';
                                            e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 8px rgba(0,51,102,0.05)';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                                        }
                                    }}
                                >
                                    <GraduationCap size={18} color="#003366" />
                                    {loading ? 'Signing in...' : 'School Email / Student ID'}
                                </motion.button>

                                {/* Google login */}
                                <motion.button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    whileHover={{ scale: 1.015, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '13px 24px',
                                        borderRadius: '12px',
                                        border: '1.5px solid rgba(0, 51, 102, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        fontWeight: '600',
                                        color: '#334155',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        marginTop: '10px',
                                        transition: 'all 0.25s ease',
                                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 6px rgba(0,51,102,0.04)',
                                        opacity: loading ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.borderColor = 'rgba(0, 51, 102, 0.25)';
                                            e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.6), 0 4px 12px rgba(0,51,102,0.08)';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.borderColor = 'rgba(0, 51, 102, 0.1)';
                                            e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 6px rgba(0,51,102,0.04)';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '16px', fontWeight: '700' }}>G</span>
                                    {loading ? 'Signing in...' : 'Continue with Google'}
                                </motion.button>

                                {/* Toggle link */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '13px',
                                        color: '#64748b',
                                        marginTop: '20px',
                                        marginBottom: 0
                                    }}
                                >
                                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                                    <span
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        style={{
                                            color: '#003366',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        {isSignUp ? 'Sign in' : 'Sign up'}
                                    </span>
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
