import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Users, ArrowRight, PlayCircle, Globe, GraduationCap, Menu, X } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden font-sans scroll-smooth">
            {/* Header */}
            <header className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4 sticky top-0 bg-slate-900/80 backdrop-blur-md z-50 border-b border-white/10">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <GraduationCap size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-extrabold text-xl leading-none tracking-tight">EduManage</p>
                    </div>
                </div>

                {/* Navigation links (desktop) */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#why-choose-us" className="hover:text-white transition-colors">
                        Why choose us
                    </a>
                    <a href="#about-us" className="hover:text-white transition-colors">
                        About us
                    </a>
                    <a href="#features" className="hover:text-white transition-colors">
                        Features
                    </a>
                </nav>

                {/* Auth / CTA buttons & mobile toggle */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-colors hidden sm:block"
                    >
                        SuperAdmin Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg transition-all shadow-lg flex items-center gap-2"
                    >
                        Register School <ArrowRight size={16} />
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-slate-200 hover:bg-white/10 md:hidden"
                        onClick={() => setIsMobileNavOpen((prev) => !prev)}
                        aria-label="Toggle navigation"
                        aria-expanded={isMobileNavOpen}
                    >
                        {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </header>

            {/* Mobile navigation drawer */}
            {isMobileNavOpen && (
                <div className="md:hidden bg-slate-950/95 border-b border-white/10 px-4 pb-4 pt-2 space-y-2">
                    <nav className="flex flex-col gap-2 text-sm font-medium text-slate-200">
                        <a
                            href="#why-choose-us"
                            className="py-2 rounded-lg px-2 hover:bg-white/5"
                            onClick={() => setIsMobileNavOpen(false)}
                        >
                            Why choose us
                        </a>
                        <a
                            href="#about-us"
                            className="py-2 rounded-lg px-2 hover:bg-white/5"
                            onClick={() => setIsMobileNavOpen(false)}
                        >
                            About us
                        </a>
                        <a
                            href="#features"
                            className="py-2 rounded-lg px-2 hover:bg-white/5"
                            onClick={() => setIsMobileNavOpen(false)}
                        >
                            Features
                        </a>
                    </nav>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-20 md:pt-24 pb-24 md:pb-32 px-4 md:px-6">
                {/* Background decorative blobs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -z-10 mix-blend-screen" />
                <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl -z-10 mix-blend-screen" />

                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> The Standard for African Education
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 sm:mb-8 leading-tight">
                        One Platform.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-violet-400">
                            Every School in Uganda.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
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

            {/* Why Choose Us Section */}
            <section id="why-choose-us" className="py-20 bg-slate-900 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why choose us</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae lectus at neque
                            feugiat faucibus. Sed dictum, ipsum et placerat vehicula, nibh nisi pulvinar urna, sed
                            cursus nulla dolor at nisl.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features/Explanation Section */}
            <section id="features" className="py-20 bg-slate-900 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Features</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer hendrerit elit at turpis
                            tincidunt, vitae interdum erat porta.
                        </p>
                    </div>
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

            {/* About Us Section */}
            <section id="about-us" className="py-20 bg-slate-950 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About us</h2>
                        <p className="text-slate-400 mb-4 text-sm md:text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris porta, massa at dapibus
                            faucibus, tortor augue ullamcorper ante, at condimentum lacus sem vel sapien. Nunc
                            scelerisque justo vitae lacus efficitur, non euismod nisl fermentum.
                        </p>
                        <p className="text-slate-400 text-sm md:text-base">
                            Curabitur suscipit, enim id fermentum tempus, nibh justo volutpat mi, non tristique ex
                            lectus ac nibh. Suspendisse potenti. Duis dignissim hendrerit consequat. Integer luctus
                            tellus eu nisl rhoncus, vitae lacinia ipsum tempor.
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8">
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis sem pretium,
                            facilisis nulla vitae, condimentum dolor. Aenean placerat, urna id ullamcorper hendrerit,
                            felis risus fermentum lorem, eget faucibus justo lectus id urna.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <section id="footer" className="py-20 bg-slate-950 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                            <div>
                                <p className="text-slate-400 mb-4 text-sm md:text-base">
                                    &copy; {new Date().getFullYear()} EduManage. All rights reserved. <br />
                                    Empowering schools, teachers, students, and parents through seamless digital management and analytics.
                                </p>
                                <p className="text-slate-400 text-sm md:text-base">
                                    Built with ♥ for African education. Have questions? <a href="mailto:support@edumanage.com" className="underline hover:text-emerald-400">Contact us</a>.
                                </p>
                            </div>
                            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8">
                                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                    Follow us: &nbsp;
                                    <a href="https://twitter.com/" className="hover:text-emerald-400 underline" target="_blank" rel="noopener noreferrer">Twitter</a>
                                    &nbsp;|&nbsp;
                                    <a href="https://facebook.com/" className="hover:text-emerald-400 underline" target="_blank" rel="noopener noreferrer">Facebook</a>
                                    &nbsp;|&nbsp;
                                    <a href="https://linkedin.com/" className="hover:text-emerald-400 underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </p>
                        </div>
                </div>
            </section>
        </div>
    );
}

