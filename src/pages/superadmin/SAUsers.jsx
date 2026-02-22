import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { LineChart } from '../../components/charts/Charts'
import { Plus, Users, Mail, Shield, MoreHorizontal, UserCheck } from 'lucide-react'

const admins = [
    { id: 1, name: 'James Mugisha', email: 'james@edumanage.ug', role: 'Super Admin', lastLogin: '2026-02-22 09:12', status: 'active' },
    { id: 2, name: 'Sarah Nakato', email: 'sarah@edumanage.ug', role: 'Finance Admin', lastLogin: '2026-02-22 08:45', status: 'active' },
    { id: 3, name: 'Peter Opolot', email: 'peter@edumanage.ug', role: 'Support Agent', lastLogin: '2026-02-21 14:30', status: 'active' },
    { id: 4, name: 'Grace Auma', email: 'grace@edumanage.ug', role: 'Marketing', lastLogin: '2026-02-20 11:00', status: 'inactive' },
]

const userGrowthData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'Teachers', data: [2800, 3100, 3350, 3600, 3900, 4050, 4218], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#3b82f6' },
        { label: 'Students (÷10)', data: [4200, 4800, 5300, 5800, 6200, 6600, 6843], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#10b981' },
    ],
}

export default function SAUsers() {
    const [modal, setModal] = useState(null)
    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Platform Users</h1><p className="page-subtitle">Manage the Super Admin team and view platform-wide user stats</p></div>
                    <button className="btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Admin</button>
                </div>

                <div className="card">
                    <h2 className="section-title">Super Admin Team</h2>
                    <table className="w-full">
                        <thead><tr>{['Name', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {admins.map(a => (
                                <tr key={a.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{a.name[0]}</div>
                                            <span className="font-semibold">{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-gray-500 text-xs">{a.email}</td>
                                    <td className="table-cell"><Badge variant={a.role === 'Super Admin' ? 'purple' : a.role === 'Finance Admin' ? 'info' : 'gray'}>{a.role}</Badge></td>
                                    <td className="table-cell text-gray-500 text-xs">{a.lastLogin}</td>
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
                    </table>
                </div>

                <div className="card"><h2 className="section-title">Platform User Growth</h2><LineChart data={userGrowthData} height={260} /></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Teachers', value: '4,218', icon: Users, color: 'bg-blue-100 text-blue-600' },
                        { label: 'Total Students', value: '68,430', icon: UserCheck, color: 'bg-emerald-100 text-emerald-600' },
                        { label: 'Total Parents', value: '41,200', icon: Users, color: 'bg-violet-100 text-violet-600' },
                    ].map(s => (
                        <div key={s.label} className="card flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${s.color}`}><s.icon size={24} /></div>
                            <div><p className="text-xs text-gray-500 font-medium">{s.label}</p><p className="text-2xl font-bold text-gray-900">{s.value}</p></div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Platform Admin"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Add Admin</button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input className="input-field" placeholder="John Doe" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input className="input-field" type="email" placeholder="john@edumanage.ug" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select className="select-field">
                            <option>Super Admin</option><option>Finance Admin</option><option>Support Agent</option><option>Marketing</option>
                        </select>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700"><Mail size={12} className="inline mr-1" />A welcome email with login credentials will be sent automatically.</div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
