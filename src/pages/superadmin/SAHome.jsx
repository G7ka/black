import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import { LineChart, BarChart, DoughnutChart } from '../../components/charts/Charts'
import {
    Building2, Users, DollarSign, TrendingUp,
    GraduationCap, AlertCircle, CheckCircle, Clock, BookOpen, Book, Send, MessageSquare
} from 'lucide-react'

const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']

const revenueData = {
    labels: months,
    datasets: [
        {
            label: 'Revenue (UGX M)',
            data: [42, 58, 63, 71, 85, 98, 112],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2563eb',
            pointRadius: 4,
        },
        {
            label: 'Subscriptions',
            data: [28, 38, 44, 51, 60, 70, 80],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.06)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
        },
    ],
}

const schoolGrowthData = {
    labels: months,
    datasets: [
        {
            label: 'New Schools',
            data: [8, 14, 11, 19, 23, 17, 28],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
        },
    ],
}

const districtData = {
    labels: ['Kampala', 'Wakiso', 'Mukono', 'Gulu', 'Mbarara', 'Others'],
    datasets: [{
        data: [34, 22, 18, 12, 9, 5],
        backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
        borderWidth: 0,
    }],
}

const recentActivity = [
    { icon: CheckCircle, color: 'text-emerald-500', text: 'Greenhill Academy approved', time: '2 min ago' },
    { icon: AlertCircle, color: 'text-amber-500', text: 'St. Mary\'s overdue payment', time: '15 min ago' },
    { icon: Building2, color: 'text-blue-500', text: 'New school application: Kabale PS', time: '1 hr ago' },
    { icon: Users, color: 'text-purple-500', text: '3 new teachers registered', time: '2 hr ago' },
    { icon: DollarSign, color: 'text-emerald-500', text: 'Payment received: UGX 400,000', time: '3 hr ago' },
]

const schoolList = [
    'Greenhill Academy', 'St. Mary\'s College', 'Kabale Primary School',
    'Nile International School', 'Buganda Road Primary', 'Aga Khan School',
    'Mbarara High School', 'Gulu Excellence School',
]

export default function SAHome() {
    const [msgModal, setMsgModal] = useState(false)
    const [msgSchool, setMsgSchool] = useState('')
    const [msgType, setMsgType] = useState('info')
    const [msgText, setMsgText] = useState('')
    const [toast, setToast] = useState(null)

    const sendMsg = () => {
        if (!msgSchool || !msgText) return
        setToast(`Message sent to ${msgSchool}`)
        setTimeout(() => setToast(null), 3000)
        setMsgModal(false); setMsgSchool(''); setMsgText(''); setMsgType('info')
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="page-title">Platform Overview</h1>
                    <p className="page-subtitle">Welcome back! Here's your platform summary for today.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Schools" value="247" subtitle="+12 this month" icon={Building2} color="blue" trend="up" trendValue="5.1% vs last month" />
                    <StatCard title="Total Students" value="68,430" subtitle="Across all schools" icon={GraduationCap} color="green" trend="up" trendValue="8.3% growth" />
                    <StatCard title="Monthly Revenue" value="UGX 112M" subtitle="Feb 2026" icon={DollarSign} color="purple" trend="up" trendValue="14.3% vs Jan" />
                    <StatCard title="Active Schools" value="231" subtitle="16 pending approval" icon={CheckCircle} color="amber" trend="up" trendValue="93.5% active rate" />
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard title="Primary Schools" value="164" subtitle="66.4% of total" icon={BookOpen} color="blue" />
                    <StatCard title="Secondary Schools" value="83" subtitle="33.6% of total" icon={Book} color="indigo" />
                    <StatCard title="Total Teachers" value="4,218" icon={Users} color="green" />
                    <StatCard title="Total Parents" value="12,640" subtitle="Across all schools" icon={Users} color="purple" />
                    <StatCard title="Pending Applications" value="16" icon={Clock} color="amber" />
                    <StatCard title="Overdue Payments" value="23" icon={AlertCircle} color="red" />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card lg:col-span-2">
                        <h2 className="section-title">Revenue Growth</h2>
                        <LineChart data={revenueData} />
                    </div>
                    <div className="card">
                        <h2 className="section-title">Schools by District</h2>
                        <DoughnutChart data={districtData} />
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="section-title">Monthly School Registrations</h2>
                        <BarChart data={schoolGrowthData} />
                    </div>
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title mb-0">Recent Activity</h2>
                            <button onClick={() => setMsgModal(true)} className="btn-primary text-xs py-1.5"><Send size={12} /> Send Alert</button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <a.icon size={16} className={`mt-0.5 flex-shrink-0 ${a.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 dark:text-slate-300">{a.text}</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Message Modal */}
            <Modal isOpen={msgModal} onClose={() => setMsgModal(false)} title="Send Message to School" size="md"
                footer={<><button className="btn-secondary" onClick={() => setMsgModal(false)}>Cancel</button><button className="btn-primary" onClick={sendMsg}><Send size={14} /> Send Message</button></>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Select School *</label>
                        <select value={msgSchool} onChange={e => setMsgSchool(e.target.value)} className="select-field">
                            <option value="">Choose a school...</option>
                            <option value="all">📢 All Schools (Broadcast)</option>
                            {schoolList.map(s => <option key={s} value={s}>{s}</option>)}
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
                        The school admin will receive this message as a notification in their dashboard.
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
