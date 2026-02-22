import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Save, Camera, Eye, EyeOff, Lock } from 'lucide-react'

export default function StudentProfile() {
    const [showPw, setShowPw] = useState(false)
    const [saved, setSaved] = useState(false)

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div><h1 className="page-title">My Profile</h1><p className="page-subtitle">View and update your personal information</p></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">I</div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-700 transition-colors"><Camera size={14} /></button>
                        </div>
                        <div><p className="font-bold text-gray-900 text-lg">Ivan Namukasa</p><p className="text-sm text-gray-500">Class P6A</p><p className="text-xs text-gray-400 mt-1">STU-001 · Age 12</p></div>
                        <div className="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left">
                            <div className="flex justify-between"><span className="text-gray-500">School</span><span className="font-medium text-xs">Kampala Primary</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Class</span><span className="font-medium">P6A</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Parent</span><span className="font-medium text-xs">Mary Namukasa</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Term</span><span className="font-medium">Term 1, 2026</span></div>
                        </div>
                    </div>

                    <div className="card lg:col-span-2 space-y-5">
                        <h2 className="section-title">Personal Information</h2>
                        <p className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-xl p-3">Some fields are managed by your school administrator and cannot be changed.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input className="input-field" defaultValue="Ivan" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input className="input-field bg-gray-50" defaultValue="Namukasa" disabled /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" className="input-field bg-gray-50" defaultValue="2013-03-15" disabled /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Class</label><input className="input-field bg-gray-50" defaultValue="P6A" disabled /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email (for notifications)</label><input type="email" className="input-field" placeholder="your.email@example.com" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label><input className="input-field" placeholder="+256 700 000000" /></div>
                        </div>
                        <button onClick={() => setSaved(true)} className="btn-primary"><Save size={14} /> {saved ? 'Saved ✓' : 'Save Changes'}</button>
                    </div>
                </div>

                <div className="card max-w-lg">
                    <h2 className="section-title flex items-center gap-2"><Lock size={16} /> Change Password</h2>
                    <div className="space-y-4">
                        {[['Current Password'], ['New Password'], ['Confirm New Password']].map(([label]) => (
                            <div key={label}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••" />
                                    <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                            </div>
                        ))}
                        <button className="btn-primary"><Lock size={14} /> Update Password</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
