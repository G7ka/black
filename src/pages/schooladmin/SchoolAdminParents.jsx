import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Trash2, Mail, Phone, Save, CheckCircle2, Clock, CheckCircle, UserX } from 'lucide-react'

const initialParents = [
    { id: 'PAR-001', name: 'Mary Namukasa', students: ['Ivan Namukasa (P6)', 'Sarah Namukasa (P3)'], phone: '+256 772 111222', email: 'mary.n@email.com', status: 'active', balance: 'UGX 365,000', leaveReason: '', leaveReturn: '', leaveNotes: '' },
    { id: 'PAR-002', name: 'John Mukasa', students: ['Peter Mukasa (P7)'], phone: '+256 752 333444', email: 'john.m@email.com', status: 'active', balance: 'UGX 0', leaveReason: '', leaveReturn: '', leaveNotes: '' },
    { id: 'PAR-003', name: 'Alice Kemigisha', students: ['Paul Kisa (P4)'], phone: '+256 701 555666', email: 'alice.k@email.com', status: 'inactive', balance: 'UGX 120,000', leaveReason: 'Relocated', leaveReturn: '', leaveNotes: 'Moved to Jinja' },
    { id: 'PAR-004', name: 'David Opio', students: ['Daniel Opio (P1)', 'Esther Opio (P2)'], phone: '+256 780 777888', email: 'david.o@email.com', status: 'active', balance: 'UGX 0', leaveReason: '', leaveReturn: '', leaveNotes: '' },
]

const parentLeaveReasons = ['Traveling', 'Relocated', 'Unavailable', 'Medical', 'Work Assignment', 'Other']

export default function SchoolAdminParents({ role = 'schooladmin-primary' }) {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [parents, setParents] = useState(initialParents)
    const [successMsg, setSuccessMsg] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    // Edit form state
    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editEmail, setEditEmail] = useState('')

    // Add form state
    const [addName, setAddName] = useState('')
    const [addPhone, setAddPhone] = useState('')
    const [addEmail, setAddEmail] = useState('')

    // Leave/inactive form state
    const [leaveReason, setLeaveReason] = useState('')
    const [leaveReturn, setLeaveReturn] = useState('')
    const [leaveNotes, setLeaveNotes] = useState('')

    const filtered = parents.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
        const matchesFilter = statusFilter === 'All' || (statusFilter === 'Active' && p.status === 'active') || (statusFilter === 'Inactive' && (p.status === 'inactive' || p.status === 'on-leave'))
        return matchesSearch && matchesFilter
    })

    const openEdit = (p) => {
        setSelected(p)
        setEditName(p.name)
        setEditPhone(p.phone)
        setEditEmail(p.email)
        setModal('edit')
    }

    const saveEdit = () => {
        setParents(prev => prev.map(p => p.id === selected.id ? { ...p, name: editName, phone: editPhone, email: editEmail } : p))
        setModal(null)
        setSuccessMsg('Parent updated successfully!')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const deleteParent = (parent) => {
        if (window.confirm(`Remove ${parent.name} from the system? This will unlink their student accounts.`)) {
            setParents(prev => prev.filter(p => p.id !== parent.id))
            setSuccessMsg(`${parent.name} removed.`)
            setTimeout(() => setSuccessMsg(''), 3000)
        }
    }

    const addParent = () => {
        if (!addName.trim() || !addPhone.trim()) return
        const newParent = {
            id: `PAR-${String(parents.length + 5).padStart(3, '0')}`,
            name: addName, students: [], phone: addPhone, email: addEmail,
            status: 'active', balance: 'UGX 0', leaveReason: '', leaveReturn: '', leaveNotes: '',
        }
        setParents([...parents, newParent])
        setAddName(''); setAddPhone(''); setAddEmail('')
        setModal(null)
        setSuccessMsg('Parent registered successfully!')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const openLeaveModal = (p) => {
        setSelected(p)
        setLeaveReason(p.leaveReason || 'Traveling')
        setLeaveReturn(p.leaveReturn || '')
        setLeaveNotes(p.leaveNotes || '')
        setModal('leave')
    }

    const saveLeave = () => {
        setParents(prev => prev.map(p => p.id === selected.id ? { ...p, status: 'on-leave', leaveReason, leaveReturn, leaveNotes } : p))
        setModal(null)
        setSuccessMsg(`${selected.name} marked as on leave/inactive.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    const markActive = (p) => {
        setParents(prev => prev.map(par => par.id === p.id ? { ...par, status: 'active', leaveReason: '', leaveReturn: '', leaveNotes: '' } : par))
        setSuccessMsg(`${p.name} is now active.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative">

                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div><h1 className="page-title">Parents & Guardians</h1><p className="page-subtitle">Register and manage parent accounts in the system</p></div>
                    <button className="btn-primary" onClick={() => { setAddName(''); setAddPhone(''); setAddEmail(''); setModal('add') }}><Plus size={15} /> Register Parent</button>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by name or phone..." />
                    </div>
                    <div className="flex items-center gap-2">
                        {['All', 'Active', 'Inactive'].map(f => (
                            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 ring-1 ring-primary-300' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}>{f}</button>
                        ))}
                        <span className="text-sm text-gray-500 dark:text-slate-400 font-medium ml-2">{filtered.length} parents</span>
                    </div>
                </div>

                <div className="card p-0">
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Parent Name', 'Linked Students', 'Contact Info', 'Balance', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{p.name.split(' ').pop()[0]}</div>
                                            <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p><p className="text-xs text-gray-400 dark:text-slate-500">{p.id}</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex flex-col gap-1">
                                            {p.students.length > 0 ? p.students.map((s, i) => <span key={i} className="text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md w-fit">{s}</span>) : <span className="text-xs text-gray-400 dark:text-slate-500 italic">No students linked</span>}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="text-sm text-gray-600 dark:text-slate-300 flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400 dark:text-slate-500" /> {p.phone}</span>
                                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400 dark:text-slate-500" /> {p.email}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell"><span className={`font-semibold text-sm ${p.balance === 'UGX 0' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{p.balance}</span></td>
                                    <td className="table-cell"><Badge variant={p.status === 'active' ? 'success' : p.status === 'on-leave' ? 'warning' : 'gray'}>{p.status === 'on-leave' ? 'On Leave' : p.status}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1 flex-wrap">
                                            <button onClick={() => { setSelected(p); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="View"><Eye size={14} /></button>
                                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400" title="Edit"><Edit2 size={14} /></button>
                                            {p.status === 'active' ? (
                                                <button onClick={() => openLeaveModal(p)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold hover:shadow-sm transition-all" title="Set Inactive/Leave"><UserX size={12} /> Leave</button>
                                            ) : (
                                                <button onClick={() => markActive(p)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold hover:shadow-sm transition-all"><CheckCircle size={12} /> Activate</button>
                                            )}
                                            <button onClick={() => deleteParent(p)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400" title="Remove"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                    {filtered.length === 0 && <div className="p-8 text-center text-gray-400 dark:text-slate-500">No parents found.</div>}
                </div>
            </div>

            {/* Leave/Inactive Modal */}
            <Modal isOpen={modal === 'leave'} onClose={() => setModal(null)} title={`Set Leave/Inactive: ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={saveLeave}><UserX size={14} /> Confirm</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-slate-300">Mark <strong className="text-gray-900 dark:text-white">{selected.name}</strong> as on leave or inactive. They will be flagged in the system until reactivated.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Reason</label>
                            <select className="select-field" value={leaveReason} onChange={e => setLeaveReason(e.target.value)}>
                                {parentLeaveReasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Expected Return Date (optional)</label>
                            <input type="date" className="input-field" value={leaveReturn} onChange={e => setLeaveReturn(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Notes (optional)</label>
                            <textarea className="input-field resize-none" rows={2} value={leaveNotes} onChange={e => setLeaveNotes(e.target.value)} placeholder="e.g., Will be out of the country until next term..." />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Parent Modal */}
            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Register New Parent" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={addParent} disabled={!addName.trim() || !addPhone.trim()}><Plus size={14} /> Register Parent</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name *</label>
                        <input type="text" className="input-field" placeholder="e.g., Mary Namukasa" value={addName} onChange={e => setAddName(e.target.value)} />
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number *</label><input type="tel" className="input-field" placeholder="+256 700 000000" value={addPhone} onChange={e => setAddPhone(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address</label><input type="email" className="input-field" placeholder="parent@email.com" value={addEmail} onChange={e => setAddEmail(e.target.value)} /></div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Link Students</label>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Search and select students to link to this parent account.</p>
                        <input type="text" className="input-field mb-2" placeholder="Search student name or ID..." />
                        <div className="p-3 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-lg text-sm text-gray-500 dark:text-slate-400 text-center">No students selected yet.</div>
                    </div>
                    <div className="col-span-2 flex items-start gap-2 mt-2">
                        <input type="checkbox" className="mt-1" id="send_invite" defaultChecked />
                        <label htmlFor="send_invite" className="text-sm text-gray-700 dark:text-slate-200">Send welcome SMS/Email with login credentials immediately</label>
                    </div>
                </div>
            </Modal>

            {/* Edit Parent Modal */}
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Edit Parent Details"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={saveEdit}><Save size={14} /> Save Changes</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name</label><input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number</label><input className="input-field" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address</label><input className="input-field" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></div>
                </div>
            </Modal>

            {/* View Parent Modal */}
            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Parent Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">{selected.name.split(' ').pop()[0]}</div>
                            <div><p className="text-lg font-bold dark:text-white">{selected.name}</p><p className="text-sm text-gray-500 dark:text-slate-400">{selected.id}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Phone', selected.phone], ['Email', selected.email], ['Status', selected.status === 'on-leave' ? 'On Leave' : selected.status], ['Outstanding Balance', selected.balance]].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-xl"><p className="text-xs text-gray-500 dark:text-slate-400">{k}</p><p className="font-semibold mt-0.5 dark:text-white">{v}</p></div>
                            ))}
                        </div>
                        {(selected.status === 'on-leave' || selected.status === 'inactive') && selected.leaveReason && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">Leave/Inactive Details</p>
                                <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Reason:</strong> {selected.leaveReason}</p>
                                {selected.leaveReturn && <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Expected Return:</strong> {selected.leaveReturn}</p>}
                                {selected.leaveNotes && <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">{selected.leaveNotes}</p>}
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">Linked Students</p>
                            <div className="space-y-2">
                                {selected.students.length > 0 ? selected.students.map((s, i) => (
                                    <div key={i} className="p-3 border border-gray-100 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-sm font-medium text-gray-800 dark:text-slate-200">{s}</div>
                                )) : <p className="text-sm text-gray-400 dark:text-slate-500 italic">No students linked yet.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
