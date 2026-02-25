import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Users, ArrowRight, PlayCircle, Globe, GraduationCap } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 overflow-hidden font-sans">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-50 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <GraduationCap size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-extrabold text-xl leading-none tracking-tight">EduManage</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-300 hover:text-white font-medium text-sm transition-colors hidden sm:block"
                    >
                        SuperAdmin Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-lg flex items-center gap-2"
                    >
                        Register School <ArrowRight size={16} />
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 px-6">
                {/* Background decorative blobs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -z-10 mix-blend-screen" />
                <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl -z-10 mix-blend-screen" />

                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> The Standard for African Education
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                        One Platform.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-violet-400">
                            Every School in Uganda.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        The ultimate multi-tenant OS for education. Whether you're a parent paying fees, a teacher grading, or a headteacher managing streams — it all happens here.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Building2 size={20} /> Register Your School
                        </button>
                        <button
                            onClick={() => navigate('/demo-hub')}
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm shadow-xl"
                        >
                            <PlayCircle size={20} /> Try Demo Dashboards
                        </button>
                    </div>
                </div>
            </section>

            {/* Features/Explanation Section */}
            <section className="py-20 bg-slate-900 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Feature 1 */}
                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/10 hover:border-primary-500/50 transition-colors">
                            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                                <Globe size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Unique Portals</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Every registered school gets its own branded subdomain (e.g. <code className="text-primary-300 bg-primary-900/50 px-1 rounded">kampala.edumanage.com</code>) shielding its data from others.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/10 hover:border-violet-500/50 transition-colors relative lg:-translate-y-8">
                            <div className="w-14 h-14 bg-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/30">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">SuperAdmin Oversight</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Manage the entire SaaS platform. Approve new school registrations, handle billing, and view overarching national analytics securely.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-colors">
                            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
                                <Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Role-Based Access</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Custom interfaces for Secondary Admins, Primary Admins, Teachers, Students, and Parents — all deeply integrated.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

