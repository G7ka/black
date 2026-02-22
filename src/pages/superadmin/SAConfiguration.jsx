import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Save, Key, ToggleLeft, ToggleRight, Shield, Image, Mail } from 'lucide-react'

const features = [
    { key: 'sms', label: 'SMS Notifications', desc: 'Send SMS alerts to parents and teachers', enabled: true },
    { key: 'email', label: 'Email Notifications', desc: 'Send email digests and alerts', enabled: true },
    { key: 'biometric', label: 'Biometric Attendance', desc: 'Enable fingerprint attendance tracking', enabled: false },
    { key: 'momo', label: 'MTN Mobile Money', desc: 'Accept MTN MoMo payments', enabled: true },
    { key: 'airtel', label: 'Airtel Money', desc: 'Accept Airtel Money payments', enabled: true },
    { key: 's3', label: 'AWS S3 Storage', desc: 'Cloud file storage for documents', enabled: true },
    { key: '2fa', label: 'Two-Factor Authentication', desc: 'Enforce 2FA for all admin accounts', enabled: false },
    { key: 'api', label: 'API Access', desc: 'Allow schools to use the REST API', enabled: false },
]

export default function SAConfiguration() {
    const [tab, setTab] = useState('branding')
    const [toggles, setToggles] = useState(() => Object.fromEntries(features.map(f => [f.key, f.enabled])))
    const toggle = k => setToggles(p => ({ ...p, [k]: !p[k] }))

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title">Configuration</h1><p className="page-subtitle">System settings, integrations, and security policies</p></div>

                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-2xl">
                    {['branding', 'features', 'integrations', 'security'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
                    ))}
                </div>

                {tab === 'branding' && (
                    <div className="card space-y-5 max-w-2xl">
                        <h2 className="section-title">Branding & Appearance</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label><input className="input-field" defaultValue="EduManage Uganda" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label><input className="input-field" defaultValue="support@edumanage.ug" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label><div className="flex gap-2"><input type="color" defaultValue="#2563eb" className="w-12 h-9 rounded-lg border border-gray-200 cursor-pointer" /><input className="input-field flex-1" defaultValue="#2563eb" /></div></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Logo</label><div className="flex items-center gap-2"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Image size={16} className="text-blue-500" /></div><button className="btn-secondary text-xs py-1.5">Upload Logo</button></div></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1"><Mail size={14} className="inline mr-1" />Email Footer</label><textarea className="input-field resize-none" rows={3} defaultValue="© 2026 EduManage Uganda. All rights reserved." /></div>
                        <button className="btn-primary"><Save size={14} /> Save Branding</button>
                    </div>
                )}

                {tab === 'features' && (
                    <div className="card max-w-2xl space-y-1">
                        <h2 className="section-title">Feature Toggles</h2>
                        {features.map(f => (
                            <div key={f.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div><p className="text-sm font-medium text-gray-900">{f.label}</p><p className="text-xs text-gray-500">{f.desc}</p></div>
                                <button onClick={() => toggle(f.key)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${toggles[f.key] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {toggles[f.key] ? <><ToggleRight size={14} /> ON</> : <><ToggleLeft size={14} /> OFF</>}
                                </button>
                            </div>
                        ))}
                        <button className="btn-primary mt-4"><Save size={14} /> Save Toggles</button>
                    </div>
                )}

                {tab === 'integrations' && (
                    <div className="card max-w-2xl space-y-5">
                        <h2 className="section-title">Integration Keys</h2>
                        {[
                            { label: "Africa's Talking API Key", placeholder: "AT_xxxxxxxxxxxxxxxx" },
                            { label: "MTN MoMo Primary Key", placeholder: "MTN_xxxxxxxxxxxxxxxx" },
                            { label: "Airtel Money API Key", placeholder: "AIR_xxxxxxxxxxxxxxxx" },
                            { label: "SendGrid API Key", placeholder: "SG.xxxxxxxxxxxxxxxx" },
                            { label: "AWS Access Key ID", placeholder: "AKIA_xxxxxxxxxxxxxxxx" },
                            { label: "AWS Secret Access Key", placeholder: "********************" },
                            { label: "AWS S3 Bucket Name", placeholder: "edumanage-uploads-ug" },
                        ].map(({ label, placeholder }) => (
                            <div key={label}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <div className="flex gap-2"><input className="input-field" placeholder={placeholder} type="password" /><button className="btn-secondary text-xs px-3"><Key size={13} /></button></div>
                            </div>
                        ))}
                        <button className="btn-primary"><Save size={14} /> Save Keys</button>
                    </div>
                )}

                {tab === 'security' && (
                    <div className="card max-w-2xl space-y-5">
                        <h2 className="section-title">Security Policies</h2>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label><input className="input-field" type="number" defaultValue="60" style={{ maxWidth: 180 }} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label><input className="input-field" type="number" defaultValue="5" style={{ maxWidth: 180 }} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">IP Whitelist (one per line)</label><textarea className="input-field resize-none" rows={3} placeholder="Leave blank to allow all IPs" /></div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div><p className="text-sm font-semibold">Enforce 2FA for Admins</p><p className="text-xs text-gray-500">Require two-factor authentication for all platform admins</p></div>
                            <button onClick={() => toggle('2fa')} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${toggles['2fa'] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                {toggles['2fa'] ? <><ToggleRight size={14} /> ON</> : <><ToggleLeft size={14} /> OFF</>}
                            </button>
                        </div>
                        <button className="btn-primary"><Shield size={14} /> Save Security Settings</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
