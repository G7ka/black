import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Plus, Shield, Mail } from 'lucide-react'

const admins = [
    { id: 1, name: 'James Mugisha', email: 'james@edumanage.ug', role: 'Super Admin', lastLogin: '2026-02-22 09:12', status: 'active' },
    { id: 2, name: 'Sarah Nakato', email: 'sarah@edumanage.ug', role: 'Finance Admin', lastLogin: '2026-02-22 08:45', status: 'active' },
    { id: 3, name: 'Peter Opolot', email: 'peter@edumanage.ug', role: 'Support Agent', lastLogin: '2026-02-21 14:30', status: 'active' },
    { id: 4, name: 'Grace Auma', email: 'grace@edumanage.ug', role: 'Content Manager', lastLogin: '2026-02-20 11:00', status: 'inactive' },
]

export default function SAUsers() {
    const [modal, setModal] = useState(null)
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
                                            <button className="btn-secondary text-xs py-1 px-2"><Shield size={11} /> Permissions</button>
                                            <button className="btn-danger text-xs py-1 px-2">Remove</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                </div>
            </div>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Platform Admin"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Add Admin</button></>}>
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
        </DashboardLayout>
    )
}
