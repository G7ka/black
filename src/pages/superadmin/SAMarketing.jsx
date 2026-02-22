import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Plus, Send, Target, Users, TrendingUp } from 'lucide-react'

const leads = [
    { id: 1, name: 'Kampala Grammar School', contact: 'Sarah Nkosi', email: 'info@kgs.ug', source: 'Website', status: 'hot', date: '2026-02-21' },
    { id: 2, name: 'Entebbe International', contact: 'David Ssempa', email: 'd.ssempa@eis.ug', source: 'Referral', status: 'warm', date: '2026-02-20' },
    { id: 3, name: 'Lira Model School', contact: 'Mary Ochen', email: 'mary@lms.ug', source: 'Google Ad', status: 'cold', date: '2026-02-18' },
    { id: 4, name: 'Mbale Elite Academy', contact: 'John Wafula', email: 'j.wafula@mea.ug', source: 'LinkedIn', status: 'warm', date: '2026-02-15' },
    { id: 5, name: 'Fort Portal Christian', contact: 'Agnes Kato', email: 'agnes@fpc.ug', source: 'Referral', status: 'converted', date: '2026-02-10' },
]

const campaigns = [
    { name: 'Back-to-School Feb 2026', channel: 'Email + SMS', sent: 450, opened: 312, converted: 28, status: 'completed' },
    { name: 'Pro Plan Upgrade Drive', channel: 'In-app + Email', sent: 124, opened: 98, converted: 15, status: 'active' },
    { name: 'Referral Bonus March', channel: 'SMS', sent: 0, opened: 0, converted: 0, status: 'draft' },
]

const statusVariant = { hot: 'danger', warm: 'warning', cold: 'gray', converted: 'success' }

export default function SAMarketing() {
    const [modal, setModal] = useState(null)

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Marketing</h1><p className="page-subtitle">Leads, campaigns, and referral tracking</p></div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('campaign')}><Target size={15} /> New Campaign</button>
                        <button className="btn-primary" onClick={() => setModal('lead')}><Plus size={15} /> Add Lead</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[{ l: 'Total Leads', v: '42', icon: Users, c: 'blue' }, { l: 'Hot Leads', v: '8', icon: TrendingUp, c: 'red' }, { l: 'Converted', v: '18', icon: Target, c: 'green' }, { l: 'Referred Schools', v: '31', icon: Send, c: 'purple' }].map(s => (
                        <div key={s.l} className="card flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${s.c === 'blue' ? 'bg-blue-100 text-blue-600' : s.c === 'red' ? 'bg-red-100 text-red-600' : s.c === 'green' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}><s.icon size={18} /></div>
                            <div><p className="text-xl font-bold">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div>
                        </div>
                    ))}
                </div>

                {/* Leads Table */}
                <div className="card p-0">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Leads Pipeline</h2></div>
                    <table className="w-full">
                        <thead><tr>{['School', 'Contact', 'Email', 'Source', 'Status', 'Date', 'Action'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {leads.map(l => (
                                <tr key={l.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell font-semibold">{l.name}</td>
                                    <td className="table-cell text-gray-600">{l.contact}</td>
                                    <td className="table-cell text-xs text-gray-500">{l.email}</td>
                                    <td className="table-cell text-xs"><Badge variant="gray">{l.source}</Badge></td>
                                    <td className="table-cell"><Badge variant={statusVariant[l.status]}>{l.status}</Badge></td>
                                    <td className="table-cell text-xs text-gray-400">{l.date}</td>
                                    <td className="table-cell"><div className="flex gap-1"><button className="btn-secondary text-xs py-1 px-2">View</button><button className="btn-primary text-xs py-1 px-2"><Send size={10} /> Follow Up</button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Campaigns */}
                <div className="card">
                    <h2 className="section-title">Campaigns</h2>
                    <div className="space-y-3">
                        {campaigns.map(c => (
                            <div key={c.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.channel} · Sent: {c.sent} · Opened: {c.opened} · Converted: {c.converted}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <Badge variant={c.status === 'active' ? 'success' : c.status === 'draft' ? 'gray' : 'info'}>{c.status}</Badge>
                                    <button className="btn-secondary text-xs py-1 px-3">View Report</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'lead'} onClose={() => setModal(null)} title="Add New Lead"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Save Lead</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">School Name</label><input className="input-field" placeholder="e.g., Kampala Grammar" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label><input className="input-field" placeholder="Full name" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input className="input-field" type="email" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Source</label><select className="select-field"><option>Website</option><option>Referral</option><option>Google Ad</option><option>LinkedIn</option><option>Direct</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select className="select-field"><option>cold</option><option>warm</option><option>hot</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea className="input-field resize-none" rows={2} /></div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'campaign'} onClose={() => setModal(null)} title="Create Campaign" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Target size={14} /> Create Campaign</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label><input className="input-field" placeholder="e.g., Back-to-School Promo" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Channel</label><select className="select-field"><option>Email</option><option>SMS</option><option>In-app</option><option>Email + SMS</option></select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Segment</label><select className="select-field"><option>All Leads</option><option>Hot Leads Only</option><option>Existing Schools</option><option>Overdue Schools</option></select></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea className="input-field resize-none" rows={4} placeholder="Campaign message..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label><input type="datetime-local" className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select className="select-field"><option>draft</option><option>scheduled</option><option>active</option></select></div>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
