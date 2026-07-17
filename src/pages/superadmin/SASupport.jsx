import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Clock, CheckCircle, AlertCircle, MessageSquare, Search, Eye } from 'lucide-react'
import { supportTicketsApi } from '../../api/supportTickets.api'

const priorityVariant = { CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'gray' }
const statusVariant = { OPEN: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success' }
const statusLabel = { OPEN: 'open', IN_PROGRESS: 'in progress', RESOLVED: 'resolved' }

export default function SASupport() {
    const [tickets, setTickets] = useState([])
    const [stats, setStats] = useState({ OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 })
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [reply, setReply] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const [ticketsResult, statsResult] = await Promise.all([
                supportTicketsApi.list({ status: filter, search: search || undefined, page: 1, pageSize: 100 }),
                supportTicketsApi.stats(),
            ])
            setTickets(ticketsResult.tickets)
            setStats(statsResult)
        } catch (err) {
            setLoadError(err.message || 'Failed to load tickets')
        } finally {
            setLoading(false)
        }
    }, [filter, search])

    useEffect(() => { load() }, [load])

    const openView = async (ticket) => {
        setModal('view')
        setActionError('')
        try {
            setSelected(await supportTicketsApi.get(ticket.id))
        } catch (err) {
            setActionError(err.message || 'Failed to load ticket')
        }
    }

    const closeModal = () => { setModal(null); setSelected(null); setReply(''); setActionError('') }

    const sendReply = async () => {
        if (!reply.trim()) return
        setActionLoading(true)
        setActionError('')
        try {
            await supportTicketsApi.reply(selected.id, reply)
            await load()
            closeModal()
        } catch (err) {
            setActionError(err.message || 'Failed to send reply')
        } finally {
            setActionLoading(false)
        }
    }

    const filtered = tickets // filtering/search already applied server-side

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Support & Helpdesk</h1>
                        <p className="page-subtitle">Manage support tickets and helpdesk requests from schools</p>
                    </div>
                </div>

                {loadError && <p className="text-sm text-red-600">{loadError}</p>}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Open Tickets" value={String(stats.OPEN)} icon={AlertCircle} color="amber" />
                    <StatCard title="In Progress" value={String(stats.IN_PROGRESS)} icon={Clock} color="blue" />
                    <StatCard title="Resolved" value={String(stats.RESOLVED)} icon={CheckCircle} color="green" />
                    <StatCard title="Total Tickets" value={String(stats.OPEN + stats.IN_PROGRESS + stats.RESOLVED)} icon={MessageSquare} color="purple" />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'open', 'in-progress', 'resolved'].map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                            {t === 'all' ? 'All' : t.replace('-', ' ')}
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
                                {loading && <tr><td colSpan={7} className="table-cell text-center text-gray-400 py-8">Loading…</td></tr>}
                                {!loading && filtered.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="table-cell font-mono text-xs font-semibold text-primary-600 dark:text-blue-400">{t.displayId}</td>
                                        <td className="table-cell font-semibold text-gray-900 dark:text-white">{t.school}</td>
                                        <td className="table-cell text-gray-600 dark:text-slate-300 max-w-[200px] truncate">{t.subject}</td>
                                        <td className="table-cell"><Badge variant={priorityVariant[t.priority]}>{t.priority.toLowerCase()}</Badge></td>
                                        <td className="table-cell"><Badge variant={statusVariant[t.status]}>{statusLabel[t.status]}</Badge></td>
                                        <td className="table-cell text-xs text-gray-400 dark:text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                        <td className="table-cell">
                                            <button onClick={() => openView(t)} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="View">
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400 dark:text-slate-500">No tickets found matching the criteria.</div>
                    )}
                </div>
            </div>

            {/* View Ticket Modal */}
            <Modal isOpen={modal === 'view'} onClose={closeModal} title={selected ? `Ticket ${selected.displayId}` : 'Ticket'} size="lg"
                footer={<><button className="btn-secondary" onClick={closeModal}>Close</button><button disabled={actionLoading || !reply.trim()} className="btn-primary disabled:opacity-50" onClick={sendReply}><MessageSquare size={14} /> {actionLoading ? 'Sending…' : 'Send Reply'}</button></>}
            >
                {selected && (
                    <div className="space-y-4">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['School', selected.school], ['Subject', selected.subject],
                                ['Priority', selected.priority.toLowerCase()], ['Status', statusLabel[selected.status]],
                                ['Date', new Date(selected.createdAt).toLocaleDateString()],
                            ].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{k}</p>
                                    <p className="text-gray-900 dark:text-white font-semibold mt-0.5 capitalize">{v}</p>
                                </div>
                            ))}
                        </div>

                        {selected.replies?.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {selected.replies.map((r) => (
                                    <div key={r.id} className={`p-3 rounded-lg text-sm ${r.authorType === 'PLATFORM_ADMIN' ? 'bg-blue-50 dark:bg-blue-900/20 ml-6' : 'bg-gray-50 dark:bg-slate-700/50 mr-6'}`}>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">{r.authorType === 'PLATFORM_ADMIN' ? 'Support' : 'School'} · {new Date(r.createdAt).toLocaleString()}</p>
                                        <p className="text-gray-800 dark:text-slate-200">{r.body}</p>
                                    </div>
                                ))}
                            </div>
                        )}

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
