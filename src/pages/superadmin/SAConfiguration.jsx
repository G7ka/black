import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Save, Key, ToggleLeft, ToggleRight, Shield, Image, Mail, Moon, Sun } from 'lucide-react'
import { configurationApi } from '../../api/configuration.api'

const FEATURE_LABELS = [
    { key: 'sms', label: 'SMS Notifications', desc: 'Send SMS alerts to parents and teachers' },
    { key: 'email', label: 'Email Notifications', desc: 'Send email digests and alerts' },
    { key: 'biometric', label: 'Biometric Attendance', desc: 'Enable fingerprint attendance tracking' },
    { key: 'momo', label: 'MTN Mobile Money', desc: 'Accept MTN MoMo payments' },
    { key: 'airtel', label: 'Airtel Money', desc: 'Accept Airtel Money payments' },
    { key: 's3', label: 'AWS S3 Storage', desc: 'Cloud file storage for documents' },
    { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Enforce 2FA for all admin accounts' },
    { key: 'api', label: 'API Access', desc: 'Allow schools to use the REST API' },
]

const INTEGRATION_FIELDS = [
    { key: 'africasTalkingApiKey', label: "Africa's Talking API Key", placeholder: 'AT_xxxxxxxxxxxxxxxx' },
    { key: 'mtnMomoPrimaryKey', label: 'MTN MoMo Primary Key', placeholder: 'MTN_xxxxxxxxxxxxxxxx' },
    { key: 'airtelMoneyApiKey', label: 'Airtel Money API Key', placeholder: 'AIR_xxxxxxxxxxxxxxxx' },
    { key: 'sendgridApiKey', label: 'SendGrid API Key', placeholder: 'SG.xxxxxxxxxxxxxxxx' },
    { key: 'awsAccessKeyId', label: 'AWS Access Key ID', placeholder: 'AKIA_xxxxxxxxxxxxxxxx' },
    { key: 'awsSecretAccessKey', label: 'AWS Secret Access Key', placeholder: '********************' },
    { key: 'awsS3BucketName', label: 'AWS S3 Bucket Name', placeholder: 'edumanage-uploads-ug' },
]

export default function SAConfiguration() {
    const [tab, setTab] = useState('branding')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [appearance, setAppearance] = useState({ darkMode: false })
    const [branding, setBranding] = useState({ platformName: '', supportEmail: '', primaryColor: '#2563eb', emailFooter: '' })
    const [features, setFeatures] = useState({})
    const [security, setSecurity] = useState({ sessionTimeoutMinutes: 60, maxLoginAttempts: 5, ipWhitelist: [], enforce2faForAdmins: false })
    const [integrations, setIntegrations] = useState({})
    const [integrationDraft, setIntegrationDraft] = useState({})

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const data = await configurationApi.get()
            setAppearance(data.appearance)
            setBranding(data.branding)
            setFeatures(data.features)
            setSecurity(data.security)
            setIntegrations(data.integrations)
        } catch (err) {
            setError(err.message || 'Failed to load configuration')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    useEffect(() => {
        if (appearance.darkMode) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
    }, [appearance.darkMode])

    const toggleFeature = (k) => setFeatures(p => ({ ...p, [k]: !p[k] }))

    const save = async (fn, successMsg) => {
        setSaving(true)
        setError('')
        try {
            await fn()
        } catch (err) {
            setError(err.message || 'Save failed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <DashboardLayout role="superadmin"><p className="text-sm text-gray-400">Loading configuration…</p></DashboardLayout>
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title">Configuration</h1><p className="page-subtitle">System settings, integrations, and security policies</p></div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 max-w-2xl">
                    {['appearance', 'branding', 'features', 'integrations', 'security'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>{t}</button>
                    ))}
                </div>

                {tab === 'appearance' && (
                    <div className="card space-y-5 max-w-2xl">
                        <h2 className="section-title">Appearance Settings</h2>
                        <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                {appearance.darkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">Switch between light and dark interface themes across the platform.</p>
                                </div>
                            </div>
                            <button onClick={() => {
                                const next = { darkMode: !appearance.darkMode }
                                setAppearance(next)
                                save(() => configurationApi.updateAppearance(next))
                            }} className={`relative w-11 h-6 rounded-full transition-colors ${appearance.darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
                                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: appearance.darkMode ? 'translateX(22px)' : 'translateX(2px)' }} />
                            </button>
                        </div>
                    </div>
                )}

                {tab === 'branding' && (
                    <div className="card space-y-5 max-w-2xl">
                        <h2 className="section-title">Branding & Appearance</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Platform Name</label><input className="input-field" value={branding.platformName} onChange={e => setBranding(b => ({ ...b, platformName: e.target.value }))} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Support Email</label><input className="input-field" value={branding.supportEmail} onChange={e => setBranding(b => ({ ...b, supportEmail: e.target.value }))} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Primary Color</label><div className="flex gap-2"><input type="color" value={branding.primaryColor} onChange={e => setBranding(b => ({ ...b, primaryColor: e.target.value }))} className="w-12 h-9 rounded-lg border border-gray-200 dark:border-slate-700 cursor-pointer" /><input className="input-field flex-1" value={branding.primaryColor} onChange={e => setBranding(b => ({ ...b, primaryColor: e.target.value }))} /></div></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Logo</label><div className="flex items-center gap-2"><div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-slate-700 flex items-center justify-center"><Image size={16} className="text-blue-500 dark:text-blue-400" /></div><button className="btn-secondary text-xs py-1.5" disabled title="Logo upload lands with document storage in a later phase">Upload Logo</button></div></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"><Mail size={14} className="inline mr-1" />Email Footer</label><textarea className="input-field resize-none" rows={3} value={branding.emailFooter} onChange={e => setBranding(b => ({ ...b, emailFooter: e.target.value }))} /></div>
                        <button disabled={saving} className="btn-primary" onClick={() => save(() => configurationApi.updateBranding(branding))}><Save size={14} /> {saving ? 'Saving…' : 'Save Branding'}</button>
                    </div>
                )}

                {tab === 'features' && (
                    <div className="card max-w-2xl space-y-1">
                        <h2 className="section-title">Feature Toggles</h2>
                        {FEATURE_LABELS.map(f => (
                            <div key={f.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700 last:border-0">
                                <div><p className="text-sm font-medium text-gray-900 dark:text-white">{f.label}</p><p className="text-xs text-gray-500 dark:text-slate-400">{f.desc}</p></div>
                                <button onClick={() => toggleFeature(f.key)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${features[f.key] ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                                    {features[f.key] ? <><ToggleRight size={14} /> ON</> : <><ToggleLeft size={14} /> OFF</>}
                                </button>
                            </div>
                        ))}
                        <button disabled={saving} className="btn-primary mt-4" onClick={() => save(() => configurationApi.updateFeatures(features))}><Save size={14} /> {saving ? 'Saving…' : 'Save Toggles'}</button>
                    </div>
                )}

                {tab === 'integrations' && (
                    <div className="card max-w-2xl space-y-5">
                        <h2 className="section-title">Integration Keys</h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 -mt-3">Existing keys are shown masked. Enter a new value only to replace it.</p>
                        {INTEGRATION_FIELDS.map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
                                <div className="flex gap-2">
                                    <input
                                        className="input-field"
                                        placeholder={integrations[key] || placeholder}
                                        type="password"
                                        value={integrationDraft[key] || ''}
                                        onChange={e => setIntegrationDraft(d => ({ ...d, [key]: e.target.value }))}
                                    />
                                    <button className="btn-secondary text-xs px-3"><Key size={13} /></button>
                                </div>
                            </div>
                        ))}
                        <button disabled={saving} className="btn-primary" onClick={() => save(async () => {
                            const result = await configurationApi.updateIntegrations(integrationDraft)
                            setIntegrations(result)
                            setIntegrationDraft({})
                        })}><Save size={14} /> {saving ? 'Saving…' : 'Save Keys'}</button>
                    </div>
                )}

                {tab === 'security' && (
                    <div className="card max-w-2xl space-y-5">
                        <h2 className="section-title">Security Policies</h2>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Session Timeout (minutes)</label><input className="input-field" type="number" value={security.sessionTimeoutMinutes} onChange={e => setSecurity(s => ({ ...s, sessionTimeoutMinutes: Number(e.target.value) }))} style={{ maxWidth: 180 }} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Max Login Attempts</label><input className="input-field" type="number" value={security.maxLoginAttempts} onChange={e => setSecurity(s => ({ ...s, maxLoginAttempts: Number(e.target.value) }))} style={{ maxWidth: 180 }} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">IP Whitelist (one per line)</label><textarea className="input-field resize-none" rows={3} placeholder="Leave blank to allow all IPs" value={(security.ipWhitelist || []).join('\n')} onChange={e => setSecurity(s => ({ ...s, ipWhitelist: e.target.value.split('\n').filter(Boolean) }))} /></div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-700">
                            <div><p className="text-sm font-semibold dark:text-white">Enforce 2FA for Admins</p><p className="text-xs text-gray-500 dark:text-slate-400">Require two-factor authentication for all platform admins</p></div>
                            <button onClick={() => setSecurity(s => ({ ...s, enforce2faForAdmins: !s.enforce2faForAdmins }))} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${security.enforce2faForAdmins ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                                {security.enforce2faForAdmins ? <><ToggleRight size={14} /> ON</> : <><ToggleLeft size={14} /> OFF</>}
                            </button>
                        </div>
                        <button disabled={saving} className="btn-primary" onClick={() => save(() => configurationApi.updateSecurity(security))}><Shield size={14} /> {saving ? 'Saving…' : 'Save Security Settings'}</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
