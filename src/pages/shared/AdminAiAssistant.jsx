import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    Sparkles, Send, Bot, DollarSign, Calendar,
    BookOpen, CheckCircle2, AlertCircle, RefreshCw,
    Download, Phone, ArrowRight, Shield, Award, MessageSquare,
    ChevronDown, ThumbsUp, ThumbsDown, Copy, Check, Search,
    BarChart3, Users, Building2, FileText, Settings, Compass,
    Zap, ExternalLink, HelpCircle, Layers, Sliders, TrendingUp
} from 'lucide-react';

export default function AdminAiAssistant({ role = 'schooladmin-primary' }) {
    const navigate = useNavigate();
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const messagesEndRef = useRef(null);

    const isSuper = role === 'superadmin';
    const isSecondary = role === 'schooladmin-secondary';
    const isPrimary = role === 'schooladmin-primary';

    const schoolTitle = isSuper
        ? 'EduManage Platform Cloud'
        : isSecondary
            ? 'Kampala Secondary School (S.1 - S.6)'
            : 'Kampala Primary School (P.1 - P.7)';

    const roleName = isSuper
        ? 'Super Admin'
        : isSecondary
            ? 'Secondary School Principal'
            : 'Primary Headteacher';

    const basePath = isSuper
        ? '/superadmin'
        : isSecondary
            ? '/schooladmin/secondary'
            : '/schooladmin/primary';

    // Mock Knowledge Base for Admin
    const initialWelcomeMessage = isSuper
        ? `Greetings, Platform Administrator! I am your EduManage Super Admin AI Assistant. I can help you monitor multi-school health, inspect tenant subscriptions, analyze platform revenue (UGX 112M ARR), locate configuration panels, or troubleshoot server and tenant issues. What would you like to investigate today?`
        : `Hello Administrator! I am your EduManage AI Assistant for ${schoolTitle}. I have complete visibility across fees, UNEB academic records, staff timetables, parent directories, and attendance reports. I can instantly analyze your school data or guide you to any resource. How can I help you today?`;

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            time: 'Just now',
            text: initialWelcomeMessage,
            cardType: 'welcome',
            role
        }
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Quick Prompts categorized
    const schoolAdminPrompts = [
        { category: 'finance', label: '💰 Fee Defaulters Analysis', query: 'Show me the breakdown of outstanding fees and top defaulters this term.' },
        { category: 'navigator', label: '🧭 Where to edit Term Fees?', query: 'Where can I update our school fee structure and bank payment accounts?' },
        { category: 'academics', label: isSecondary ? '📊 UCE / UNEB Performance' : '📊 PLE Division Breakdown', query: isSecondary ? 'Analyze our current UCE Mock grades and division projections.' : 'Show me our PLE division breakdown and subject performance.' },
        { category: 'staff', label: '🧑‍🏫 Teacher Attendance & Rota', query: 'Which teachers are absent today and who has free periods to cover?' },
        { category: 'navigator', label: '📄 How to print Report Cards?', query: 'Where do I generate and batch print end-of-term PDF report cards?' },
        { category: 'generator', label: '📱 Draft Fee Reminder SMS', query: 'Draft an urgent SMS reminder to parents with fee balances over UGX 200,000.' },
        { category: 'academics', label: '🎒 Enrolment & Stream Capacity', query: 'What is the current student count per class and stream capacity?' },
    ];

    const superAdminPrompts = [
        { category: 'finance', label: '📈 Platform ARR & Revenue', query: 'Summarize platform subscription revenue, active plans, and pending renewals.' },
        { category: 'navigator', label: '🏫 Where to provision Schools?', query: 'Where do I approve new school registrations and assign subdomains?' },
        { category: 'monitoring', label: '🖥️ Server Load & DB Health', query: 'What is the current multi-tenant database latency and server resource usage?' },
        { category: 'navigator', label: '⚙️ Configure SMS Gateway', query: 'Where can I adjust the national SMS gateway settings and Twilio API keys?' },
        { category: 'schools', label: '📍 District Distribution', query: 'Show me active school distribution across Kampala, Wakiso, Mukono and Gulu.' },
        { category: 'generator', label: '📢 Draft System Maintenance Alert', query: 'Draft a platform-wide maintenance notification for all school admins.' },
    ];

    const quickPrompts = isSuper ? superAdminPrompts : schoolAdminPrompts;

    const filteredPrompts = activeFilter === 'all'
        ? quickPrompts
        : quickPrompts.filter(p => p.category === activeFilter);

    // AI Response Engine (Simulated UI)
    const generateAiResponse = (userText) => {
        const lower = userText.toLowerCase();
        let reply = '';
        let cardType = null;
        let cardData = null;

        if (isSuper) {
            // Super Admin Responses
            if (lower.includes('fee') || lower.includes('revenue') || lower.includes('arr') || lower.includes('subscription') || lower.includes('money') || lower.includes('renew')) {
                reply = `Here is the real-time **Platform Financial & Subscription Summary** across all 48 onboarded schools:`;
                cardType = 'sa-finance';
                cardData = {
                    totalRevenue: 'UGX 112.4M',
                    growth: '+24.5% vs last term',
                    activeSubscriptions: 48,
                    expiringThisMonth: 4,
                    tiers: [
                        { name: 'Enterprise (Secondary)', count: 28, rev: 'UGX 78.4M', badge: 'bg-blue-500/10 text-blue-400' },
                        { name: 'Standard (Primary)', count: 16, rev: 'UGX 28.8M', badge: 'bg-emerald-500/10 text-emerald-400' },
                        { name: 'Starter Pilot', count: 4, rev: 'UGX 5.2M', badge: 'bg-amber-500/10 text-amber-400' },
                    ],
                    targetLink: '/superadmin/subscriptions',
                    targetLabel: 'Open Subscriptions Ledger'
                };
            } else if (lower.includes('where') || lower.includes('locate') || lower.includes('find') || lower.includes('register') || lower.includes('provision') || lower.includes('school')) {
                reply = `You can manage, approve, and provision dedicated school subdomains in the **School Management Directory**:`;
                cardType = 'navigator';
                cardData = {
                    title: 'School Tenants Directory',
                    destination: '/superadmin/schools',
                    buttonLabel: 'Go to Schools Directory',
                    breadcrumbs: ['Super Admin', 'Schools Management', 'Tenant Subdomains'],
                    description: 'Approve incoming MoES school applications, configure subdomains (e.g. kampala.edumanage.com), view student limits, and toggle license statuses.',
                    quickLinks: [
                        { label: 'View Pending Approvals (3)', path: '/superadmin/schools' },
                        { label: 'Platform Usage Analytics', path: '/superadmin/analytics' },
                        { label: 'Emergency Tenant Lock', path: '/superadmin/emergency' },
                    ]
                };
            } else if (lower.includes('server') || lower.includes('health') || lower.includes('db') || lower.includes('latency') || lower.includes('cpu') || lower.includes('monitor')) {
                reply = `Here is the current **Infrastructure & Cloud Health Diagnostics**:`;
                cardType = 'sa-monitoring';
                cardData = {
                    uptime: '99.98%',
                    apiLatency: '34ms avg',
                    dbConnections: '184 active',
                    cpuLoad: '28% (Healthy)',
                    targetLink: '/superadmin/monitoring',
                    targetLabel: 'Open Cloud Monitor'
                };
            } else if (lower.includes('sms') || lower.includes('config') || lower.includes('key') || lower.includes('api') || lower.includes('gateway')) {
                reply = `SMS Gateway, SMTP credentials, and tenant security parameters are configured in **Platform Configuration**:`;
                cardType = 'navigator';
                cardData = {
                    title: 'Platform System Configuration',
                    destination: '/superadmin/configuration',
                    buttonLabel: 'Open Configuration Hub',
                    breadcrumbs: ['Super Admin', 'Configuration', 'API & Gateways'],
                    description: 'Manage telecom SMS bundles (MTN/Airtel Uganda integrations), payment gateways (PegPay, Flutterwave, Mobile Money), and global mailers.',
                    quickLinks: [
                        { label: 'Developer Webhooks', path: '/superadmin/devtools' },
                        { label: 'Audit Logs', path: '/superadmin/emergency' },
                    ]
                };
            } else if (lower.includes('draft') || lower.includes('alert') || lower.includes('maintenance') || lower.includes('broadcast')) {
                reply = `Here is a drafted platform broadcast message ready for dispatch to all Headteachers and System Admins:`;
                cardType = 'template';
                cardData = {
                    type: 'System Maintenance Notice',
                    targetAudience: 'All 48 School Headteachers & Administrators',
                    subject: 'Scheduled Platform Optimization — Saturday 11:00 PM',
                    content: `Dear EduManage Administrator,\n\nPlease be notified of a scheduled system upgrade on Saturday from 11:00 PM to 1:00 AM EAT to introduce enhanced UNEB division compilation algorithms.\n\nAll student records and fee data remain securely encrypted. School portals will resume immediately after maintenance.\n\n— EduManage Platform Operations Team`
                };
            } else {
                reply = `I have scanned the platform records. Based on your inquiry, here are the most relevant system controls and analytics for Super Admin:`;
                cardType = 'navigator';
                cardData = {
                    title: 'Platform Operations Center',
                    destination: '/superadmin/analytics',
                    buttonLabel: 'View Platform Analytics',
                    breadcrumbs: ['Super Admin', 'Platform Overview'],
                    description: 'Explore live multi-tenant telemetry, subscription recurring fees, and district adoption statistics.',
                    quickLinks: [
                        { label: 'All Schools List', path: '/superadmin/schools' },
                        { label: 'Subscription Manager', path: '/superadmin/subscriptions' },
                        { label: 'Developer Tools', path: '/superadmin/devtools' },
                    ]
                };
            }
        } else {
            // School Admin (Primary / Secondary) Responses
            if (lower.includes('fee') || lower.includes('defaulter') || lower.includes('money') || lower.includes('balance') || lower.includes('pay') || lower.includes('paid')) {
                reply = `Here is the verified **Term 1 Fee Collection Audit** for ${schoolTitle}:`;
                cardType = 'fees-audit';
                cardData = {
                    totalExpected: 'UGX 168,000,000',
                    totalCollected: 'UGX 142,800,000',
                    collectionRate: '85.0%',
                    outstanding: 'UGX 25,200,000',
                    defaultersCount: 34,
                    defaultersList: [
                        { name: 'Samuel Ssali', class: isSecondary ? 'S.4 East' : 'P.7 Blue', parent: 'Daniel Ssali', balance: 'UGX 750,000', phone: '+256 701 112 233' },
                        { name: 'David Ouma', class: isSecondary ? 'S.3 West' : 'P.6 Red', parent: 'Patricia Ouma', balance: 'UGX 450,000', phone: '+256 772 445 566' },
                        { name: 'Faith Kembabazi', class: isSecondary ? 'S.2 North' : 'P.5 Yellow', parent: 'Grace Kembabazi', balance: 'UGX 380,000', phone: '+256 752 778 899' },
                    ],
                    targetLink: `${basePath}/fees`,
                    targetLabel: 'Open Fee Structure & Ledgers'
                };
            } else if (lower.includes('where') || lower.includes('how to') || lower.includes('find') || lower.includes('locate') || lower.includes('edit fee') || lower.includes('bank') || lower.includes('account')) {
                if (lower.includes('fee') || lower.includes('bank') || lower.includes('payment')) {
                    reply = `You can edit term fee items, set bank accounts, and configure mobile money codes in **Fee Management**:`;
                    cardType = 'navigator';
                    cardData = {
                        title: 'Fee Structure & Payments Configuration',
                        destination: `${basePath}/fees`,
                        buttonLabel: 'Go to Fee Management',
                        breadcrumbs: ['School Admin', 'Finance & Fees', 'Fee Structure'],
                        description: 'Set tuition per stream, boarding/day scholar surcharges, uniform fees, and bank account numbers for payment slip generation.',
                        quickLinks: [
                            { label: 'View Payment Transactions', path: `${basePath}/payments` },
                            { label: 'School General Configuration', path: `${basePath}/configuration` },
                        ]
                    };
                } else if (lower.includes('report') || lower.includes('card') || lower.includes('pdf') || lower.includes('print')) {
                    reply = `End-of-term PDF report cards, division summaries, and UNEB assessment sheets are located in **Reports**:`;
                    cardType = 'navigator';
                    cardData = {
                        title: 'Academic Reports & PDF Generator',
                        destination: `${basePath}/reports`,
                        buttonLabel: 'Open Reports Center',
                        breadcrumbs: ['School Admin', 'Academics', 'Term Reports'],
                        description: 'Batch compile class report cards with headteacher remarks, class position rank, division standing, and printable stamp.',
                        quickLinks: [
                            { label: 'Class Stream Lists', path: `${basePath}/classes` },
                            { label: 'Student Directory', path: `${basePath}/students` },
                        ]
                    };
                } else if (lower.includes('teacher') || lower.includes('staff') || lower.includes('timetable') || lower.includes('schedule')) {
                    reply = `Teacher assignments, class schedules, and lesson periods are managed in **Timetable & Staff**:`;
                    cardType = 'navigator';
                    cardData = {
                        title: 'Timetable & Staff Scheduler',
                        destination: `${basePath}/timetable`,
                        buttonLabel: 'Open Master Timetable',
                        breadcrumbs: ['School Admin', 'Academics', 'Timetable'],
                        description: 'Configure 8-period daily schedules, assign subject teachers to streams, and detect teacher clashes automatically.',
                        quickLinks: [
                            { label: 'Teachers Directory', path: `${basePath}/teachers` },
                            { label: 'Class Stream Rosters', path: `${basePath}/classes` },
                        ]
                    };
                } else {
                    reply = `Here is the direct navigation link to the requested administrative module:`;
                    cardType = 'navigator';
                    cardData = {
                        title: 'School Configuration & Settings',
                        destination: `${basePath}/configuration`,
                        buttonLabel: 'Go to School Settings',
                        breadcrumbs: ['School Admin', 'Settings & Config'],
                        description: 'Update school details, contact numbers, term dates, and academic grading thresholds.',
                        quickLinks: [
                            { label: 'Student Enrolment', path: `${basePath}/students` },
                            { label: 'Parent Contacts', path: `${basePath}/parents` },
                        ]
                    };
                }
            } else if (lower.includes('grade') || lower.includes('ple') || lower.includes('uce') || lower.includes('uneb') || lower.includes('exam') || lower.includes('performance') || lower.includes('academic')) {
                reply = isSecondary
                    ? `Here is the **UCE Mock Exam & Continuous Assessment Analysis** for Senior 4:`
                    : `Here is the **PLE Mock Examination & Division Summary** for Primary 7:`;
                cardType = 'academics-summary';
                cardData = {
                    curriculum: isSecondary ? 'Uganda UCE / UACE National Standard' : 'Uganda PLE Primary Leaving Exam Standard',
                    candidatesCount: isSecondary ? 184 : 142,
                    divisions: [
                        { name: 'Division 1', count: isSecondary ? 76 : 68, percentage: isSecondary ? '41.3%' : '47.9%', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                        { name: 'Division 2', count: isSecondary ? 82 : 54, percentage: isSecondary ? '44.6%' : '38.0%', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                        { name: 'Division 3', count: isSecondary ? 22 : 16, percentage: isSecondary ? '12.0%' : '11.3%', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                        { name: 'Division 4 / U', count: isSecondary ? 4 : 4, percentage: isSecondary ? '2.1%' : '2.8%', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                    ],
                    topSubjects: ['Mathematics (84% D1/D2)', 'English Language (81% D1/D2)', 'Science / Physics (79% D1/D2)'],
                    needsAttention: isSecondary ? 'Chemistry Practical Lab Work (S.3 & S.4)' : 'Social Studies Section B (P.6)',
                    targetLink: `${basePath}/reports`,
                    targetLabel: 'View Detailed Marksheets'
                };
            } else if (lower.includes('teacher') || lower.includes('staff') || lower.includes('absent') || lower.includes('free period') || lower.includes('cover')) {
                reply = `Here is today's **Staff Attendance & Lesson Cover Summary**:`;
                cardType = 'staff-summary';
                cardData = {
                    totalTeachers: 42,
                    presentToday: 39,
                    onLeave: 3,
                    absentList: [
                        { name: 'Tr. David Mukasa (Science)', reason: 'Official MoES Workshop', cover: 'Tr. Sarah Nabirye (Period 3 & 5)' },
                        { name: 'Tr. Grace Atuhaire (Maths)', reason: 'Sick Leave (1 day)', cover: 'Mr. Kenneth Okello (Period 2 & 4)' },
                    ],
                    availableSubstitutes: ['Tr. Joseph Kato (Free Periods 2, 4, 6)', 'Tr. Brenda Namubiru (Free Periods 3, 5)'],
                    targetLink: `${basePath}/teachers`,
                    targetLabel: 'Open Staff Roster'
                };
            } else if (lower.includes('sms') || lower.includes('draft') || lower.includes('message') || lower.includes('parent') || lower.includes('reminder') || lower.includes('broadcast')) {
                reply = `Here is a drafted **Fee Reminder SMS Broadcast** tailored for Ugandan parents:`;
                cardType = 'template';
                cardData = {
                    type: 'Parent Fee Reminder Broadcast',
                    targetAudience: '34 Parents with Balances > UGX 200,000',
                    subject: 'Kampala School — Term 1 Fee Clearance Notice',
                    content: `Dear Parent/Guardian of {Student_Name},\n\nThis is a gentle reminder from Kampala School that the Term 1 fee balance of UGX {Balance} is due before midterm exams.\n\nPlease complete payment via School Bank PayCode or School Mobile Money (*165*4#). Disregard if already cleared.\n\nInquiries: +256 700 000 000.\n— Administration`
                };
            } else if (lower.includes('enrol') || lower.includes('student') || lower.includes('stream') || lower.includes('capacity') || lower.includes('class')) {
                reply = `Here is the current **Student Enrolment & Stream Distribution**:`;
                cardType = 'enrolment-summary';
                cardData = {
                    totalEnrolled: 985,
                    capacity: 1100,
                    occupancyRate: '89.5%',
                    streams: isSecondary ? [
                        { name: 'Senior 1 (East & West)', students: 198, max: 200 },
                        { name: 'Senior 2 (East & West)', students: 192, max: 200 },
                        { name: 'Senior 3 (East & West)', students: 185, max: 200 },
                        { name: 'Senior 4 (East & West)', students: 184, max: 200 },
                        { name: 'Senior 5 (Arts & Sciences)', students: 118, max: 150 },
                        { name: 'Senior 6 (Arts & Sciences)', students: 108, max: 150 },
                    ] : [
                        { name: 'Primary 1 (Blue & Red)', students: 148, max: 160 },
                        { name: 'Primary 2 (Blue & Red)', students: 145, max: 160 },
                        { name: 'Primary 3 (Blue & Red)', students: 142, max: 160 },
                        { name: 'Primary 4 (Blue & Red)', students: 138, max: 160 },
                        { name: 'Primary 5 (Blue & Red)', students: 136, max: 160 },
                        { name: 'Primary 6 (Blue & Red)', students: 134, max: 160 },
                        { name: 'Primary 7 (Candidate Class)', students: 142, max: 145 },
                    ],
                    targetLink: `${basePath}/students`,
                    targetLabel: 'Open Students Directory'
                };
            } else {
                reply = `I have analyzed your query for ${schoolTitle}. Here are the most relevant data views and quick links:`;
                cardType = 'navigator';
                cardData = {
                    title: 'School Administration Quick Portal',
                    destination: `${basePath}`,
                    buttonLabel: 'Go to Main Dashboard',
                    breadcrumbs: ['School Admin', 'Overview'],
                    description: 'Explore live enrollment trends, fee collection status, and daily teacher roll calls.',
                    quickLinks: [
                        { label: 'Fee Ledgers', path: `${basePath}/fees` },
                        { label: 'UNEB Report Cards', path: `${basePath}/reports` },
                        { label: 'Staff Timetable', path: `${basePath}/timetable` },
                    ]
                };
            }
        }

        return {
            id: Date.now(),
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: reply,
            cardType,
            cardData
        };
    };

    const handleSendMessage = (textToSend) => {
        const query = textToSend || inputMessage;
        if (!query.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: query
        };

        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse = generateAiResponse(query);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 600);
    };

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleResetChat = () => {
        setMessages([
            {
                id: Date.now(),
                sender: 'ai',
                time: 'Just now',
                text: initialWelcomeMessage,
                cardType: 'welcome',
                role
            }
        ]);
    };

    return (
        <DashboardLayout role={role}>
            <div className="flex flex-col h-[calc(100vh-6rem)] max-w-7xl mx-auto">

                {/* Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin AI Intelligence Hub</h1>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    {isSuper ? 'Cloud Multi-Tenant AI' : 'School Executive Copilot'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                {schoolTitle} • Real-time Data Analytics & Deep Resource Navigator
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleResetChat}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                            title="Reset chat conversation"
                        >
                            <RefreshCw size={13} />
                            <span className="hidden sm:inline">Reset Chat</span>
                        </button>
                    </div>
                </div>

                {/* Filter Category Chips */}
                <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-slate-800/60 flex-shrink-0 text-xs">
                    <span className="text-gray-400 dark:text-slate-500 font-medium mr-1 flex items-center gap-1">
                        <Compass size={13} /> Topics:
                    </span>
                    {[
                        { id: 'all', label: 'All Queries' },
                        { id: 'finance', label: '💰 Finance & Fees' },
                        { id: 'navigator', label: '🧭 Page Finder' },
                        ...(isSuper ? [
                            { id: 'monitoring', label: '🖥️ Cloud Telemetry' },
                            { id: 'schools', label: '🏫 School Tenants' }
                        ] : [
                            { id: 'academics', label: '📊 UNEB & Grades' },
                            { id: 'staff', label: '🧑‍🏫 Staff & Rota' }
                        ]),
                        { id: 'generator', label: '📝 Draft Templates' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                                activeFilter === tab.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Chat Messages Stream */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id || idx}
                            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                                    <Bot size={17} />
                                </div>
                            )}

                            <div className={`max-w-3xl space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                                            : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                                    }`}
                                >
                                    <p className="whitespace-pre-line">{msg.text}</p>

                                    {/* Card: Welcome / Capabilities */}
                                    {msg.cardType === 'welcome' && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-700/60">
                                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                                    <Compass size={14} /> Instant Resource Finder
                                                </p>
                                                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                                                    Ask "Where do I configure fees?" or "How to export marksheets" to jump straight to that dashboard.
                                                </p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-700/60">
                                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                                    <BarChart3 size={14} /> Live Data & UNEB Calculations
                                                </p>
                                                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                                                    Query fee defaulters, PLE/UCE division standings, teacher attendance, or stream capacity in seconds.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: Deep Navigator / Resource Locator */}
                                    {msg.cardType === 'navigator' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                                        {msg.cardData.title}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400">
                                                        {msg.cardData.breadcrumbs?.join(' > ')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-slate-300 mb-3">
                                                    {msg.cardData.description}
                                                </p>
                                                <button
                                                    onClick={() => navigate(msg.cardData.destination)}
                                                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                                                >
                                                    <span>{msg.cardData.buttonLabel || 'Jump to Page'}</span>
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>

                                            {msg.cardData.quickLinks && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium py-1">Related links:</span>
                                                    {msg.cardData.quickLinks.map((ql, qIdx) => (
                                                        <button
                                                            key={qIdx}
                                                            onClick={() => navigate(ql.path)}
                                                            className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-[11px] font-medium text-gray-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                                                        >
                                                            <span>{ql.label}</span>
                                                            <ExternalLink size={10} className="text-gray-400" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Card: School Fee Collection Audit */}
                                    {msg.cardType === 'fees-audit' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                                                    <p className="text-[10px] text-gray-500 dark:text-slate-400">Total Expected</p>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{msg.cardData.totalExpected}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Collected ({msg.cardData.collectionRate})</p>
                                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{msg.cardData.totalCollected}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                                                    <p className="text-[10px] text-rose-600 dark:text-rose-400">Outstanding</p>
                                                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300 mt-0.5">{msg.cardData.outstanding}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                                    <p className="text-[10px] text-amber-600 dark:text-amber-400">Defaulters</p>
                                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mt-0.5">{msg.cardData.defaultersCount} Students</p>
                                                </div>
                                            </div>

                                            {/* Defaulter Table Snippet */}
                                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400">
                                                        <tr>
                                                            <th className="p-2 font-semibold">Student</th>
                                                            <th className="p-2 font-semibold">Class</th>
                                                            <th className="p-2 font-semibold">Parent & Contact</th>
                                                            <th className="p-2 font-semibold text-right">Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-[11px]">
                                                        {msg.cardData.defaultersList.map((d, dIdx) => (
                                                            <tr key={dIdx} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                                                                <td className="p-2 font-medium text-gray-900 dark:text-white">{d.name}</td>
                                                                <td className="p-2 text-gray-500 dark:text-slate-400">{d.class}</td>
                                                                <td className="p-2 text-gray-600 dark:text-slate-300">{d.parent} ({d.phone})</td>
                                                                <td className="p-2 text-right font-bold text-rose-600 dark:text-rose-400">{d.balance}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                                <button
                                                    onClick={() => handleSendMessage('Draft an urgent fee reminder SMS for these parents')}
                                                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <MessageSquare size={13} />
                                                    <span>Draft SMS Broadcast</span>
                                                </button>
                                                <button
                                                    onClick={() => navigate(msg.cardData.targetLink)}
                                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>{msg.cardData.targetLabel}</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: UNEB & Academic Projections */}
                                    {msg.cardType === 'academics-summary' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {msg.cardData.divisions.map((div, divIdx) => (
                                                    <div key={divIdx} className={`p-2.5 rounded-lg border text-center ${div.color}`}>
                                                        <p className="text-xs font-bold">{div.name}</p>
                                                        <p className="text-base font-extrabold mt-0.5">{div.count}</p>
                                                        <p className="text-[10px] opacity-80">{div.percentage} of candidates</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 space-y-1.5 text-xs">
                                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    <Award size={14} /> Top Performing Subjects:
                                                </div>
                                                <p className="text-gray-600 dark:text-slate-300 pl-5">
                                                    {msg.cardData.topSubjects.join(' • ')}
                                                </p>
                                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold pt-1">
                                                    <AlertCircle size={14} /> Priority Academic Attention:
                                                </div>
                                                <p className="text-gray-600 dark:text-slate-300 pl-5">
                                                    {msg.cardData.needsAttention}
                                                </p>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(msg.cardData.targetLink)}
                                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>{msg.cardData.targetLabel}</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: Staff Attendance & Rota */}
                                    {msg.cardType === 'staff-summary' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    <CheckCircle2 size={15} /> {msg.cardData.presentToday} Present
                                                </div>
                                                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                                                    <AlertCircle size={15} /> {msg.cardData.onLeave} on Approved Leave
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {msg.cardData.absentList.map((a, aIdx) => (
                                                    <div key={aIdx} className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs">
                                                        <div className="flex items-center justify-between font-semibold text-gray-900 dark:text-white">
                                                            <span>{a.name}</span>
                                                            <span className="text-amber-600 dark:text-amber-400 text-[11px]">{a.reason}</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                                                            Cover plan: <span className="text-blue-600 dark:text-blue-400 font-medium">{a.cover}</span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(msg.cardData.targetLink)}
                                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>{msg.cardData.targetLabel}</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: Generated Template / SMS / Circular */}
                                    {msg.cardType === 'template' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-800 mb-2">
                                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        {msg.cardData.type}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 dark:text-slate-400">
                                                        Audience: {msg.cardData.targetAudience}
                                                    </span>
                                                </div>
                                                <pre className="text-xs font-mono text-gray-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                                                    {msg.cardData.content}
                                                </pre>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Ready to copy and paste into SMS or circular</span>
                                                <button
                                                    onClick={() => handleCopy(msg.cardData.content, idx)}
                                                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <>
                                                            <Check size={13} className="text-emerald-500" />
                                                            <span className="text-emerald-500">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={13} />
                                                            <span>Copy Template</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: Super Admin Finance Overview */}
                                    {msg.cardType === 'sa-finance' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="grid grid-cols-2 gap-2 text-center">
                                                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                                    <p className="text-[10px] text-blue-600 dark:text-blue-400">Total ARR</p>
                                                    <p className="text-base font-extrabold text-blue-700 dark:text-blue-300 mt-0.5">{msg.cardData.totalRevenue}</p>
                                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{msg.cardData.growth}</p>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                                                    <p className="text-[10px] text-gray-500 dark:text-slate-400">Active Tenant Portals</p>
                                                    <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{msg.cardData.activeSubscriptions} Schools</p>
                                                    <p className="text-[10px] text-amber-600 dark:text-amber-400">{msg.cardData.expiringThisMonth} renewals this month</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                {msg.cardData.tiers.map((t, tIdx) => (
                                                    <div key={tIdx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-xs border border-gray-200/60 dark:border-slate-700/60">
                                                        <span className="font-semibold text-gray-800 dark:text-slate-200">{t.name} ({t.count} schools)</span>
                                                        <span className="font-bold text-gray-900 dark:text-white font-mono">{t.rev}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(msg.cardData.targetLink)}
                                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>{msg.cardData.targetLabel}</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: Super Admin Monitoring */}
                                    {msg.cardType === 'sa-monitoring' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Cloud Uptime</p>
                                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{msg.cardData.uptime}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                                    <p className="text-[10px] text-blue-600 dark:text-blue-400">API Response</p>
                                                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mt-0.5">{msg.cardData.apiLatency}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400">DB Sessions</p>
                                                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">{msg.cardData.dbConnections}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">CPU Load</p>
                                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{msg.cardData.cpuLoad}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(msg.cardData.targetLink)}
                                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>{msg.cardData.targetLabel}</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card: Enrolment Distribution */}
                                    {msg.cardType === 'enrolment-summary' && msg.cardData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/80 space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-gray-700 dark:text-slate-300">Total Enrolled: {msg.cardData.totalEnrolled} / {msg.cardData.capacity}</span>
                                                <span className="font-bold text-blue-600 dark:text-blue-400">{msg.cardData.occupancyRate} Capacity</span>
                                            </div>

                                            <div className="space-y-1.5">
                                                {msg.cardData.streams.map((s, sIdx) => {
                                                    const pct = Math.round((s.students / s.max) * 100);
                                                    return (
                                                        <div key={sIdx} className="space-y-1">
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="font-medium text-gray-700 dark:text-slate-300">{s.name}</span>
                                                                <span className="text-gray-500">{s.students} / {s.max} ({pct}%)</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(msg.cardData.targetLink)}
                                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>{msg.cardData.targetLabel}</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className={`flex items-center gap-2 px-1 text-[11px] text-gray-400 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <span>{msg.time}</span>
                                    {msg.sender === 'ai' && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleCopy(msg.text, idx)}
                                                className="p-1 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
                                                title="Copy answer"
                                            >
                                                {copiedIndex === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            </button>
                                            <button className="p-1 hover:text-gray-600 dark:hover:text-slate-200 transition-colors" title="Helpful">
                                                <ThumbsUp size={12} />
                                            </button>
                                            <button className="p-1 hover:text-gray-600 dark:hover:text-slate-200 transition-colors" title="Not helpful">
                                                <ThumbsDown size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Bot size={17} />
                            </div>
                            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                                <span className="text-xs text-gray-400 ml-2">Searching school records...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Prompt Suggestions Bar */}
                <div className="pt-2 pb-1.5 flex-shrink-0">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {filteredPrompts.slice(0, 4).map((p, pIdx) => (
                            <button
                                key={pIdx}
                                onClick={() => handleSendMessage(p.query)}
                                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-xs text-gray-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm"
                            >
                                <span>{p.label}</span>
                                <ArrowRight size={11} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Bar */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="pt-2 flex-shrink-0"
                >
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={
                                isSuper
                                    ? "Ask about platform ARR, server latency, school subdomains, SMS config..."
                                    : "Ask where to find a resource, analyze fee defaulters, PLE/UCE divisions, or draft a circular..."
                            }
                            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim()}
                            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Send size={15} />
                        </button>
                    </div>
                    <p className="text-[11px] text-gray-400 text-center mt-1.5">
                        💡 EduManage Admin AI Copilot • Provides instant data lookup, calculations & navigation shortcuts across your institution.
                    </p>
                </form>

            </div>
        </DashboardLayout>
    );
}
