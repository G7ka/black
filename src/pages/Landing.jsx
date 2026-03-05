import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Building2, Users, ArrowRight, Globe, GraduationCap,
    Menu, X, CheckCircle2, ChevronDown, BookOpen, BarChart3,
    Smartphone, HeartHandshake, Zap, Lock, Search
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    const [openFaq, setOpenFaq] = useState(null);

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
        e.preventDefault();
        const slug = schoolSearch.trim().toLowerCase().replace(/\s+/g, '');
        if (!slug) return;
        window.location.href = `http://${slug}.lvh.me:5173`;
    };

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    return (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden font-sans scroll-smooth">

            {/* ─── NAVBAR ─── */}
            <header className="px-5 py-4 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-50 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <GraduationCap size={22} className="text-white" />
                    </div>
                    <span className="text-white font-extrabold text-xl tracking-tight">EduManage</span>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => handleNavClick(l)}
                            className={l.isRoute
                                ? 'bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all flex items-center gap-2'
                                : 'text-slate-300 hover:text-white font-medium text-sm transition-colors'
                            }
                        >
                            {l.label} {l.isRoute && <ArrowRight size={14} />}
                        </button>
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
            </header>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="md:hidden fixed inset-0 top-[65px] bg-slate-900/98 backdrop-blur-md z-40 flex flex-col gap-2 px-5 pt-6">
                    {NAV_LINKS.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => handleNavClick(l)}
                            className="w-full text-left px-4 py-4 text-white font-semibold text-lg border-b border-white/10 hover:text-blue-400 transition-colors"
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ─── HERO ─── */}
            <section className="relative pt-20 pb-28 px-5">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-0 w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-3xl -z-10" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-32 right-0 w-[400px] h-[400px] bg-violet-700/20 rounded-full blur-3xl -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-semibold mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        The Standard for Ugandan Schools
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                        One Platform.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                            Every School in Uganda.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The complete school management system built for Ugandan institutions — from attendance and fees to performance reports and parent communication.
                    </p>

                    {/* School Finder */}
                    <div className="max-w-xl mx-auto mb-8">
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
                                    className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap flex items-center gap-2"
                            >
                                Go <ArrowRight size={16} />
                            </button>
                        </form>
                        <p className="text-slate-500 text-xs mt-2">e.g. "Kampala High" → takes you straight to your school's dashboard</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-base hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Building2 size={18} /> Register Your School
                        </button>
                        <button
                            onClick={() => { const el = document.querySelector('#about'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-base hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            Learn More <ChevronDown size={18} />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ─── ABOUT US ─── */}
            <section id="about" className="py-20 border-t border-white/5 relative bg-slate-900 z-10">
                <div className="max-w-6xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
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
                        {[
                            {
                                icon: <GraduationCap size={26} />, color: 'blue',
                                title: 'Our Mission',
                                desc: 'Empower every Ugandan school — urban or rural — with modern management tools that are affordable, reliable, and easy to use.'
                            },
                            {
                                icon: <HeartHandshake size={26} />, color: 'violet',
                                title: 'Our Values',
                                desc: 'We put schools first. Transparency, data privacy, and genuine local support are at the core of everything we build.'
                            },
                            {
                                icon: <Globe size={26} />, color: 'emerald',
                                title: 'Our Reach',
                                desc: 'Serving hundreds of schools across Uganda, from Kampala to Gulu, with a multi-tenant platform that keeps every school\'s data separate and secure.'
                            },
                        ].map((card, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05, y: -5, boxShadow: `0 20px 40px -10px rgba(var(--color-${card.color}-500), 0.2)` }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1, scale: { duration: 0.2 }, y: { duration: 0.2 } }}
                                key={card.title}
                                className={`bg-slate-800/50 border border-white/10 rounded-2xl p-8 hover:border-${card.color}-500/50 transition-colors cursor-pointer`}
                            >
                                <div className={`w-12 h-12 bg-${card.color}-500/20 text-${card.color}-400 rounded-xl flex items-center justify-center mb-5 border border-${card.color}-500/30`}>
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="text-violet-400 font-semibold text-sm uppercase tracking-widest">How We Work</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">From Registration to Running</h2>
                        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                            Getting your school onto EduManage takes less than 24 hours. Here's exactly how it works.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical connector line (desktop) */}
                        <div className="hidden lg:block absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500 opacity-30" />

                        <div className="space-y-8">
                            {[
                                {
                                    step: '01', icon: <Building2 size={20} />, color: 'blue',
                                    title: 'Register Your School',
                                    desc: 'Fill in your school details, upload your MoES license, and choose a unique subdomain. The whole process takes about 5 minutes.'
                                },
                                {
                                    step: '02', icon: <Shield size={20} />, color: 'violet',
                                    title: 'Verification & Approval',
                                    desc: 'Our team reviews your documents within 24 hours. Once approved, your school portal goes live and you receive your admin credentials.'
                                },
                                {
                                    step: '03', icon: <Users size={20} />, color: 'amber',
                                    title: 'Add Staff, Students & Parents',
                                    desc: 'Log into your dashboard and add teachers, enroll students, and link parents. Each person gets their own secure login.'
                                },
                                {
                                    step: '04', icon: <BookOpen size={20} />, color: 'emerald',
                                    title: 'Run Your School Digitally',
                                    desc: 'Mark attendance, issue fees, record grades, send messages to parents — all in one place, from any device.'
                                },
                                {
                                    step: '05', icon: <BarChart3 size={20} />, color: 'indigo',
                                    title: 'Insights & Reports',
                                    desc: 'Generate termly performance reports, fee collection summaries, and attendance analytics with a single click.'
                                },
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    key={item.step}
                                    className="flex gap-5 items-start group"
                                >
                                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-${item.color}-500/20 border border-${item.color}-500/30 text-${item.color}-400 flex items-center justify-center`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 bg-slate-800/60 border border-white/10 rounded-2xl p-6 group-hover:border-white/20 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs font-bold text-${item.color}-400 bg-${item.color}-500/10 px-2 py-0.5 rounded-full`}>Step {item.step}</span>
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-widest">Why EduManage</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">The Smart Choice for Ugandan Schools</h2>
                        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                            There are other systems out there. Here's why hundreds of schools chose EduManage.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: <Lock size={22} />, title: 'Data Privacy First', desc: 'Every school gets an isolated subdomain. Your students\' data is never mixed with another school\'s records.', color: 'blue' },
                            { icon: <Smartphone size={22} />, title: 'Works on Any Device', desc: 'Parents check grades on a smartphone. Teachers mark attendance on a tablet. Everything is fully responsive.', color: 'violet' },
                            { icon: <Zap size={22} />, title: 'Lightning Fast Setup', desc: 'Go from registration to a fully live school portal in under 24 hours — no IT team required.', color: 'amber' },
                            { icon: <BarChart3 size={22} />, title: 'Real-Time Analytics', desc: 'Live dashboards let headteachers track performance, attendance trends, and fee collection instantly.', color: 'emerald' },
                            { icon: <HeartHandshake size={22} />, title: 'Local Support Team', desc: 'We\'re based in Uganda. When you need help, you speak to someone who understands your school context.', color: 'indigo' },
                            { icon: <CheckCircle2 size={22} />, title: 'Affordable Pricing', desc: 'Flexible subscription plans designed for Ugandan school budgets — from small primary schools to large secondaries.', color: 'rose' },
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                key={item.title}
                                className="bg-slate-800/50 border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-all group"
                            >
                                <div className={`w-11 h-11 bg-${item.color}-500/15 text-${item.color}-400 rounded-xl flex items-center justify-center mb-5 border border-${item.color}-500/25 group-hover:scale-110 transition-transform`}>
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
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto px-5 text-center"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to join Uganda's fastest-growing school network?</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Register your school today and get your own secure portal within 24 hours.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-blue-900/40"
                    >
                        <Building2 size={18} /> Register Your School <ArrowRight size={16} />
                    </button>
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
        </div >
    );
}
