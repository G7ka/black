import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Settings, BookOpen, Plus, Save, Image, Clock, Bell, CheckCircle2, Trash2, DollarSign, Users, AlertCircle, School } from 'lucide-react'
import { classesApi } from '../../api/classes.api'
import { schoolConfigApi } from '../../api/schoolOps.api'

export default function SchoolAdminConfiguration({ role = 'schooladmin-primary' }) {
    const [tab, setTab] = useState('subjects')
    const [subjects, setSubjects] = useState([])
    const [newSubject, setNewSubject] = useState('')

    const [schoolName, setSchoolName] = useState('')
    const [schoolMotto, setSchoolMotto] = useState('')
    const [schoolEmail, setSchoolEmail] = useState('')
    const [schoolPhone, setSchoolPhone] = useState('')
    const [termStart, setTermStart] = useState('')
    const [termEnd, setTermEnd] = useState('')
    const [currentTerm, setCurrentTerm] = useState('Term 1')
    const [smsNotif, setSmsNotif] = useState(true)
    const [emailNotif, setEmailNotif] = useState(true)
    const [attendanceAlert, setAttendanceAlert] = useState(true)
    const [feeReminder, setFeeReminder] = useState(true)

    const [billing, setBilling] = useState(null)

    const [successMsg, setSuccessMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [saveError, setSaveError] = useState('')
    const [saving, setSaving] = useState(false)

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            const [subjectsResult, configResult, billingResult] = await Promise.all([
                classesApi.listSubjects(),
                schoolConfigApi.get(),
                schoolConfigApi.getBilling(),
            ])
            setSubjects(subjectsResult)
            setSchoolName(configResult.name || '')
            setSchoolMotto(configResult.motto || '')
            setSchoolEmail(configResult.contactEmail || '')
            setSchoolPhone(configResult.contactPhone || '')
            setCurrentTerm(configResult.currentTerm || 'Term 1')
            setTermStart(configResult.termStart ? configResult.termStart.slice(0, 10) : '')
            setTermEnd(configResult.termEnd ? configResult.termEnd.slice(0, 10) : '')
            setSmsNotif(configResult.notificationSettings.smsNotif)
            setEmailNotif(configResult.notificationSettings.emailNotif)
            setAttendanceAlert(configResult.notificationSettings.attendanceAlert)
            setFeeReminder(configResult.notificationSettings.feeReminder)
            setBilling(billingResult)
        } catch (err) {
            setLoadError(err.message || 'Failed to load configuration')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

    const addSubject = async () => {
        if (!newSubject.trim()) return
        setSaveError('')
        try {
            await classesApi.addSubject(newSubject.trim())
            setNewSubject('')
            setSubjects(await classesApi.listSubjects())
            flash('Subject added.')
        } catch (err) { setSaveError(err.message || 'Failed to add subject') }
    }

    const removeSubject = async (s) => {
        if (!window.confirm(`Remove "${s.name}" from the subject list?`)) return
        setSaveError('')
        try {
            await classesApi.removeSubject(s.id)
            setSubjects(await classesApi.listSubjects())
        } catch (err) { setSaveError(err.message || 'Failed to remove subject') }
    }

    const saveSchoolInfo = async () => {
        setSaving(true); setSaveError('')
        try {
            await schoolConfigApi.updateInfo({ name: schoolName, motto: schoolMotto, contactEmail: schoolEmail, contactPhone: schoolPhone })
            flash('School info saved successfully!')
        } catch (err) { setSaveError(err.message || 'Failed to save school info') } finally { setSaving(false) }
    }

    const saveTerms = async () => {
        setSaving(true); setSaveError('')
        try {
            await schoolConfigApi.updateTerms({ currentTerm, termStart: termStart || undefined, termEnd: termEnd || undefined })
            flash('Term settings saved successfully!')
        } catch (err) { setSaveError(err.message || 'Failed to save terms') } finally { setSaving(false) }
    }

    const saveNotifications = async () => {
        setSaving(true); setSaveError('')
        try {
            await schoolConfigApi.updateNotifications({ smsNotif, emailNotif, attendanceAlert, feeReminder })
            flash('Notification settings saved successfully!')
        } catch (err) { setSaveError(err.message || 'Failed to save notification settings') } finally { setSaving(false) }
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative">
                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-500" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><Settings size={22} className="text-blue-500" /> School Configuration</h1>
                        <p className="page-subtitle">Manage subjects, school details, terms, and notification preferences.</p>
                    </div>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                <div className="flex gap-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl p-1 max-w-xl">
                    {['subjects', 'school info', 'terms', 'notifications', 'billing'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-colors ${tab === t ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>{t}</button>
                    ))}
                </div>

                {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
                    <>
                        {tab === 'subjects' && (
                            <div className="card max-w-2xl space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="section-title flex items-center gap-2 mb-0"><BookOpen size={16} /> Manage Subjects</h2>
                                    <span className="text-xs text-gray-400 dark:text-slate-500">{subjects.length} subjects</span>
                                </div>
                                {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                                <div className="flex gap-2">
                                    <input className="input-field flex-1" placeholder="Enter a new subject name…" value={newSubject} onChange={e => setNewSubject(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubject()} />
                                    <button className="btn-primary" onClick={addSubject} disabled={!newSubject.trim()}><Plus size={14} /> Add</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {subjects.map(s => (
                                        <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                            <div className="flex items-center gap-2"><BookOpen size={14} className="text-blue-500" /><span className="text-sm font-medium text-gray-800 dark:text-slate-200">{s.name}</span></div>
                                            <button onClick={() => removeSubject(s)} className="p-1 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    {subjects.length === 0 && <p className="text-sm text-gray-400 col-span-2">No subjects yet — add your first one above.</p>}
                                </div>
                            </div>
                        )}

                        {tab === 'school info' && (
                            <div className="card max-w-2xl space-y-5">
                                <h2 className="section-title flex items-center gap-2"><School size={16} /> School Information</h2>
                                {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">School Name</label><input className="input-field" value={schoolName} onChange={e => setSchoolName(e.target.value)} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Motto</label><input className="input-field" value={schoolMotto} onChange={e => setSchoolMotto(e.target.value)} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label><input className="input-field" value={schoolEmail} onChange={e => setSchoolEmail(e.target.value)} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone</label><input className="input-field" value={schoolPhone} onChange={e => setSchoolPhone(e.target.value)} /></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">School Logo</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border border-blue-200 dark:border-blue-800/50"><Image size={22} className="text-blue-500 dark:text-blue-400" /></div>
                                        <button className="btn-secondary text-xs" disabled title="Not wired up yet">Upload Logo</button>
                                    </div>
                                </div>
                                <button disabled={saving} className="btn-primary" onClick={saveSchoolInfo}><Save size={14} /> {saving ? 'Saving…' : 'Save School Info'}</button>
                            </div>
                        )}

                        {tab === 'terms' && (
                            <div className="card max-w-2xl space-y-5">
                                <h2 className="section-title flex items-center gap-2"><Clock size={16} /> Academic Terms</h2>
                                {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Current Term</label>
                                        <select className="select-field" value={currentTerm} onChange={e => setCurrentTerm(e.target.value)}><option>Term 1</option><option>Term 2</option><option>Term 3</option></select>
                                    </div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Term Start</label><input type="date" className="input-field" value={termStart} onChange={e => setTermStart(e.target.value)} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Term End</label><input type="date" className="input-field" value={termEnd} onChange={e => setTermEnd(e.target.value)} /></div>
                                </div>
                                <button disabled={saving} className="btn-primary" onClick={saveTerms}><Save size={14} /> {saving ? 'Saving…' : 'Save Term Settings'}</button>
                            </div>
                        )}

                        {tab === 'notifications' && (
                            <div className="card max-w-2xl space-y-4">
                                <h2 className="section-title flex items-center gap-2"><Bell size={16} /> Notification Preferences</h2>
                                {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                                {[
                                    { label: 'SMS Notifications', desc: 'Send SMS alerts to parents for fees, attendance, and grades. (Currently delivered by email — no SMS gateway connected yet.)', value: smsNotif, set: setSmsNotif },
                                    { label: 'Email Notifications', desc: 'Send email digests to parents and staff.', value: emailNotif, set: setEmailNotif },
                                    { label: 'Low Attendance Alerts', desc: "Alert parents if their child's attendance drops below 80%.", value: attendanceAlert, set: setAttendanceAlert },
                                    { label: 'Fee Reminders', desc: 'Automatically send reminders to parents with outstanding balances.', value: feeReminder, set: setFeeReminder },
                                ].map(n => (
                                    <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700 last:border-0">
                                        <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{n.label}</p><p className="text-xs text-gray-500 dark:text-slate-400">{n.desc}</p></div>
                                        <button onClick={() => n.set(!n.value)} className={`relative w-11 h-6 rounded-full transition-colors ${n.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
                                            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: n.value ? 'translateX(22px)' : 'translateX(2px)' }} />
                                        </button>
                                    </div>
                                ))}
                                <button disabled={saving} className="btn-primary mt-2" onClick={saveNotifications}><Save size={14} /> {saving ? 'Saving…' : 'Save Notification Settings'}</button>
                            </div>
                        )}

                        {tab === 'billing' && billing && (
                            <div className="card max-w-2xl space-y-5">
                                <h2 className="section-title flex items-center gap-2"><DollarSign size={16} /> Monthly Billing</h2>
                                <p className="text-xs text-gray-400 -mt-3">This is your school's own EduManage subscription — separate from the parent fee ledger.</p>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5 space-y-3">
                                    <div className="flex items-center justify-between text-sm"><span className="text-gray-600 dark:text-slate-300 flex items-center gap-2"><Users size={14} className="text-blue-500 dark:text-blue-400" /> Enrolled Students (declared)</span><span className="text-lg font-extrabold text-gray-900 dark:text-white">{billing.enrolledStudents}</span></div>
                                    <div className="flex items-center justify-between text-sm"><span className="text-gray-600 dark:text-slate-300">Rate Per Student / Month</span><span className="font-semibold text-gray-700 dark:text-slate-200">UGX {billing.pricePerStudent.toLocaleString()}</span></div>
                                    {billing.invoice && (
                                        <div className="flex items-center justify-between text-sm border-t border-blue-200 dark:border-slate-700 pt-3 mt-2">
                                            <span className="font-bold text-gray-800 dark:text-slate-200">This Month's Bill ({billing.currentPeriod})</span>
                                            <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400">UGX {billing.invoice.amount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                {billing.invoice ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`rounded-xl p-4 border ${billing.invoice.status === 'PAID' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50'}`}>
                                            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${billing.invoice.status === 'PAID' ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>Payment Status</p>
                                            <p className={`text-lg font-bold ${billing.invoice.status === 'PAID' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>{billing.invoice.status}</p>
                                            {billing.invoice.paidAt && <p className="text-xs text-emerald-500 dark:text-emerald-300 mt-1">Paid: {new Date(billing.invoice.paidAt).toLocaleDateString()}</p>}
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">Due Date</p>
                                            <p className="text-lg font-bold text-gray-800 dark:text-white">{new Date(billing.invoice.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No invoice generated yet for this billing period.</p>
                                )}

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-400 flex gap-3 items-start">
                                    <Bell size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p>If you notice discrepancies in your student count, contact the platform administrator via Platform Support.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
