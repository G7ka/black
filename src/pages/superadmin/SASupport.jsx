import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { LifeBuoy, Clock, CheckCircle, AlertCircle, MessageSquare, Search, Eye } from 'lucide-react'

const tickets = [
    { id: 'TK-1042', school: 'Greenhill Academy', subject: 'Cannot reset teacher password', priority: 'high', status: 'open', date: '2026-02-22' },
    { id: 'TK-1041', school: 'St. Mary\'s College', subject: 'Fee payment not reflecting on parent portal', priority: 'high', status: 'in-progress', date: '2026-02-22' },
    { id: 'TK-1040', school: 'Nile International', subject: 'Request to add new class stream', priority: 'medium', status: 'open', date: '2026-02-21' },
    { id: 'TK-1039', school: 'Kabale Primary', subject: 'Subdomain not loading', priority: 'critical', status: 'in-progress', date: '2026-02-21' },
    { id: 'TK-1038', school: 'Aga Khan School', subject: 'Timetable conflict for P5 Blue', priority: 'low', status: 'resolved', date: '2026-02-20' },
    { id: 'TK-1037', school: 'Buganda Road PS', subject: 'Cannot upload student photos', priority: 'medium', status: 'resolved', date: '2026-02-19' },
    { id: 'TK-1036', school: 'Mbarara High', subject: 'Reports not generating for Term 3', priority: 'high', status: 'resolved', date: '2026-02-18' },
    { id: 'TK-1035', school: 'Gulu Excellence', subject: 'Need help setting up attendance module', priority: 'low', status: 'open', date: '2026-02-17' },
]

const priorityVariant = { critical: 'danger', high: 'warning', medium: 'info', low: 'gray' }
const statusVariant = { open: 'warning', 'in-progress': 'info', resolved: 'success' }

export default function SASupport() {
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [reply, setReply] = useState('')

    const filtered = tickets.filter(t => {
        const matchStatus = filter === 'all' || t.status === filter
        const matchSearch = t.school.toLowerCase().includes(search.toLowerCase()) ||
            t.subject.toLowerCase().includes(search.toLowerCase()) ||
            t.id.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    })

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Support & Helpdesk</h1>
                        <p className="page-subtitle">Manage support tickets and helpdesk requests from schools</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'open').length.toString()} icon={AlertCircle} color="amber" />
                    <StatCard title="In Progress" value={tickets.filter(t => t.status === 'in-progress').length.toString()} icon={Clock} color="blue" />
                    <StatCard title="Resolved This Month" value={tickets.filter(t => t.status === 'resolved').length.toString()} icon={CheckCircle} color="green" />
                    <StatCard title="Avg Response Time" value="2.4 hrs" icon={MessageSquare} color="purple" trend="down" trendValue="-18min improved" />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'open', 'in-progress', 'resolved'].map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                            {t === 'all' ? 'All' : t.replace('-', ' ')} {t !== 'all' && <span className="ml-1 text-xs opacity-70">({tickets.filter(tk => tk.status === t).length})</span>}
                        </button>
                    ))}
                    <div className="ml-auto relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..."
                            className="input-field pl-9 w-64" />
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['Ticket ID', 'School', 'Subject', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="table-cell font-mono text-xs font-semibold text-primary-600 dark:text-blue-400">{t.id}</td>
                                        <td className="table-cell font-semibold text-gray-900 dark:text-white">{t.school}</td>
                                        <td className="table-cell text-gray-600 dark:text-slate-300 max-w-[200px] truncate">{t.subject}</td>
                                        <td className="table-cell"><Badge variant={priorityVariant[t.priority]}>{t.priority}</Badge></td>
                                        <td className="table-cell"><Badge variant={statusVariant[t.status]}>{t.status.replace('-', ' ')}</Badge></td>
                                        <td className="table-cell text-xs text-gray-400 dark:text-slate-500">{t.date}</td>
                                        <td className="table-cell">
                                            <button onClick={() => { setSelected(t); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="View">
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400 dark:text-slate-500">No tickets found matching the criteria.</div>
                    )}
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl">
                        <p className="text-xs text-gray-500 dark:text-slate-400">Showing {filtered.length} of {tickets.length} tickets</p>
                    </div>
                </div>
            </div>

            {/* View Ticket Modal */}
            <Modal isOpen={modal === 'view'} onClose={() => { setModal(null); setSelected(null); setReply('') }} title={`Ticket ${selected?.id}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => { setModal(null); setSelected(null); setReply('') }}>Close</button><button className="btn-primary" onClick={() => { setModal(null); setSelected(null); setReply('') }}><MessageSquare size={14} /> Send Reply</button></>}
            >
                {selected && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['School', selected.school], ['Subject', selected.subject],
                                ['Priority', selected.priority], ['Status', selected.status],
                                ['Date', selected.date],
                            ].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{k}</p>
                                    <p className="text-gray-900 dark:text-white font-semibold mt-0.5 capitalize">{v}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reply</label>
                            <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} className="input-field resize-none" placeholder="Type your reply to the school..." />
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
