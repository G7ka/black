import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Plus, Mail, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { platformAdminsApi } from '../../api/platformAdmins.api'

const roleBadge = { SUPER_ADMIN: 'purple', FINANCE_ADMIN: 'info', SUPPORT_AGENT: 'gray', CONTENT_MANAGER: 'gray' }
const roleLabel = { SUPER_ADMIN: 'Super Admin', FINANCE_ADMIN: 'Finance Admin', SUPPORT_AGENT: 'Support Agent', CONTENT_MANAGER: 'Content Manager' }

export default function SAUsers() {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [toast, setToast] = useState(null)
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [form, setForm] = useState({ name: '', email: '', role: 'SUPPORT_AGENT' })

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            setAdmins(await platformAdminsApi.list())
        } catch (err) {
            setLoadError(err.message || 'Failed to load admins')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const openRemove = (admin) => { setSelected(admin); setModal('remove'); setActionError('') }

    const confirmRemove = async () => {
        setActionLoading(true)
        setActionError('')
        try {
            await platformAdminsApi.remove(selected.id)
            showToast(`${selected.name} has been removed from the platform`, 'danger')
            setModal(null)
            setSelected(null)
            await load()
        } catch (err) {
            setActionError(err.message || 'Failed to remove admin')
        } finally {
            setActionLoading(false)
        }
    }

    const addAdmin = async () => {
        setActionLoading(true)
        setActionError('')
        try {
            await platformAdminsApi.create(form)
            showToast('New admin added successfully — a set-password code was emailed to them')
            setModal(null)
            setForm({ name: '', email: '', role: 'SUPPORT_AGENT' })
            await load()
        } catch (err) {
            setActionError(err.message || 'Failed to add admin')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Platform Admin</h1><p className="page-subtitle">Manage the Super Admin team members</p></div>
                    <button className="btn-primary" onClick={() => { setModal('add'); setActionError('') }}><Plus size={16} /> Add Admin</button>
                </div>

                {loadError && <p className="text-sm text-red-600">{loadError}</p>}

                <div className="card">
                    <h2 className="section-title">Admin Team</h2>
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Name', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {loading && <tr><td colSpan={6} className="table-cell text-center text-gray-400 py-8">Loading…</td></tr>}
                            {!loading && admins.map(a => (
                                <tr key={a.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{a.name[0]}</div>
                                            <span className="font-semibold text-gray-900 dark:text-white">{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-gray-500 dark:text-slate-400 text-xs">{a.email}</td>
                                    <td className="table-cell"><Badge variant={roleBadge[a.role]}>{roleLabel[a.role]}</Badge></td>
                                    <td className="table-cell text-gray-500 dark:text-slate-400 text-xs">{a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString() : 'Never'}</td>
                                    <td className="table-cell"><Badge variant={a.status === 'ACTIVE' ? 'success' : 'gray'}>{a.status.toLowerCase()}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => openRemove(a)} className="btn-danger text-xs py-1 px-2"><Trash2 size={11} /> Remove</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && admins.length === 0 && (
                                <tr><td colSpan={6} className="table-cell text-center text-gray-400 dark:text-slate-500 py-8">No admins found.</td></tr>
                            )}
                        </tbody>
                    </table></div>
                </div>
            </div>

            {/* Add Admin Modal */}
            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Platform Admin"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={addAdmin}><Plus size={14} /> {actionLoading ? 'Adding…' : 'Add Admin'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name</label><input className="input-field" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label><input className="input-field" type="email" placeholder="john@edumanage.ug" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Role</label>
                        <select className="select-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="FINANCE_ADMIN">Finance Admin</option>
                            <option value="SUPPORT_AGENT">Support Agent</option>
                            <option value="CONTENT_MANAGER">Content Manager</option>
                        </select>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300"><Mail size={12} className="inline mr-1" />A set-password code will be emailed automatically — no password is created here.</div>
                </div>
            </Modal>

            {/* Remove Admin Modal */}
            <Modal isOpen={modal === 'remove'} onClose={() => { setModal(null); setSelected(null) }} title="Remove Admin"
                footer={<><button className="btn-secondary" onClick={() => { setModal(null); setSelected(null) }}>Cancel</button><button disabled={actionLoading} className="btn-danger" onClick={confirmRemove}><Trash2 size={14} /> {actionLoading ? 'Removing…' : 'Remove Admin'}</button></>}>
                {selected && (
                    <div className="space-y-4">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                            <AlertTriangle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">This action cannot be undone</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                            Are you sure you want to remove <strong>{selected.name}</strong> ({selected.email}) from the platform?
                            They will immediately lose access to all admin functions.
                        </p>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">{selected.name[0]}</div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selected.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{roleLabel[selected.role]}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all animate-slide-up ${toast.type === 'danger' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                    {toast.type === 'danger' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                    {toast.msg}
                </div>
            )}
        </DashboardLayout>
    )
}
