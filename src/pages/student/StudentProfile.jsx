import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function StudentProfile() {
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
    const [pwSaved, setPwSaved] = useState(false)

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="page-subtitle">View your personal information and update your password</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar */}
                    <div className="card flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="Ivan Namukasa" className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">Ivan Namukasa</p>
                            <p className="text-sm text-gray-500">Student</p>
                            <p className="text-xs text-gray-400 mt-1">STU-P-001 · Kampala Primary School</p>
                        </div>
                        <div className="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left">
                            <div className="flex justify-between"><span className="text-gray-500">Class</span><span className="font-medium">P6A</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Enrolled</span><span className="font-medium">Feb 2021</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-emerald-600">Active</span></div>
                        </div>
                        <p className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded-lg border border-orange-100">
                            Profile photos and personal details are managed by the school administrator.
                        </p>
                    </div>

                    {/* Personal Info (Read Only) */}
                    <div className="card lg:col-span-2 space-y-5">
                        <h2 className="section-title">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" value="Ivan" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" value="Namukasa" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" value="2012-05-14" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" value="Male" /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" value="Plot 14, Acacia Avenue, Kampala" /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Primary Guardian</label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" value="Mrs. Mary Namukasa (+256 700 000000)" /></div>
                        </div>
                    </div>
                </div>

                {/* Password Update Input */}
                <div className="card max-w-lg">
                    <h2 className="section-title flex items-center gap-2"><Lock size={16} /> Change Password</h2>
                    <div className="space-y-4">
                        {[['Current Password', 'current'], ['New Password', 'new'], ['Confirm New Password', 'confirm']].map(([label, key]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <div className="relative">
                                    <input type={showPw[key] ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••" />
                                    <button onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                            Password must be at least 8 characters, include a number and a symbol.
                        </div>
                        <button onClick={() => setPwSaved(true)} className="btn-primary"><Lock size={14} /> {pwSaved ? 'Password Updated ✓' : 'Update Password'}</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
