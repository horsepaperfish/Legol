import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Phone, Landmark } from 'lucide-react';

/* ─── Navbar ─── */
const Navbar = () => {
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
                            fontWeight: item === 'Resources' ? '600' : '500',
                            color: item === 'Resources' ? '#003366' : '#64748b',
                            cursor: 'pointer',
                            background: item === 'Resources' ? '#FFFFFF' : 'transparent',
                            boxShadow: item === 'Resources' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
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

/* ─── Agency data ─── */
const AGENCIES = [
    {
        name: 'USCIS – US Citizenship and Immigration Services',
        description: 'Primary agency for immigration benefits and naturalization applications',
        tags: ['Citizenship Applications', 'Green Cards', 'Work Permits', 'Travel Documents'],
        website: 'https://www.uscis.gov',
        phone: '1-800-375-5283'
    },
    {
        name: 'Department of State – Bureau of Consular Affairs',
        description: 'Manages passport services and international travel documentation',
        tags: ['Passport Applications', 'Visa Services', 'International Travel Info'],
        website: 'https://travel.state.gov',
        phone: '1-877-487-2778'
    },
    {
        name: 'IRS – Internal Revenue Service',
        description: 'Federal tax obligations for US citizens and residents',
        tags: ['Tax Filing', 'ITIN Applications', 'International Tax Issues'],
        website: 'https://www.irs.gov',
        phone: '1-800-829-1040'
    },
    {
        name: 'Social Security Administration',
        description: 'Social Security numbers and benefits administration',
        tags: ['Social Security Cards', 'Benefits', 'Name Changes'],
        website: 'https://www.ssa.gov',
        phone: '1-800-772-1213'
    },
    {
        name: 'Department of Labor',
        description: 'Labor certification and work authorization',
        tags: ['PERM Labor Certification', 'H-1B Regulations', 'Worker Rights'],
        website: 'https://www.dol.gov',
        phone: '1-866-487-2365'
    },
    {
        name: 'CBP – Customs and Border Protection',
        description: 'Border entry requirements and travel programs',
        tags: ['Global Entry', 'Border Crossing Info', 'Travel History'],
        website: 'https://www.cbp.gov',
        phone: null
    },
    {
        name: 'Embassy Finder',
        description: 'Locate embassies and consulates worldwide',
        tags: ['Consular Services', 'Dual Citizenship Registration', 'Document Authentication'],
        website: 'https://www.usembassy.gov',
        phone: null
    },
    {
        name: 'National Visa Center (NVC)',
        description: 'Processes immigrant visa petitions approved by USCIS',
        tags: ['Visa Petitions', 'Fee Payments', 'Case Status'],
        website: 'https://travel.state.gov/content/travel/en/us-visas/immigrate/national-visa-center.html',
        phone: '1-603-334-0700'
    },
    {
        name: 'EOIR – Executive Office for Immigration Review',
        description: 'Immigration court proceedings and appeals',
        tags: ['Immigration Courts', 'Board of Immigration Appeals', 'Case Scheduling'],
        website: 'https://www.justice.gov/eoir',
        phone: '1-800-898-7180'
    }
];

/* ─── Resource Card ─── */
const ResourceCard = ({ agency }) => (
    <div
        style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            padding: '28px 32px',
            borderLeft: '4px solid #003366',
            boxShadow: '0 2px 8px rgba(0, 51, 102, 0.04)',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 51, 102, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 51, 102, 0.04)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        {/* Title */}
        <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#1E272D',
            lineHeight: '1.35'
        }}>
            {agency.name}
        </h3>

        {/* Description */}
        <p style={{
            margin: '6px 0 0',
            fontSize: '15px',
            color: '#64748b',
            lineHeight: '1.5'
        }}>
            {agency.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {agency.tags.map((tag) => (
                <span
                    key={tag}
                    style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'rgba(0, 51, 102, 0.05)',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#334155'
                    }}
                >
                    {tag}
                </span>
            ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '18px' }}>
            <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#003366',
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}
            >
                <ExternalLink size={16} />
                Visit Website
            </a>

            {agency.phone && (
                <a
                    href={`tel:${agency.phone}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#334155',
                        textDecoration: 'none'
                    }}
                >
                    <Phone size={15} />
                    {agency.phone}
                </a>
            )}
        </div>
    </div>
);

/* ─── Resources Page ─── */
const Resources = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#EEF2F7',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Gradients */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-5%',
                width: '70vw',
                height: '60vh',
                background: 'radial-gradient(ellipse, rgba(0, 51, 102, 0.18) 0%, rgba(0, 51, 102, 0.06) 50%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                right: '-10%',
                width: '50vw',
                height: '50vh',
                background: 'radial-gradient(ellipse, rgba(100, 140, 200, 0.12) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <Navbar />

            {/* Content */}
            <main style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1000px',
                margin: '0 auto',
                paddingTop: '140px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingBottom: '80px'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <div style={{ background: '#003366', padding: '12px', borderRadius: '12px', color: 'white' }}>
                        <Landmark size={32} />
                    </div>
                    <h1 style={{ fontSize: '48px', fontWeight: '400', color: '#003366', margin: 0 }}>
                        Agency Resources
                    </h1>
                </div>
                <p style={{
                    fontSize: '18px',
                    color: '#64748b',
                    marginBottom: '48px',
                    marginLeft: '72px',
                    maxWidth: '700px',
                    lineHeight: '1.6'
                }}>
                    Direct access to government agencies and official resources. We bridge the communication gap between agencies that don't coordinate with each other.
                </p>

                {/* Resource Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {AGENCIES.map((agency) => (
                        <ResourceCard key={agency.name} agency={agency} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Resources;

