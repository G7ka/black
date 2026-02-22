import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Save, Camera, Lock, Eye, EyeOff } from 'lucide-react'

export default function TeacherProfile() {
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
    const [saved, setSaved] = useState(false)
    const [pwSaved, setPwSaved] = useState(false)

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Update your personal information and account settings</p></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar */}
                    <div className="card flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Kenneth Okello" className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white" />
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-700 transition-colors">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div><p className="font-bold text-gray-900 text-lg">Mr. Kenneth Okello</p><p className="text-sm text-gray-500">Mathematics Teacher</p><p className="text-xs text-gray-400 mt-1">TCH-001 · Kampala Primary School</p></div>
                        <div className="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left">
                            <div className="flex justify-between"><span className="text-gray-500">Classes</span><span className="font-medium">P6A, P7B</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Students</span><span className="font-medium">78</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="font-medium">Jan 2024</span></div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="card lg:col-span-2 space-y-5">
                        <h2 className="section-title">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input className="input-field" defaultValue="Kenneth" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input className="input-field" defaultValue="Okello" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input className="input-field" type="email" defaultValue="k.okello@kps.ug" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input className="input-field" defaultValue="+256 779 123456" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Main Subject</label>
                                <select className="select-field"><option>Mathematics</option><option>English</option><option>Science</option></select>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">National ID</label><input className="input-field" defaultValue="CM8765432" /></div>
                            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Bio / Teaching Philosophy</label>
                                <textarea className="input-field resize-none" rows={3} defaultValue="Passionate Mathematics educator with 8 years experience in primary education. Focused on making math fun and accessible for Ugandan learners." />
                            </div>
                        </div>
                        <button onClick={() => setSaved(true)} className="btn-primary"><Save size={14} /> {saved ? 'Changes Saved ✓' : 'Save Changes'}</button>
                    </div>
                </div>

                {/* Password */}
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
