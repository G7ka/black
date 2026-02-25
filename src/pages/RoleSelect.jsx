import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Shield, School, Users, BookOpen, BarChart3, ArrowRight, UserSquare2, Heart, Building2 } from 'lucide-react'

const roles = [
    {
        role: 'superadmin',
        title: 'Super Admin',
        desc: 'Platform owner — manage all schools, subscriptions and configuration.',
        icon: Shield,
        gradient: 'from-violet-600 to-purple-700',
        border: 'border-violet-200 hover:border-violet-400 hover:shadow-violet-100',
        features: ['All schools & subscriptions', 'Platform analytics', 'Emergency controls'],
        path: '/superadmin',
    },
    {
        role: 'schooladmin-primary',
        title: 'Primary Admin',
        desc: 'Kampala Primary — manage primary teachers, students, fees and reports.',
        icon: School,
        gradient: 'from-blue-500 to-blue-700',
        border: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
        features: ['P1-P7 oversight', 'Fee collection & reports', 'Teacher tracking'],
        path: '/schooladmin/primary',
    },
    {
        role: 'schooladmin-secondary',
        title: 'Secondary Admin',
        desc: 'Kampala Secondary — manage secondary teachers, students, streams and reports.',
        icon: Building2,
        gradient: 'from-indigo-500 to-indigo-700',
        border: 'border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-100',
        features: ['O-Level & A-Level', 'Advanced subject tracking', 'Stream management'],
        path: '/schooladmin/secondary',
    },
    {
        role: 'teacher',
        title: 'Teacher',
        desc: 'Class teacher — attendance, grades, assignments and student tracking.',
        icon: BookOpen,
        gradient: 'from-emerald-500 to-teal-700',
        border: 'border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100',
        features: ['Mark daily attendance', 'Enter & track grades', 'Create assignments'],
        path: '/teacher',
    },
    {
        role: 'student',
        title: 'Student',
        desc: 'Student portal — grades, schedule, assignments and messages.',
        icon: GraduationCap,
        gradient: 'from-sky-400 to-cyan-600',
        border: 'border-sky-200 hover:border-sky-400 hover:shadow-sky-100',
        features: ["View grades & class rank", "Today's schedule", "Submit assignments"],
        path: '/student',
    },
    {
        role: 'parent',
        title: 'Parent',
        desc: "Parent portal — monitor your child's progress and pay school fees.",
        icon: Heart,
        gradient: 'from-orange-400 to-amber-600',
        border: 'border-orange-200 hover:border-orange-400 hover:shadow-orange-100',
        features: ["Child's grades & attendance", 'Fee payment via MoMo', 'Message teachers'],
        path: '/parent',
    },
]

const stats = [
    { label: 'Schools', value: '247+', icon: School },
    { label: 'Students', value: '68K+', icon: GraduationCap },
    { label: 'Teachers', value: '4,200+', icon: Users },
    { label: 'Districts', value: '40+', icon: BarChart3 },
]

export default function RoleSelect() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex flex-col">
            <header className="px-8 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-blue-900/50">
                    <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                    <p className="text-white font-bold text-lg leading-tight">EduManage</p>
                    <p className="text-primary-400 text-xs tracking-wider font-medium">UGANDA · SCHOOL MANAGEMENT SYSTEM</p>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
                <div className="text-center mb-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-semibold mb-5 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE DEMO — SELECT A ROLE TO EXPLORE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        Uganda's Premier<br />
                        <span className="bg-gradient-to-r from-primary-400 to-blue-300 bg-clip-text text-transparent">School Management</span> Platform
                    </h1>
                    <p className="text-slate-400 text-lg mt-3">Multi-tenant SaaS for Ugandan schools. Click any role to enter that dashboard.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full max-w-7xl">
                    {roles.map(r => (
                        <div key={r.role} onClick={() => navigate(r.path)}
                            className={`group bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${r.border}`}>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-lg mb-3`}>
                                <r.icon size={22} className="text-white" />
                            </div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">{r.title}</h2>
                            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{r.desc}</p>
                            <ul className="space-y-1 mb-4">
                                {r.features.map(f => (
                                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${r.gradient} flex-shrink-0 mt-1`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className={`flex items-center justify-between bg-gradient-to-r ${r.gradient} text-white font-semibold text-xs px-3 py-2 rounded-lg group-hover:shadow-md transition-all`}>
                                <span>Enter</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-6 mt-12 text-center max-w-xl w-full">
                    {stats.map(s => (
                        <div key={s.label} className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"><s.icon size={16} className="text-primary-300" /></div>
                            <p className="text-xl font-bold text-white">{s.value}</p>
                            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="text-center py-4 text-xs text-slate-600 font-medium">
                © 2026 EduManage Uganda · Demo UI · All 5 roles available
            </footer>
        </div>
    )
}
