import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Mail, Phone, Save, CheckCircle2, CheckCircle, UserX, AlertCircle } from 'lucide-react'
import { parentsApi } from '../../api/parents.api'

const parentLeaveReasons = ['Traveling', 'Relocated', 'Unavailable', 'Medical', 'Work Assignment', 'Other']

export default function SchoolAdminParents({ role = 'schooladmin-primary' }) {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [parents, setParents] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editEmail, setEditEmail] = useState('')

    const [addName, setAddName] = useState('')
    const [addPhone, setAddPhone] = useState('')
    const [addEmail, setAddEmail] = useState('')

    const [leaveReason, setLeaveReason] = useState('')
    const [leaveReturn, setLeaveReturn] = useState('')
    const [leaveNotes, setLeaveNotes] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            setParents(await parentsApi.list({ search: search || undefined, status: statusFilter === 'All' ? undefined : statusFilter }))
        } catch (err) {
            setLoadError(err.message || 'Failed to load parents')
        } finally {
            setLoading(false)
        }
    }, [search, statusFilter])

    useEffect(() => { load() }, [load])

    const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

    const openEdit = (p) => {
        setSelected(p); setEditName(p.fullName); setEditPhone(p.phone); setEditEmail(p.email || ''); setModal('edit'); setActionError('')
    }

    const saveEdit = async () => {
        setActionLoading(true); setActionError('')
        try {
            await parentsApi.update(selected.id, { fullName: editName, phone: editPhone, email: editEmail || undefined })
            setModal(null); flash('Parent updated successfully!'); await load()
        } catch (err) { setActionError(err.message || 'Failed to update parent') } finally { setActionLoading(false) }
    }

    const addParent = async () => {
        if (!addName.trim() || !addPhone.trim()) return
        setActionLoading(true); setActionError('')
        try {
            await parentsApi.create({ fullName: addName, phone: addPhone, email: addEmail || undefined })
            setAddName(''); setAddPhone(''); setAddEmail('')
            setModal(null); flash('Parent registered successfully!'); await load()
        } catch (err) { setActionError(err.message || 'Failed to register parent') } finally { setActionLoading(false) }
    }

    const openLeaveModal = (p) => {
        setSelected(p); setLeaveReason('Traveling'); setLeaveReturn(''); setLeaveNotes(''); setModal('leave'); setActionError('')
    }

    const saveLeave = async () => {
        setActionLoading(true); setActionError('')
        try {
            await parentsApi.setInactive(selected.id, { inactiveReason: leaveReason, inactiveReturn: leaveReturn || undefined, inactiveNotes: leaveNotes || undefined })
            setModal(null); flash(`${selected.fullName} marked as on leave/inactive.`); await load()
        } catch (err) { setActionError(err.message || 'Failed to update status') } finally { setActionLoading(false) }
    }

    const markActive = async (p) => {
        setActionError('')
        try {
            await parentsApi.setActive(p.id)
            flash(`${p.fullName} is now active.`); await load()
        } catch (err) { setActionError(err.message || 'Failed to activate parent') }
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
                    <button className="btn-primary" onClick={() => { setAddName(''); setAddPhone(''); setAddEmail(''); setModal('add'); setActionError('') }}><Plus size={15} /> Register Parent</button>
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
                        <span className="text-sm text-gray-500 dark:text-slate-400 font-medium ml-2">{parents.length} parents</span>
                    </div>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                <div className="card p-0">
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Parent Name', 'Linked Students', 'Contact Info', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {loading && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">Loading…</td></tr>}
                            {!loading && parents.map(p => (
                                <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{p.fullName.split(' ').pop()[0]}</div>
                                            <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{p.fullName}</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex flex-col gap-1">
                                            {p.students.length > 0 ? p.students.map((s) => <span key={s.id} className="text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md w-fit">{s.fullName}</span>) : <span className="text-xs text-gray-400 dark:text-slate-500 italic">No students linked</span>}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="text-sm text-gray-600 dark:text-slate-300 flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400 dark:text-slate-500" /> {p.phone}</span>
                                            {p.email && <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400 dark:text-slate-500" /> {p.email}</span>}
                                        </div>
                                    </td>
                                    <td className="table-cell"><Badge variant={p.status === 'ACTIVE' ? 'success' : 'gray'}>{p.status === 'ACTIVE' ? 'active' : 'inactive'}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1 flex-wrap">
                                            <button onClick={() => { setSelected(p); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="View"><Eye size={14} /></button>
                                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400" title="Edit"><Edit2 size={14} /></button>
                                            {p.status === 'ACTIVE' ? (
                                                <button onClick={() => openLeaveModal(p)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold hover:shadow-sm transition-all" title="Set Inactive/Leave"><UserX size={12} /> Leave</button>
                                            ) : (
                                                <button onClick={() => markActive(p)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold hover:shadow-sm transition-all"><CheckCircle size={12} /> Activate</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                    {!loading && parents.length === 0 && <div className="p-8 text-center text-gray-400 dark:text-slate-500">No parents found.</div>}
                </div>
            </div>

            <Modal isOpen={modal === 'leave'} onClose={() => setModal(null)} title={`Set Leave/Inactive: ${selected?.fullName}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveLeave}><UserX size={14} /> {actionLoading ? 'Saving…' : 'Confirm'}</button></>}>
                {selected && (
                    <div className="space-y-4">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <p className="text-sm text-gray-600 dark:text-slate-300">Mark <strong className="text-gray-900 dark:text-white">{selected.fullName}</strong> as on leave or inactive.</p>
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
                            <textarea className="input-field resize-none" rows={2} value={leaveNotes} onChange={e => setLeaveNotes(e.target.value)} />
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Register New Parent" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={addParent} disabled={actionLoading || !addName.trim() || !addPhone.trim()}><Plus size={14} /> {actionLoading ? 'Registering…' : 'Register Parent'}</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    {actionError && <p className="col-span-2 text-sm text-red-600">{actionError}</p>}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name *</label>
                        <input type="text" className="input-field" placeholder="e.g., Mary Namukasa" value={addName} onChange={e => setAddName(e.target.value)} />
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number *</label><input type="tel" className="input-field" placeholder="+256 700 000000" value={addPhone} onChange={e => setAddPhone(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address</label><input type="email" className="input-field" placeholder="parent@email.com" value={addEmail} onChange={e => setAddEmail(e.target.value)} /></div>
                    <div className="col-span-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                        Linking students to a parent happens automatically during student enrollment. To link an existing parent to another student, use the "Enroll Student" form with the same parent email.
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Edit Parent Details"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveEdit}><Save size={14} /> {actionLoading ? 'Saving…' : 'Save Changes'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name</label><input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number</label><input className="input-field" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address</label><input className="input-field" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Parent Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">{selected.fullName.split(' ').pop()[0]}</div>
                            <div><p className="text-lg font-bold dark:text-white">{selected.fullName}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Phone', selected.phone], ['Email', selected.email || '—'], ['Status', selected.status === 'ACTIVE' ? 'Active' : 'Inactive']].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-xl"><p className="text-xs text-gray-500 dark:text-slate-400">{k}</p><p className="font-semibold mt-0.5 dark:text-white">{v}</p></div>
                            ))}
                        </div>
                        {selected.status !== 'ACTIVE' && selected.inactiveReason && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">Leave/Inactive Details</p>
                                <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Reason:</strong> {selected.inactiveReason}</p>
                                {selected.inactiveReturn && <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Expected Return:</strong> {new Date(selected.inactiveReturn).toLocaleDateString()}</p>}
                                {selected.inactiveNotes && <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">{selected.inactiveNotes}</p>}
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">Linked Students</p>
                            <div className="space-y-2">
                                {selected.students.length > 0 ? selected.students.map((s) => (
                                    <div key={s.id} className="p-3 border border-gray-100 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-sm font-medium text-gray-800 dark:text-slate-200">{s.fullName}</div>
                                )) : <p className="text-sm text-gray-400 dark:text-slate-500 italic">No students linked yet.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
