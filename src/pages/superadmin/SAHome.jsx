import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import { DoughnutChart } from '../../components/charts/Charts'
import {
    Building2, Users, DollarSign, GraduationCap, CheckCircle, Clock,
    BookOpen, Book, Send, MessageSquare, AlertCircle
} from 'lucide-react'
import { analyticsApi, notificationsApi } from '../../api/platformOps.api'
import { schoolsAdminApi } from '../../api/schoolsAdmin.api'

const DISTRICT_COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#e0e7ff']

export default function SAHome() {
    const [overview, setOverview] = useState(null)
    const [schools, setSchools] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const [msgModal, setMsgModal] = useState(false)
    const [msgSchool, setMsgSchool] = useState('')
    const [msgType, setMsgType] = useState('info')
    const [msgText, setMsgText] = useState('')
    const [toast, setToast] = useState(null)
    const [sending, setSending] = useState(false)
    const [sendError, setSendError] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const [overviewResult, schoolsResult] = await Promise.all([
                analyticsApi.overview(),
                schoolsAdminApi.list({ status: 'active', pageSize: 100 }),
            ])
            setOverview(overviewResult)
            setSchools(schoolsResult.schools)
        } catch (err) {
            setLoadError(err.message || 'Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const sendMsg = async () => {
        if (!msgSchool || !msgText) return
        setSending(true)
        setSendError('')
        try {
            const result = await notificationsApi.sendToSchool(msgSchool, msgType, msgText)
            setToast(`Message sent to ${result.sentTo} school(s)`)
            setTimeout(() => setToast(null), 3000)
            setMsgModal(false); setMsgSchool(''); setMsgText(''); setMsgType('info')
        } catch (err) {
            setSendError(err.message || 'Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const districtData = overview ? {
        labels: overview.schoolsByDistrict.map(d => d.district),
        datasets: [{ data: overview.schoolsByDistrict.map(d => d.count), backgroundColor: DISTRICT_COLORS, borderWidth: 0 }],
    } : null

    if (loading) {
        return <DashboardLayout role="superadmin"><p className="text-sm text-gray-400">Loading platform overview…</p></DashboardLayout>
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="page-title">Platform Overview</h1>
                    <p className="page-subtitle">Welcome back! Here's your platform summary for today.</p>
                </div>

                {loadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {loadError}
                    </div>
                )}

                {overview && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Schools" value={String(overview.totalSchools)} subtitle={`${overview.pendingApplications} pending approval`} icon={Building2} color="blue" />
                            <StatCard title="Declared Students" value={overview.declaredStudents.toLocaleString()} subtitle="Self-reported at registration" icon={GraduationCap} color="green" />
                            <StatCard title="Monthly Revenue" value={`UGX ${overview.monthlyRevenue.toLocaleString()}`} subtitle={`@ UGX ${overview.pricePerStudent.toLocaleString()}/student`} icon={DollarSign} color="purple" />
                            <StatCard title="Active Schools" value={String(overview.activeSchools)} subtitle={`${overview.suspendedSchools} suspended`} icon={CheckCircle} color="amber" />
                        </div>

                        {/* Secondary stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatCard title="Primary Schools" value={String(overview.primarySchools)} icon={BookOpen} color="blue" />
                            <StatCard title="Secondary Schools" value={String(overview.secondarySchools)} icon={Book} color="indigo" />
                            <StatCard title="Pending Applications" value={String(overview.pendingApplications)} icon={Clock} color="amber" />
                            <StatCard title="Overdue Invoices" value={String(overview.overdueInvoices)} icon={AlertCircle} color="red" />
                            <StatCard title="Rejected Applications" value={String(overview.rejectedSchools)} icon={Users} color="gray" />
                        </div>

                        {/* Charts row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="card lg:col-span-2 flex items-center justify-center text-sm text-gray-400">
                                Revenue growth over time needs multiple months of billing history to chart meaningfully — check back as invoices accumulate.
                            </div>
                            <div className="card">
                                <h2 className="section-title">Active Schools by District</h2>
                                {districtData && districtData.labels.length > 0
                                    ? <DoughnutChart data={districtData} />
                                    : <p className="text-sm text-gray-400">No active schools yet.</p>}
                            </div>
                        </div>

                        {/* Bottom row */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="section-title mb-0">Send a Message</h2>
                                <button onClick={() => setMsgModal(true)} className="btn-primary text-xs py-1.5"><Send size={12} /> Send Alert</button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Message a specific school or broadcast to all active schools — delivered by email to their registered contact.</p>
                        </div>
                    </>
                )}
            </div>

            {/* Send Message Modal */}
            <Modal isOpen={msgModal} onClose={() => setMsgModal(false)} title="Send Message to School" size="md"
                footer={<><button className="btn-secondary" onClick={() => setMsgModal(false)}>Cancel</button><button disabled={sending} className="btn-primary" onClick={sendMsg}><Send size={14} /> {sending ? 'Sending…' : 'Send Message'}</button></>}>
                <div className="space-y-4">
                    {sendError && <p className="text-sm text-red-600">{sendError}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Select School *</label>
                        <select value={msgSchool} onChange={e => setMsgSchool(e.target.value)} className="select-field">
                            <option value="">Choose a school...</option>
                            <option value="all">📢 All Active Schools (Broadcast)</option>
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message Type</label>
                        <div className="flex gap-2">
                            {[['info', 'ℹ️ Info', 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'], ['warning', '⚠️ Warning', 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'], ['urgent', '🚨 Urgent', 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']].map(([v, l, c]) => (
                                <button key={v} onClick={() => setMsgType(v)} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${msgType === v ? c + ' border-current' : 'bg-white dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-600'}`}>{l}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message *</label>
                        <textarea value={msgText} onChange={e => setMsgText(e.target.value)} rows={4} className="input-field resize-none" placeholder="Type your message or alert here..." />
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                        <MessageSquare size={12} className="inline mr-1" />
                        Delivered by email to the school's registered contact address.
                    </div>
                </div>
            </Modal>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl bg-emerald-600 text-white text-sm font-medium">
                    <CheckCircle size={16} /> {toast}
                </div>
            )}
        </DashboardLayout>
    )
}
