import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Send, Plus, Megaphone, Pin, Clock } from 'lucide-react'

const myTickets = [
    { id: 'TKT-041', subject: 'SMS alerts not working for P6A', priority: 'high', status: 'open', date: '2026-02-21' },
    { id: 'TKT-033', subject: 'Grade export to PDF broken', priority: 'normal', status: 'resolved', date: '2026-02-15' },
]

const announcements = [
    { title: 'System Maintenance — Feb 27', body: 'The platform will be unavailable from 10 PM to 2 AM for scheduled upgrades. Please save your work.', date: '2026-02-20', pinned: true, type: 'warning' },
    { title: 'New Feature: Bulk Grade Import', body: 'Grades can now be imported from Excel. Visit the Grades section and click "Import from Excel".', date: '2026-02-18', pinned: false, type: 'info' },
    { title: 'End-of-Term Reports Due March 1', body: 'Please ensure all student grades and attendance records are submitted before March 1st.', date: '2026-02-15', pinned: true, type: 'info' },
]

export default function TeacherSupport() {
    const [modal, setModal] = useState(null)
    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Support</h1><p className="page-subtitle">Submit support tickets and stay updated with announcements</p></div>
                    <button className="btn-primary" onClick={() => setModal('ticket')}><Plus size={15} /> New Ticket</button>
                </div>

                {/* Announcements */}
                <div>
                    <h2 className="section-title flex items-center gap-2"><Megaphone size={16} /> Announcements</h2>
                    <div className="space-y-3">
                        {announcements.map((a, i) => (
                            <div key={i} className={`card border-l-4 ${a.type === 'warning' ? 'border-amber-400 bg-amber-50/50' : 'border-blue-400'}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {a.pinned && <Pin size={13} className="text-gray-400" />}
                                            <h3 className="font-semibold text-gray-900">{a.title}</h3>
                                            {a.pinned && <Badge variant="gray">Pinned</Badge>}
                                        </div>
                                        <p className="text-sm text-gray-600">{a.body}</p>
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Clock size={11} /> {a.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Tickets */}
                <div>
                    <h2 className="section-title">My Support Tickets</h2>
                    <div className="card p-0">
                        <table className="w-full">
                            <thead><tr>{['Ticket #', 'Subject', 'Priority', 'Status', 'Date'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {myTickets.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-mono text-xs text-blue-600 font-semibold">{t.id}</td>
                                        <td className="table-cell font-medium text-sm">{t.subject}</td>
                                        <td className="table-cell"><Badge variant={t.priority === 'high' ? 'warning' : 'info'}>{t.priority}</Badge></td>
                                        <td className="table-cell"><Badge variant={t.status === 'resolved' ? 'success' : 'info'}>{t.status}</Badge></td>
                                        <td className="table-cell text-xs text-gray-400">{t.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {myTickets.length === 0 && <div className="p-8 text-center text-gray-400">No tickets submitted yet.</div>}
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'ticket'} onClose={() => setModal(null)} title="Submit Support Ticket"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Send size={14} /> Submit Ticket</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input className="input-field" placeholder="Brief description of your issue" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="select-field"><option>Technical Issue</option><option>Feature Request</option><option>Account Problem</option><option>Other</option></select>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select className="select-field"><option>Normal</option><option>High</option><option>Critical</option></select>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="input-field resize-none" rows={4} placeholder="Describe the issue in detail. Include what you were doing and any error messages." />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
