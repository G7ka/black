import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { Send, Plus, Megaphone, Pin, Clock, LifeBuoy, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react'

const platformTickets = [
    { id: 'SUP-012', subject: 'Cannot bulk-import student list from CSV', priority: 'high', status: 'open', date: '2026-02-28', reply: null },
    { id: 'SUP-009', subject: 'SMS balance running low — need top-up', priority: 'normal', status: 'in-progress', date: '2026-02-22', reply: 'We have processed your top-up. 2,000 SMS credits have been added.' },
    { id: 'SUP-005', subject: 'Request: Add custom report template', priority: 'normal', status: 'resolved', date: '2026-02-10', reply: 'Custom report templates are now available under Reports → Templates.' },
]

const platformAnnouncements = [
    { title: 'Scheduled Maintenance — March 8', body: 'The platform will undergo maintenance from 11 PM to 3 AM EAT. Please inform your staff accordingly.', date: '2026-03-01', pinned: true, type: 'warning' },
    { title: 'New: Bulk Student Import', body: 'You can now import students from Excel or CSV files. Go to Students → Import to get started.', date: '2026-02-20', pinned: false, type: 'info' },
    { title: 'Term 1 Fee Collection Deadline', body: 'Remember to reconcile all fee payments before the end of Term 1 to ensure accurate financial reports.', date: '2026-02-15', pinned: true, type: 'info' },
]

export default function SchoolAdminSupport({ role = 'schooladmin-primary' }) {
    const [modal, setModal] = useState(null)
    const [tickets, setTickets] = useState(platformTickets)
    const [newSubject, setNewSubject] = useState('')
    const [newCategory, setNewCategory] = useState('Technical Issue')
    const [newPriority, setNewPriority] = useState('Normal')
    const [newDesc, setNewDesc] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const submitTicket = () => {
        if (!newSubject.trim() || !newDesc.trim()) return
        const ticket = {
            id: `SUP-${String(tickets.length + 13).padStart(3, '0')}`,
            subject: newSubject,
            priority: newPriority.toLowerCase(),
            status: 'open',
            date: new Date().toISOString().slice(0, 10),
            reply: null
        }
        setTickets([ticket, ...tickets])
        setNewSubject(''); setNewCategory('Technical Issue'); setNewPriority('Normal'); setNewDesc('')
        setModal(null)
        setSuccessMsg('Your ticket has been submitted to EduManage support.')
        setTimeout(() => setSuccessMsg(''), 4000)
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
                        <h1 className="page-title flex items-center gap-2"><LifeBuoy size={22} className="text-blue-500" /> Platform Support</h1>
                        <p className="page-subtitle">Contact the EduManage team directly for platform issues, feature requests, or account help.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setModal('ticket')}><Plus size={15} /> New Ticket</button>
                </div>

                {/* Platform Announcements */}
                <div>
                    <h2 className="section-title flex items-center gap-2"><Megaphone size={16} /> Platform Announcements</h2>
                    <div className="space-y-3">
                        {platformAnnouncements.map((a, i) => (
                            <div key={i} className={`card border-l-4 ${a.type === 'warning' ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : 'border-blue-400'}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {a.pinned && <Pin size={13} className="text-gray-400 dark:text-slate-500" />}
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                                            {a.pinned && <Badge variant="gray">Pinned</Badge>}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-slate-300">{a.body}</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 flex items-center gap-1"><Clock size={11} /> {a.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tickets */}
                <div>
                    <h2 className="section-title flex items-center gap-2"><MessageSquare size={16} /> My Support Tickets</h2>
                    <div className="card p-0">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Ticket #', 'Subject', 'Priority', 'Status', 'Date', 'Reply'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {tickets.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                        <td className="table-cell font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{t.id}</td>
                                        <td className="table-cell font-medium text-sm dark:text-white">{t.subject}</td>
                                        <td className="table-cell"><Badge variant={t.priority === 'high' ? 'warning' : 'info'}>{t.priority}</Badge></td>
                                        <td className="table-cell"><Badge variant={t.status === 'resolved' ? 'success' : t.status === 'in-progress' ? 'info' : 'warning'}>{t.status}</Badge></td>
                                        <td className="table-cell text-xs text-gray-400 dark:text-slate-500">{t.date}</td>
                                        <td className="table-cell text-xs text-gray-500 dark:text-slate-400 max-w-[200px] truncate">{t.reply || <span className="text-gray-300 dark:text-slate-600 italic">Awaiting response</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                        {tickets.length === 0 && <div className="p-8 text-center text-gray-400 dark:text-slate-500">No tickets submitted yet.</div>}
                    </div>
                </div>

                {/* Info notice */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">School Admin–Only Channel</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">This support channel is exclusively for school administrators. Teachers and staff should raise concerns at the school office, and school admins can relay platform-related issues here.</p>
                    </div>
                </div>
            </div>

            {/* New Ticket Modal */}
            <Modal isOpen={modal === 'ticket'} onClose={() => setModal(null)} title="Submit Support Ticket to EduManage"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={submitTicket} disabled={!newSubject.trim() || !newDesc.trim()}><Send size={14} /> Submit Ticket</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><input className="input-field" placeholder="Brief description of your issue" value={newSubject} onChange={e => setNewSubject(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="select-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                                <option>Technical Issue</option><option>Billing / SMS Credits</option><option>Feature Request</option><option>Account Problem</option><option>Other</option>
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select className="select-field" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                                <option>Normal</option><option>High</option><option>Critical</option>
                            </select>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea className="input-field resize-none" rows={4} placeholder="Describe the issue in detail…" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
