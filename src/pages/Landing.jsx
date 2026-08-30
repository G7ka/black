import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Building2, Users, ArrowRight, Globe, GraduationCap,
    Menu, X, CheckCircle2, ChevronDown, BookOpen, BarChart3,
    Smartphone, HeartHandshake, Zap, Lock, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { label: 'About Us', href: '#about' },
    { label: 'How We Work', href: '#how' },
    { label: 'Why Us', href: '#why' },
    { label: 'Register', href: '/register', isRoute: true },
];

export default function Landing() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [schoolSearch, setSchoolSearch] = useState('');

    const handleNavClick = (link) => {
        setMenuOpen(false);
        if (link.isRoute) {
            navigate(link.href);
        } else {
            const el = document.querySelector(link.href);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSchoolSearch = (e) => {
        if (e) e.preventDefault();
        const query = schoolSearch.trim().toLowerCase();
        if (!query) return;

        let cleanSubdomain = query
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        if (cleanSubdomain.includes('lvh-me')) cleanSubdomain = cleanSubdomain.replace('-lvh-me', '');
        if (cleanSubdomain.includes('edumanage-com')) cleanSubdomain = cleanSubdomain.replace('-edumanage-com', '');

        const currentPort = window.location.port ? `:${window.location.port}` : ':5173';
        const hostname = window.location.hostname;

        let targetUrl = '';
        if (hostname.includes('localhost')) {
            targetUrl = `http://${cleanSubdomain}.localhost${currentPort}`;
        } else if (hostname.includes('lvh.me')) {
            targetUrl = `http://${cleanSubdomain}.lvh.me${currentPort}`;
        } else if (hostname === '127.0.0.1') {
            targetUrl = `http://127.0.0.1${currentPort}/?tenant=${cleanSubdomain}`;
        } else {
            targetUrl = `https://${cleanSubdomain}.edumanage.com`;
        }

        window.location.href = targetUrl;
    };

    const aboutCards = [
        {
            icon: <GraduationCap size={26} />,
            bgClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:border-blue-500/50',
            title: 'Our Mission',
            desc: 'Empower every Ugandan school — urban or rural — with modern management tools that are affordable, reliable, and easy to use.'
        },
        {
            icon: <HeartHandshake size={26} />,
            bgClass: 'bg-violet-500/20 text-violet-400 border-violet-500/30 hover:border-violet-500/50',
            title: 'Our Values',
            desc: 'We put schools first. Transparency, data privacy, and genuine local support are at the core of everything we build.'
        },
        {
            icon: <Globe size={26} />,
            bgClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50',
            title: 'Our Reach',
            desc: "Serving hundreds of schools across Uganda, from Kampala to Gulu, with a multi-tenant platform that keeps every school's data separate and secure."
        },
    ];

    const howItWorksSteps = [
        {
            step: '01',
            icon: <Building2 size={20} />,
            badgeClass: 'text-blue-400 bg-blue-500/10',
            iconClass: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
            title: 'Register Your School',
            desc: 'Fill in your school details, upload your MoES license, and choose a unique subdomain. The whole process takes about 5 minutes.'
        },
        {
            step: '02',
            icon: <Shield size={20} />,
            badgeClass: 'text-violet-400 bg-violet-500/10',
            iconClass: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
            title: 'Verification & Approval',
            desc: 'Our team reviews your documents within 24 hours. Once approved, your school portal goes live and you receive your admin credentials.'
        },
        {
            step: '03',
            icon: <Users size={20} />,
            badgeClass: 'text-amber-400 bg-amber-500/10',
            iconClass: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
            title: 'Add Staff, Students & Parents',
            desc: 'Log into your dashboard and add teachers, enroll students, and link parents. Each person gets their own secure login.'
        },
        {
            step: '04',
            icon: <BookOpen size={20} />,
            badgeClass: 'text-emerald-400 bg-emerald-500/10',
            iconClass: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
            title: 'Run Your School Digitally',
            desc: 'Mark attendance, issue fees, record grades, send messages to parents — all in one place, from any device.'
        },
        {
            step: '05',
            icon: <BarChart3 size={20} />,
            badgeClass: 'text-indigo-400 bg-indigo-500/10',
            iconClass: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400',
            title: 'Insights & Reports',
            desc: 'Generate termly performance reports, fee collection summaries, and attendance analytics with a single click.'
        },
    ];

    const whyUsCards = [
        {
            icon: <Lock size={22} />,
            title: 'Data Privacy First',
            desc: "Every school gets an isolated subdomain. Your students' data is never mixed with another school's records.",
            iconClass: 'bg-blue-500/15 text-blue-400 border-blue-500/25'
        },
        {
            icon: <Smartphone size={22} />,
            title: 'Works on Any Device',
            desc: 'Parents check grades on a smartphone. Teachers mark attendance on a tablet. Everything is fully responsive.',
            iconClass: 'bg-violet-500/15 text-violet-400 border-violet-500/25'
        },
        {
            icon: <Zap size={22} />,
            title: 'Lightning Fast Setup',
            desc: 'Go from registration to a fully live school portal in under 24 hours — no IT team required.',
            iconClass: 'bg-amber-500/15 text-amber-400 border-amber-500/25'
        },
        {
            icon: <BarChart3 size={22} />,
            title: 'Real-Time Analytics',
            desc: 'Live dashboards let headteachers track performance, attendance trends, and fee collection instantly.',
            iconClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
        },
        {
            icon: <HeartHandshake size={22} />,
            title: 'Local Support Team',
            desc: "We're based in Uganda. When you need help, you speak to someone who understands your school context.",
            iconClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25'
        },
        {
            icon: <CheckCircle2 size={22} />,
            title: 'Affordable Pricing',
            desc: 'Flexible subscription plans designed for Ugandan school budgets — from small primary schools to large secondaries.',
            iconClass: 'bg-rose-500/15 text-rose-400 border-rose-500/25'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden font-sans scroll-smooth text-slate-200">

            {/* ─── NAVBAR ─── */}
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="px-5 py-4 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-50 border-b border-white/10"
            >
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <GraduationCap size={22} className="text-white" />
                    </div>
                    <span className="text-white font-extrabold text-xl tracking-tight">EduManage</span>
                </motion.div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((l) => (
                        <motion.button
                            key={l.label}
                            whileHover={{ scale: l.isRoute ? 1.03 : 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleNavClick(l)}
                            className={l.isRoute
                                ? 'bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-sm'
                                : 'text-slate-300 hover:text-white font-medium text-sm transition-colors'
                            }
                        >
                            {l.label} {l.isRoute && <ArrowRight size={14} />}
                        </motion.button>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </motion.header>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-0 top-[65px] bg-slate-900/98 backdrop-blur-md z-40 flex flex-col gap-2 px-5 pt-6"
                    >
                        {NAV_LINKS.map((l) => (
                            <button
                                key={l.label}
                                onClick={() => handleNavClick(l)}
                                className="w-full text-left px-4 py-4 text-white font-semibold text-lg border-b border-white/10 hover:text-blue-400 transition-colors"
                            >
                                {l.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── HERO ─── */}
            <section className="relative pt-20 pb-28 px-5">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-0 w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-3xl -z-10 pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-32 right-0 w-[400px] h-[400px] bg-violet-700/20 rounded-full blur-3xl -z-10 pointer-events-none"
                />

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-semibold mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        The Standard for Ugandan Schools
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
                    >
                        One Platform.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                            Every School in Uganda.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        The complete school management system built for Ugandan institutions — from attendance and fees to performance reports and parent communication.
                    </motion.p>

                    {/* School Finder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="max-w-xl mx-auto mb-8"
                    >
                        <p className="text-slate-400 text-sm mb-3 font-medium">
                            Parents, Students, Teachers &amp; Schools — find your school portal:
                        </p>
                        <form onSubmit={handleSchoolSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={schoolSearch}
                                    onChange={(e) => setSchoolSearch(e.target.value)}
                                    placeholder="Type your school name…"
                                    className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap flex items-center gap-2"
                            >
                                Go <ArrowRight size={16} />
                            </motion.button>
                        </form>
                        <p className="text-slate-500 text-xs mt-2">e.g. &quot;Kampala High&quot; → takes you straight to your school&apos;s dashboard</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-base hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Building2 size={18} /> Register Your School
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { const el = document.querySelector('#about'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-base hover:bg-white/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            Learn More <ChevronDown size={18} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── ABOUT US ─── */}
            <section id="about" className="py-20 border-t border-white/5 relative bg-slate-900 z-10">
                <div className="max-w-6xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">About Us</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">Built for Ugandan Education</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            EduManage was founded with a single mission: to digitise and streamline school administration in Uganda so teachers can focus on teaching, parents stay informed, and school leaders can make data-driven decisions.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aboutCards.map((card, i) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`bg-slate-800/50 border rounded-2xl p-8 transition-colors cursor-pointer ${card.bgClass}`}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-current/30 bg-current/10">
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW WE WORK ─── */}
            <section id="how" className="py-20 border-t border-white/5 bg-slate-800/30">
                <div className="max-w-5xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="text-violet-400 font-semibold text-sm uppercase tracking-widest">How We Work</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">From Registration to Running</h2>
                        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                            Getting your school onto EduManage takes less than 24 hours. Here&apos;s exactly how it works.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical connector line (desktop) */}
                        <div className="hidden lg:block absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500 opacity-30" />

                        <div className="space-y-8">
                            {howItWorksSteps.map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    whileHover={{ x: 4 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.12 }}
                                    className="flex gap-5 items-start group"
                                >
                                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 ${item.iconClass}`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 bg-slate-800/60 border border-white/10 rounded-2xl p-6 group-hover:border-white/20 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeClass}`}>Step {item.step}</span>
                                            <h3 className="text-white font-bold text-base">{item.title}</h3>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHY US ─── */}
            <section id="why" className="py-20 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-widest">Why EduManage</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">The Smart Choice for Ugandan Schools</h2>
                        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                            There are other systems out there. Here&apos;s why hundreds of schools chose EduManage.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {whyUsCards.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="bg-slate-800/50 border border-white/10 rounded-2xl p-7 hover:border-white/25 transition-all group"
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 border group-hover:scale-110 transition-transform ${item.iconClass}`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA BANNER ─── */}
            <section className="py-20 border-t border-white/5 bg-gradient-to-br from-blue-900/40 to-violet-900/40">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto px-5 text-center"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to join Uganda&apos;s fastest-growing school network?</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Register your school today and get your own secure portal within 24 hours.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/register')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-blue-900/40"
                    >
                        <Building2 size={18} /> Register Your School <ArrowRight size={16} />
                    </motion.button>
                </motion.div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="border-t border-white/10 py-8 px-5 bg-slate-950">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <GraduationCap size={16} className="text-white" />
                        </div>
                        <span className="text-white font-bold">EduManage</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm text-center md:text-left">
                            &copy; {new Date().getFullYear()} EduManage. All rights reserved. Built for African education.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
