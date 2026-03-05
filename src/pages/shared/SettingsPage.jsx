import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Settings, Bell, Globe, Eye, Lock, Monitor, CheckCircle2, Moon, Sun } from 'lucide-react'

export default function SettingsPage({ role = 'student' }) {

    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium')
    const [notifSound, setNotifSound] = useState(true)
    const [notifEmail, setNotifEmail] = useState(true)
    const [notifPush, setNotifPush] = useState(false)
    const [language, setLanguage] = useState('English')
    const [compactView, setCompactView] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    useEffect(() => {
        document.documentElement.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px'
        localStorage.setItem('fontSize', fontSize)
    }, [fontSize])

    const saveAll = () => {
        setSuccessMsg('Settings saved!')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const Toggle = ({ value, onChange }) => (
        <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }} />
        </button>
    )

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative max-w-2xl">

                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div>
                    <h1 className="page-title flex items-center gap-2"><Settings size={22} className="text-blue-500" /> Settings</h1>
                    <p className="page-subtitle">Customize your experience and manage preferences.</p>
                </div>

                {/* Appearance */}
                <div className="card space-y-4">
                    <h2 className="section-title flex items-center gap-2"><Monitor size={16} /> Appearance</h2>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Switch between light and dark interface themes.</p>
                            </div>
                        </div>
                        <Toggle value={darkMode} onChange={setDarkMode} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <Eye size={18} className="text-blue-500" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Font Size</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Adjust the text size across the platform.</p>
                            </div>
                        </div>
                        <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => setFontSize(s)} className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${fontSize === s ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <Monitor size={18} className="text-gray-500 dark:text-slate-400" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Compact View</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Reduce spacing and padding for more content on screen.</p>
                            </div>
                        </div>
                        <Toggle value={compactView} onChange={setCompactView} />
                    </div>
                </div>

                {/* Notifications */}
                <div className="card space-y-4">
                    <h2 className="section-title flex items-center gap-2"><Bell size={16} /> Notifications</h2>

                    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Sound Alerts</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Play a sound when new notifications arrive.</p>
                        </div>
                        <Toggle value={notifSound} onChange={setNotifSound} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Receive important updates via email.</p>
                        </div>
                        <Toggle value={notifEmail} onChange={setNotifEmail} />
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Push Notifications</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Get browser notifications for real-time updates.</p>
                        </div>
                        <Toggle value={notifPush} onChange={setNotifPush} />
                    </div>
                </div>



                {/* Security */}
                <div className="card space-y-4">
                    <h2 className="section-title flex items-center gap-2"><Lock size={16} /> Security</h2>

                    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Update your account password.</p>
                        </div>
                        <button className="btn-secondary text-xs">Change</button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Active Sessions</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">You are currently logged in on 1 device.</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={12} /> 1 Active</span>
                    </div>
                </div>

                <button className="btn-primary w-full" onClick={saveAll}><CheckCircle2 size={15} /> Save All Settings</button>
            </div>
        </DashboardLayout>
    )
}
