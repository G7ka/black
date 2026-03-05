import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Save, Camera, Lock, Eye, EyeOff } from 'lucide-react'

export default function ParentProfile() {
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
    const [saved, setSaved] = useState(false)
    const [pwSaved, setPwSaved] = useState(false)

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="page-subtitle">Update your contact details and account settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar (Editable) */}
                    <div className="card flex flex-col items-center text-center gap-4">
                        <div className="relative cursor-pointer group">
                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Mary Namukasa" className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white group-hover:opacity-90 transition-opacity" />
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-orange-700 transition-colors">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">Mrs. Mary Namukasa</p>
                            <p className="text-sm text-gray-500">Parent / Guardian</p>
                            <p className="text-xs text-gray-400 mt-1">PRT-0239</p>
                        </div>
                        <div className="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left">
                            <div className="flex justify-between"><span className="text-gray-500">Enrolled Children</span><span className="font-medium">2</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-emerald-600">Active</span></div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="card lg:col-span-2 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="section-title mb-0">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Read-only names */}
                            <div><label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">First Name <span className="text-[10px] text-gray-400 font-normal">Read-only</span></label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" defaultValue="Mary" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">Last Name <span className="text-[10px] text-gray-400 font-normal">Read-only</span></label><input disabled className="input-field bg-slate-100 cursor-not-allowed text-slate-500" defaultValue="Namukasa" /></div>

                            {/* Editable contact info */}
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input className="input-field border-orange-200 focus:ring-orange-500" type="email" defaultValue="mary.namukasa@example.com" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input className="input-field border-orange-200 focus:ring-orange-500" defaultValue="+256 700 000000" /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                                <textarea className="input-field max-h-40 border-orange-200 focus:ring-orange-500 resize-none" rows={3} defaultValue="Plot 14, Acacia Avenue, Kampala, Uganda" />
                            </div>
                        </div>
                        <button onClick={() => setSaved(true)} className="btn-primary bg-orange-600 hover:bg-orange-700"><Save size={14} /> {saved ? 'Contact Details Saved ✓' : 'Save Details'}</button>
                    </div>
                </div>

                {/* Password Input */}
                <div className="card max-w-lg">
                    <h2 className="section-title flex items-center gap-2"><Lock size={16} /> Change Password</h2>
                    <div className="space-y-4">
                        {[['Current Password', 'current'], ['New Password', 'new'], ['Confirm New Password', 'confirm']].map(([label, key]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <div className="relative">
                                    <input type={showPw[key] ? 'text' : 'password'} className="input-field border-orange-200 focus:ring-orange-500 pr-10" placeholder="••••••••" />
                                    <button onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setPwSaved(true)} className="btn-primary bg-orange-600 hover:bg-orange-700"><Lock size={14} /> {pwSaved ? 'Password Updated ✓' : 'Update Password'}</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
