import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

/* ═══════════════════════════════════════════════════
   FULL DOCUMENT POOL
   Every document the system knows about.
   ═══════════════════════════════════════════════════ */
export const ALL_DOCUMENTS = [
    // ── Identity ──
    { id: 'birth-cert',        title: 'Birth Certificate (Original)',     source: 'Vital Records Office',        due: 'Feb 1, 2026',  description: 'Original or certified copy of birth certificate',              status: 'VERIFIED', category: 'Identity' },
    { id: 'passport',          title: 'Passport Copy',                    source: 'Department of State',          due: null,            description: 'Valid passport identification page copy',                      status: 'VERIFIED', category: 'Identity' },
    { id: 'ssn-card',          title: 'Social Security Card',             source: 'SSA',                          due: null,            description: 'Original Social Security card or replacement letter',          status: 'PENDING',  category: 'Identity' },
    // ── Student / Visa ──
    { id: 'i-20',              title: 'Form I-20 (Certificate of Eligibility)', source: 'University DSO',        due: 'Feb 15, 2026', description: 'SEVIS certificate of eligibility for F-1 status',             status: 'UPLOADED', category: 'Student' },
    { id: 'ds-160',            title: 'DS-160 Visa Application',          source: 'U.S. Embassy / Consulate',     due: null,            description: 'Online non-immigrant visa application confirmation',           status: 'PENDING',  category: 'Student' },
    { id: 'sevis-receipt',     title: 'SEVIS I-901 Fee Receipt',          source: 'ICE / SEVP',                   due: 'Feb 10, 2026', description: 'Payment confirmation for the I-901 SEVIS fee',                status: 'UPLOADED', category: 'Student' },
    { id: 'i-94',              title: 'I-94 Arrival / Departure Record',  source: 'CBP',                          due: null,            description: 'Electronic record of arrival and authorized stay',             status: 'VERIFIED', category: 'Student' },
    { id: 'enrollment-verify', title: 'Enrollment Verification Letter',   source: 'University Registrar',         due: null,            description: 'Official letter confirming full-time enrollment status',       status: 'PENDING',  category: 'Student' },
    { id: 'transcript',        title: 'Academic Transcript',              source: 'University Registrar',         due: null,            description: 'Official academic transcript with current GPA',                status: 'PENDING',  category: 'Student' },
    // ── Applications ──
    { id: 'n400',              title: 'Form N-400 (Naturalization)',      source: 'USCIS',                        due: 'Feb 7, 2026',  description: 'Application for naturalization form',                          status: 'UPLOADED', category: 'Applications' },
    { id: 'i-765',             title: 'Form I-765 (EAD Application)',     source: 'USCIS',                        due: null,            description: 'Application for employment authorization document',            status: 'PENDING',  category: 'Applications' },
    { id: 'i-485',             title: 'Form I-485 (Adjustment of Status)',source: 'USCIS',                        due: null,            description: 'Application to register permanent residence',                  status: 'PENDING',  category: 'Applications' },
    { id: 'i-130',             title: 'Form I-130 (Relative Petition)',   source: 'USCIS',                        due: null,            description: 'Petition for alien relative',                                  status: 'PENDING',  category: 'Applications' },
    { id: 'i-129',             title: 'Form I-129 (Worker Petition)',     source: 'USCIS',                        due: null,            description: 'Petition for a non-immigrant worker (H-1B, L-1, etc.)',       status: 'PENDING',  category: 'Applications' },
    // ── Financial ──
    { id: 'tax-returns',       title: 'Tax Returns (Last 5 Years)',       source: 'IRS',                          due: 'Feb 14, 2026', description: 'Federal tax return transcripts for the last 5 years',          status: 'UPLOADED', category: 'Financial' },
    { id: 'bank-statement',    title: 'Bank Statement / Financial Proof', source: 'Financial Institution',        due: null,            description: 'Recent bank statements showing sufficient funds',              status: 'PENDING',  category: 'Financial' },
    { id: 'scholarship-letter',title: 'Scholarship Award Letter',         source: 'University Financial Aid',     due: null,            description: 'Official letter confirming scholarship or financial aid',      status: 'PENDING',  category: 'Financial' },
    { id: 'affidavit-support', title: 'Affidavit of Support (I-134)',     source: 'Sponsor',                      due: null,            description: 'Financial sponsor affidavit guaranteeing support',           status: 'PENDING',  category: 'Financial' },
    // ── Work ──
    { id: 'employment-letter', title: 'Employment Verification Letter',   source: 'Current Employer',             due: 'Feb 10, 2026', description: 'Letter confirming current employment status',                  status: 'UPLOADED', category: 'Work' },
    { id: 'ead-card',          title: 'EAD Card (Employment Auth.)',      source: 'USCIS',                        due: null,            description: 'Employment Authorization Document card',                       status: 'PENDING',  category: 'Work' },
    { id: 'cpt-letter',        title: 'CPT Authorization Letter',         source: 'University DSO',               due: null,            description: 'Curricular Practical Training authorization for off-campus work', status: 'PENDING', category: 'Work' },
    { id: 'opt-ead',           title: 'OPT EAD Card',                     source: 'USCIS',                        due: null,            description: 'Optional Practical Training employment authorization',         status: 'PENDING',  category: 'Work' },
    // ── Family ──
    { id: 'marriage-cert',     title: 'Marriage Certificate',             source: 'County Clerk',                 due: null,            description: 'Certified copy of marriage certificate',                       status: 'VERIFIED', category: 'Family' },
    // ── Background ──
    { id: 'background-check',  title: 'FBI Background Check',             source: 'FBI',                          due: 'Mar 1, 2026',  description: 'Criminal background check clearance',                          status: 'UPLOADED', category: 'Background' },
    // ── Residence ──
    { id: 'lease-agreement',   title: 'Lease Agreement',                  source: 'Landlord / Property Management',due: null,           description: 'Current residential lease or mortgage statement',              status: 'VERIFIED', category: 'Residence' },
];

/* ═══════════════════════════════════════════════════
   DEFAULT SUGGESTED IDS
   Common docs every int'l student likely needs.
   ═══════════════════════════════════════════════════ */
const DEFAULT_SUGGESTED_IDS = [
    'passport', 'i-20', 'i-94', 'sevis-receipt', 'ds-160', 'bank-statement'
];

/* ═══════════════════════════════════════════════════
   KEYWORD → DOCUMENT MAPPING
   Used to surface documents based on conversation.
   ═══════════════════════════════════════════════════ */
const KEYWORD_DOC_MAP = [
    { keywords: ['visa', 'f-1', 'f1', 'student visa', 'entry', 'consulate', 'embassy', 'ds-160', 'ds160'],            docIds: ['ds-160', 'i-20', 'passport', 'sevis-receipt', 'i-94'] },
    { keywords: ['i-20', 'i20', 'sevis', 'dso', 'transfer', 'program'],                                                docIds: ['i-20', 'sevis-receipt', 'enrollment-verify'] },
    { keywords: ['work', 'job', 'employ', 'opt', 'cpt', 'ead', 'h-1b', 'h1b', 'labor', 'internship', 'practical'],    docIds: ['employment-letter', 'ead-card', 'cpt-letter', 'opt-ead', 'i-765', 'i-129'] },
    { keywords: ['tax', 'irs', 'income', 'w-2', 'w2', '1040'],                                                          docIds: ['tax-returns'] },
    { keywords: ['financial', 'bank', 'funds', 'tuition', 'afford', 'money', 'sponsor', 'support', 'scholarship'],      docIds: ['bank-statement', 'scholarship-letter', 'affidavit-support', 'tax-returns'] },
    { keywords: ['naturalization', 'citizen', 'n-400', 'n400', 'oath'],                                                  docIds: ['n400', 'birth-cert', 'background-check', 'tax-returns', 'lease-agreement'] },
    { keywords: ['green card', 'permanent resid', 'i-485', 'i485', 'adjustment', 'i-130', 'i130'],                       docIds: ['i-485', 'i-130', 'birth-cert', 'passport', 'marriage-cert'] },
    { keywords: ['marriage', 'spouse', 'married', 'family', 'petition'],                                                 docIds: ['marriage-cert', 'i-130', 'birth-cert'] },
    { keywords: ['background', 'criminal', 'fbi', 'moral character', 'arrest'],                                          docIds: ['background-check'] },
    { keywords: ['residenc', 'lease', 'rent', 'address', 'housing', 'landlord'],                                         docIds: ['lease-agreement'] },
    { keywords: ['identity', 'id', 'birth certificate', 'ssn', 'social security'],                                       docIds: ['birth-cert', 'passport', 'ssn-card'] },
    { keywords: ['enroll', 'full-time', 'registrar', 'gpa', 'transcript', 'academic'],                                   docIds: ['enrollment-verify', 'transcript'] },
    { keywords: ['travel', 'reentry', 'departure', 'arrive', 'arrival', 'i-94', 'i94', 'cbp'],                           docIds: ['i-94', 'passport', 'i-20'] },
];

/* ═══════════════════════════════════════════════════
   suggestDocsFromMessages
   Scan conversation for keywords → return doc IDs.
   ═══════════════════════════════════════════════════ */
export function suggestDocsFromMessages(messages) {
    if (!messages || messages.length <= 1) return DEFAULT_SUGGESTED_IDS;

    // Build a big lowercase corpus from user + assistant messages
    const corpus = messages
        .map(m => m.text)
        .join(' ')
        .toLowerCase();

    const matchedIds = new Set();

    KEYWORD_DOC_MAP.forEach(({ keywords, docIds }) => {
        if (keywords.some(kw => corpus.includes(kw))) {
            docIds.forEach(id => matchedIds.add(id));
        }
    });

    // Always include defaults so the list never goes empty
    DEFAULT_SUGGESTED_IDS.forEach(id => matchedIds.add(id));

    return [...matchedIds];
}

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Hello! I'm your LEGOL immigration assistant. I can help answer questions about dual citizenship, work visas, document requirements, and more. How can I assist you today?"
        }
    ]);
    const [studentCountry, setStudentCountry] = useState('Singapore');
    const [institution, setInstitution] = useState('Carnegie Mellon University');
    const [topic, setTopic] = useState(null);

    // Suggested document IDs – derived from conversation
    const [suggestedDocIds, setSuggestedDocIds] = useState(DEFAULT_SUGGESTED_IDS);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('chatState');
        if (saved) {
            try {
                const { messages: savedMessages, studentCountry: savedCountry, institution: savedInst, topic: savedTopic, suggestedDocIds: savedSuggested } = JSON.parse(saved);
                setMessages(savedMessages);
                setStudentCountry(savedCountry);
                setInstitution(savedInst);
                setTopic(savedTopic);
                if (savedSuggested) setSuggestedDocIds(savedSuggested);
            } catch (err) {
                console.error('Failed to load chat state:', err);
            }
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('chatState', JSON.stringify({
            messages,
            studentCountry,
            institution,
            topic,
            suggestedDocIds
        }));
    }, [messages, studentCountry, institution, topic, suggestedDocIds]);

    // Recompute suggestions whenever messages change
    useEffect(() => {
        const newIds = suggestDocsFromMessages(messages);
        setSuggestedDocIds(newIds);
    }, [messages]);

    // Helper: get full doc objects for current suggestions
    const suggestedDocs = suggestedDocIds
        .map(id => ALL_DOCUMENTS.find(d => d.id === id))
        .filter(Boolean);

    const addMessage = (role, text) => {
        setMessages(prev => [...prev, { role, text }]);
    };

    const clearMessages = () => {
        setMessages([
            {
                role: 'assistant',
                text: "Hello! I'm your LEGOL immigration assistant. I can help answer questions about dual citizenship, work visas, document requirements, and more. How can I assist you today?"
            }
        ]);
        setSuggestedDocIds(DEFAULT_SUGGESTED_IDS);
    };

    return (
        <ChatContext.Provider value={{
            messages,
            setMessages,
            addMessage,
            clearMessages,
            studentCountry,
            setStudentCountry,
            institution,
            setInstitution,
            topic,
            setTopic,
            suggestedDocIds,
            suggestedDocs
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within ChatProvider');
    }
    return context;
};
