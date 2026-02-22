import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Trash2, Mail, Phone } from 'lucide-react'

const parents = [
    { id: 'PAR-001', name: 'Mary Namukasa', students: ['Ivan Namukasa (P6)', 'Sarah Namukasa (P3)'], phone: '+256 772 111222', email: 'mary.n@email.com', status: 'active', balance: 'UGX 365,000' },
    { id: 'PAR-002', name: 'John Mukasa', students: ['Peter Mukasa (P7)'], phone: '+256 752 333444', email: 'john.m@email.com', status: 'active', balance: 'UGX 0' },
    { id: 'PAR-003', name: 'Alice Kemigisha', students: ['Paul Kisa (P4)'], phone: '+256 701 555666', email: 'alice.k@email.com', status: 'inactive', balance: 'UGX 120,000' },
    { id: 'PAR-004', name: 'David Opio', students: ['Daniel Opio (P1)', 'Esther Opio (P2)'], phone: '+256 780 777888', email: 'david.o@email.com', status: 'active', balance: 'UGX 0' },
]

export default function SecondaryAdminParents() {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const filtered = parents.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search))

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Parents & Guardians</h1><p className="page-subtitle">Register and manage parent accounts in the system</p></div>
                    <button className="btn-primary" onClick={() => setModal('add')}><Plus size={15} /> Register Parent</button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by name or phone..." />
                    </div>
                </div>

                <div className="card p-0">
                    <table className="w-full">
                        <thead><tr>{['Parent Name', 'Linked Students', 'Contact Info', 'Balance', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{p.name.split(' ').pop()[0]}</div>
                                            <div><p className="text-sm font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-400">{p.id}</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex flex-col gap-1">
                                            {p.students.map((s, i) => <span key={i} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md w-fit">{s}</span>)}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="text-sm text-gray-600 flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {p.phone}</span>
                                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {p.email}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell"><span className={`font-semibold text-sm ${p.balance === 'UGX 0' ? 'text-emerald-600' : 'text-danger-600'}`}>{p.balance}</span></td>
                                    <td className="table-cell"><Badge variant={p.status === 'active' ? 'success' : 'gray'}>{p.status}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => { setSelected(p); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" title="View"><Eye size={14} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600" title="Edit"><Edit2 size={14} /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-100 text-red-600" title="Remove"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Register New Parent" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Register Parent</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" className="input-field" placeholder="e.g., Mary Namukasa" />
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (For MoMo / SMS)</label><input type="tel" className="input-field" placeholder="+256 700 000000" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" className="input-field" placeholder="parent@email.com" /></div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Students</label>
                        <p className="text-xs text-gray-500 mb-2">Search and select students to link to this parent account. This allows the parent to view their children's data.</p>
                        <input type="text" className="input-field mb-2" placeholder="Search student name or ID..." />
                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-500 text-center">No students selected yet.</div>
                    </div>
                    <div className="col-span-2 flex items-start gap-2 mt-2">
                        <input type="checkbox" className="mt-1" id="send_invite" defaultChecked />
                        <label htmlFor="send_invite" className="text-sm text-gray-700">Send welcome SMS/Email with login credentials immediately</label>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Parent Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">{selected.name.split(' ').pop()[0]}</div>
                            <div><p className="text-lg font-bold">{selected.name}</p><p className="text-sm text-gray-500">{selected.id}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Phone', selected.phone], ['Email', selected.email], ['Status', selected.status], ['Outstanding Balance', selected.balance]].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 p-3 rounded-xl"><p className="text-xs text-gray-500">{k}</p><p className="font-semibold mt-0.5">{v}</p></div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Linked Students</p>
                            <div className="space-y-2">
                                {selected.students.map((s, i) => (
                                    <div key={i} className="p-3 border border-gray-100 rounded-lg bg-white shadow-sm text-sm font-medium text-gray-800">{s}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
