import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubdomain } from '../../utils/tenant';
import { GraduationCap, Mail, Lock, ArrowRight, School, User, BookOpen, Heart } from 'lucide-react';

export default function TenantLogin() {
    const navigate = useNavigate();
    const subdomain = getSubdomain() || 'unknown';
    const schoolName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1) + ' High School';

    const [role, setRole] = useState('student');

    const handleLogin = (e) => {
        e.preventDefault();
        // Route to proper dashboard based on selected mock role
        if (role === 'admin') navigate('/schooladmin/secondary');
        else if (role === 'teacher') navigate('/teacher');
        else if (role === 'parent') navigate('/parent');
        else navigate('/student');
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">

                <div className="absolute top-8 left-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-800 tracking-tight">EduManage</span>
                </div>

                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">{schoolName}</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Account Type</label>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {[
                                        { id: 'admin', icon: School, label: 'Admin' },
                                        { id: 'teacher', icon: BookOpen, label: 'Staff' },
                                        { id: 'student', icon: User, label: 'Student' },
                                        { id: 'parent', icon: Heart, label: 'Parent' }
                                    ].map(r => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id)}
                                            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all ${role === r.id
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                                                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <r.icon size={18} />
                                            <span className="text-[10px] font-semibold tracking-wide uppercase">{r.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    {role === 'student' ? 'Student ID or Email' : 'Email Address'}
                                </label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white sm:text-sm"
                                        placeholder={role === 'student' ? 'STU-2026-001' : `yourname@${subdomain}.edu.ug`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                        Remember for 30 days
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                                >
                                    Sign in <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right side - Branding/Image */}
            <div className="hidden lg:block relative w-0 flex-1 bg-slate-900">
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="School Building"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Secure Connection
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Empowering education<br />for tomorrow's leaders.
                    </h1>
                    <p className="text-lg text-slate-300 max-w-xl">
                        Log in to access your grades, schedule, and school resources through the {schoolName} secure portal.
                    </p>
                </div>
            </div>
        </div>
    );
}

