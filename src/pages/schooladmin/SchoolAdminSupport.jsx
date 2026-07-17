import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { LifeBuoy, Plus, Send, AlertCircle } from 'lucide-react'
import { tenantSupportApi } from '../../api/schoolOps.api'

export default function SchoolAdminSupport({ role = 'schooladmin-primary' }) {
    const [modal, setModal] = useState(null)
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [newSubject, setNewSubject] = useState('')
    const [newPriority, setNewPriority] = useState('MEDIUM')

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            setTickets(await tenantSupportApi.list())
        } catch (err) {
            setLoadError(err.message || 'Failed to load tickets')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const submitTicket = async () => {
        if (!newSubject.trim()) return
        setActionLoading(true); setActionError('')
        try {
            await tenantSupportApi.create({ subject: newSubject, priority: newPriority })
            setModal(null); setNewSubject(''); setNewPriority('MEDIUM')
            await load()
        } catch (err) {
            setActionError(err.message || 'Failed to submit ticket')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><LifeBuoy size={22} className="text-blue-500" /> Platform Support</h1>
                        <p className="page-subtitle">Contact the EduManage team directly for platform issues, feature requests, or account help.</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setModal('ticket'); setActionError('') }}><Plus size={15} /> New Ticket</button>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                <div>
                    <h2 className="section-title">My Support Tickets</h2>
                    <div className="card p-0">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Ticket #', 'Subject', 'Priority', 'Status', 'Date'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {loading && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">Loading…</td></tr>}
                                {!loading && tickets.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                        <td className="table-cell font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{t.displayId}</td>
                                        <td className="table-cell font-medium text-sm dark:text-white">{t.subject}</td>
                                        <td className="table-cell"><Badge variant={t.priority === 'HIGH' || t.priority === 'CRITICAL' ? 'warning' : 'info'}>{t.priority.toLowerCase()}</Badge></td>
                                        <td className="table-cell"><Badge variant={t.status === 'RESOLVED' ? 'success' : t.status === 'IN_PROGRESS' ? 'info' : 'warning'}>{t.status.replace('_', ' ').toLowerCase()}</Badge></td>
                                        <td className="table-cell text-xs text-gray-400 dark:text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                        {!loading && tickets.length === 0 && <div className="p-8 text-center text-gray-400 dark:text-slate-500">No tickets submitted yet.</div>}
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">School Admin–Only Channel</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">This support channel is exclusively for school administrators.</p>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'ticket'} onClose={() => setModal(null)} title="Submit Support Ticket to EduManage"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={submitTicket} disabled={actionLoading || !newSubject.trim()}><Send size={14} /> {actionLoading ? 'Submitting…' : 'Submit Ticket'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><input className="input-field" placeholder="Brief description of your issue" value={newSubject} onChange={e => setNewSubject(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select className="select-field" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                            <option value="LOW">Low</option><option value="MEDIUM">Normal</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
