import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Plus, Shield, Mail, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

const initialAdmins = [
    { id: 1, name: 'James Mugisha', email: 'james@edumanage.ug', role: 'Super Admin', lastLogin: '2026-02-22 09:12', status: 'active', permissions: { schools: true, subscriptions: true, analytics: true, support: true, configuration: true, monitoring: true, devtools: true, emergency: true, users: true } },
    { id: 2, name: 'Sarah Nakato', email: 'sarah@edumanage.ug', role: 'Finance Admin', lastLogin: '2026-02-22 08:45', status: 'active', permissions: { schools: true, subscriptions: true, analytics: true, support: false, configuration: false, monitoring: false, devtools: false, emergency: false, users: false } },
    { id: 3, name: 'Peter Opolot', email: 'peter@edumanage.ug', role: 'Support Agent', lastLogin: '2026-02-21 14:30', status: 'active', permissions: { schools: true, subscriptions: false, analytics: false, support: true, configuration: false, monitoring: true, devtools: false, emergency: false, users: false } },
    { id: 4, name: 'Grace Auma', email: 'grace@edumanage.ug', role: 'Content Manager', lastLogin: '2026-02-20 11:00', status: 'inactive', permissions: { schools: true, subscriptions: false, analytics: true, support: false, configuration: false, monitoring: false, devtools: false, emergency: false, users: false } },
]

const permissionLabels = {
    schools: 'Schools Management',
    subscriptions: 'Subscriptions & Billing',
    analytics: 'Analytics & Reports',
    support: 'Support & Helpdesk',
    configuration: 'Platform Configuration',
    monitoring: 'System Monitoring',
    devtools: 'Developer Tools',
    emergency: 'Emergency Controls',
    users: 'User Management',
}

export default function SAUsers() {
    const [admins, setAdmins] = useState(initialAdmins)
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [editPerms, setEditPerms] = useState({})
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const openPermissions = (admin) => {
        setSelected(admin)
        setEditPerms({ ...admin.permissions })
        setModal('permissions')
    }

    const savePermissions = () => {
        setAdmins(prev => prev.map(a => a.id === selected.id ? { ...a, permissions: { ...editPerms } } : a))
        showToast(`Permissions updated for ${selected.name}`)
        setModal(null)
        setSelected(null)
    }

    const openRemove = (admin) => {
        setSelected(admin)
        setModal('remove')
    }

    const confirmRemove = () => {
        const name = selected.name
        setAdmins(prev => prev.filter(a => a.id !== selected.id))
        showToast(`${name} has been removed from the platform`, 'danger')
        setModal(null)
        setSelected(null)
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Platform Admin</h1><p className="page-subtitle">Manage the Super Admin team members</p></div>
                    <button className="btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Admin</button>
                </div>

                <div className="card">
                    <h2 className="section-title">Admin Team</h2>
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Name', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {admins.map(a => (
                                <tr key={a.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{a.name[0]}</div>
                                            <span className="font-semibold text-gray-900 dark:text-white">{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-gray-500 dark:text-slate-400 text-xs">{a.email}</td>
                                    <td className="table-cell"><Badge variant={a.role === 'Super Admin' ? 'purple' : a.role === 'Finance Admin' ? 'info' : 'gray'}>{a.role}</Badge></td>
                                    <td className="table-cell text-gray-500 dark:text-slate-400 text-xs">{a.lastLogin}</td>
                                    <td className="table-cell"><Badge variant={a.status === 'active' ? 'success' : 'gray'}>{a.status}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => openPermissions(a)} className="btn-secondary text-xs py-1 px-2"><Shield size={11} /> Permissions</button>
                                            <button onClick={() => openRemove(a)} className="btn-danger text-xs py-1 px-2"><Trash2 size={11} /> Remove</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr><td colSpan={6} className="table-cell text-center text-gray-400 dark:text-slate-500 py-8">No admins found.</td></tr>
                            )}
                        </tbody>
                    </table></div>
                </div>
            </div>

            {/* Add Admin Modal */}
            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Platform Admin"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => { showToast('New admin added successfully'); setModal(null) }}><Plus size={14} /> Add Admin</button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name</label><input className="input-field" placeholder="John Doe" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label><input className="input-field" type="email" placeholder="john@edumanage.ug" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Role</label>
                        <select className="select-field">
                            <option>Super Admin</option><option>Finance Admin</option><option>Support Agent</option><option>Content Manager</option>
                        </select>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300"><Mail size={12} className="inline mr-1" />A welcome email with login credentials will be sent automatically.</div>
                </div>
            </Modal>

            {/* Permissions Modal */}
            <Modal isOpen={modal === 'permissions'} onClose={() => { setModal(null); setSelected(null) }} title={`Permissions — ${selected?.name}`} size="md"
                footer={<><button className="btn-secondary" onClick={() => { setModal(null); setSelected(null) }}>Cancel</button><button className="btn-primary" onClick={savePermissions}><Shield size={14} /> Save Permissions</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">{selected.name[0]}</div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selected.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{selected.role} · {selected.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Module Access</p>
                            {Object.entries(permissionLabels).map(([key, label]) => (
                                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                    <span className="text-sm text-gray-700 dark:text-slate-300">{label}</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={editPerms[key] || false}
                                            onChange={e => setEditPerms(p => ({ ...p, [key]: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-gray-200 dark:bg-slate-600 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Remove Admin Modal */}
            <Modal isOpen={modal === 'remove'} onClose={() => { setModal(null); setSelected(null) }} title="Remove Admin"
                footer={<><button className="btn-secondary" onClick={() => { setModal(null); setSelected(null) }}>Cancel</button><button className="btn-danger" onClick={confirmRemove}><Trash2 size={14} /> Remove Admin</button></>}>
                {selected && (
                    <div className="space-y-4">
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
                                <p className="text-xs text-gray-500 dark:text-slate-400">{selected.role} · Last active: {selected.lastLogin}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all animate-slide-up ${toast.type === 'danger' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                    {toast.type === 'danger' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                    {toast.msg}
                </div>
            )}
        </DashboardLayout>
    )
}
