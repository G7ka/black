import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { MessageSquare, Megaphone, Filter, Send, Plus } from 'lucide-react'

const tickets = [
    { id: 'TKT-001', school: 'Greenhill Academy', subject: 'Cannot upload student photos', priority: 'high', status: 'open', assigned: 'Peter O.', date: '2026-02-22' },
    { id: 'TKT-002', school: 'St. Marys College', subject: 'SMS gateway not delivering', priority: 'critical', status: 'open', assigned: 'Unassigned', date: '2026-02-22' },
    { id: 'TKT-003', school: 'Nile International', subject: 'Invoice download broken', priority: 'normal', status: 'resolved', assigned: 'Sarah N.', date: '2026-02-21' },
    { id: 'TKT-004', school: 'Kabale Primary', subject: 'How to set up fee structure', priority: 'normal', status: 'pending', assigned: 'Peter O.', date: '2026-02-20' },
    { id: 'TKT-005', school: 'Aga Khan School', subject: 'Grade export to Excel failing', priority: 'high', status: 'open', assigned: 'Unassigned', date: '2026-02-19' },
]
const prioVariant = { critical: 'danger', high: 'warning', normal: 'info' }
const statusVariant = { open: 'info', resolved: 'success', pending: 'warning' }

export default function SASupport() {
    const [filter, setFilter] = useState('all')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter || t.priority === filter)

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Support Center</h1><p className="page-subtitle">Manage tickets and send platform-wide announcements</p></div>
                    <button className="btn-primary" onClick={() => setModal('broadcast')}><Megaphone size={16} /> Broadcast</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[{ l: 'Open Tickets', v: 3, c: 'blue' }, { l: 'Critical', v: 1, c: 'red' }, { l: 'Resolved Today', v: 2, c: 'green' }, { l: 'Avg Response', v: '2.4h', c: 'purple' }].map(s => (
                        <div key={s.l} className={`card text-center border-l-4 ${s.c === 'red' ? 'border-red-500' : s.c === 'green' ? 'border-emerald-500' : s.c === 'purple' ? 'border-purple-500' : 'border-blue-500'}`}>
                            <p className="text-2xl font-bold text-gray-900">{s.v}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.l}</p>
                        </div>
                    ))}
                </div>

                <div className="card p-0">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Support Tickets</h2>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'open', 'pending', 'resolved', 'critical', 'high'].map(f => (
                                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
                            ))}
                        </div>
                    </div>
                    <table className="w-full">
                        <thead><tr>{['Ticket #', 'School', 'Subject', 'Priority', 'Status', 'Assigned To', 'Date', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(t => (
                                <tr key={t.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell font-mono text-xs text-blue-600 font-semibold">{t.id}</td>
                                    <td className="table-cell font-medium">{t.school}</td>
                                    <td className="table-cell text-gray-600 max-w-xs truncate">{t.subject}</td>
                                    <td className="table-cell"><Badge variant={prioVariant[t.priority]}>{t.priority}</Badge></td>
                                    <td className="table-cell"><Badge variant={statusVariant[t.status]}>{t.status}</Badge></td>
                                    <td className="table-cell text-xs text-gray-500">{t.assigned}</td>
                                    <td className="table-cell text-xs text-gray-400">{t.date}</td>
                                    <td className="table-cell">
                                        <button className="btn-primary text-xs py-1 px-3" onClick={() => { setSelected(t); setModal('respond') }}><MessageSquare size={11} /> Respond</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={modal === 'respond'} onClose={() => setModal(null)} title={`Respond to ${selected?.id}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Send size={14} /> Send Reply</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm font-semibold">{selected.subject}</p><p className="text-xs text-gray-500">{selected.school} · {selected.date}</p></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                            <select className="select-field"><option>Peter Opolot</option><option>Sarah Nakato</option><option>James Mugisha</option></select>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Reply</label><textarea className="input-field resize-none" rows={4} placeholder="Type your response..." /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                            <select className="select-field"><option>Open</option><option>Pending</option><option>Resolved</option></select>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'broadcast'} onClose={() => setModal(null)} title="Broadcast Announcement" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Send size={14} /> Send Broadcast</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input className="input-field" placeholder="e.g., System Maintenance Notice" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea className="input-field resize-none" rows={4} placeholder="Your announcement..." /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Send Via</label>
                        <div className="flex gap-4">{['Email', 'SMS', 'In-app Notification'].map(ch => <label key={ch} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked /><span className="text-sm">{ch}</span></label>)}</div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Schools</label>
                        <select className="select-field"><option>All Active Schools (231)</option><option>Pro & Enterprise Only</option><option>Schools with Overdue Payments</option><option>Custom Selection</option></select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
