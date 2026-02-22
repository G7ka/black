import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Eye, TrendingUp, TrendingDown, ArrowUpCircle, RotateCcw } from 'lucide-react'

const students = [
    { id: 'STU-001', name: 'Ivan Namukasa', class: 'P6A', age: 12, parent: 'Mary Namukasa', phone: '+256 772 111222', performance: 82, attendance: 94, trend: 'up' },
    { id: 'STU-002', name: 'Grace Mukasa', class: 'P6A', age: 12, parent: 'John Mukasa', phone: '+256 701 222333', performance: 94, attendance: 98, trend: 'up' },
    { id: 'STU-003', name: 'David Ouma', class: 'P7B', age: 13, parent: 'Patricia Ouma', phone: '+256 785 333444', performance: 65, attendance: 87, trend: 'down' },
    { id: 'STU-004', name: 'Faith Ssali', class: 'P7B', age: 13, parent: 'Daniel Ssali', phone: '+256 754 444555', performance: 91, attendance: 92, trend: 'up' },
    { id: 'STU-005', name: 'Moses Achola', class: 'P6A', age: 12, parent: 'Helen Achola', phone: '+256 700 555666', performance: 58, attendance: 76, trend: 'down' },
    { id: 'STU-006', name: 'Ruth Nabirye', class: 'P7B', age: 13, parent: 'James Nabirye', phone: '+256 779 666777', performance: 88, attendance: 100, trend: 'up' },
    { id: 'STU-007', name: 'Samuel Kato', class: 'P7B', age: 13, parent: 'Agnes Kato', phone: '+256 755 777888', performance: 52, attendance: 82, trend: 'down' },
    { id: 'STU-008', name: 'Esther Akello', class: 'P6A', age: 12, parent: 'Peter Akello', phone: '+256 780 888999', performance: 77, attendance: 90, trend: 'up' },
]

export default function TeacherStudents() {
    const [classFilter, setClassFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [reason, setReason] = useState('')

    const classes = ['All', 'P6A', 'P7B']
    const filtered = students.filter(s =>
        (classFilter === 'All' || s.class === classFilter) &&
        (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
    )

    const open = (type, student) => { setSelected(student); setModal(type) }
    const close = () => { setModal(null); setSelected(null); setReason('') }

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="page-title">My Students</h1>
                    <p className="page-subtitle">Manage and track students in your classes</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {classes.map(c => (
                        <button key={c} onClick={() => setClassFilter(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${classFilter === c ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {c} {c !== 'All' && <span className="opacity-60 text-xs">({students.filter(s => s.class === c).length})</span>}
                        </button>
                    ))}
                    <div className="ml-auto relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-60" placeholder="Search students..." /></div>
                </div>

                <div className="card p-0">
                    <table className="w-full">
                        <thead><tr>{['Student', 'ID', 'Class', 'Parent Contact', 'Performance', 'Attendance', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                                            <p className="text-sm font-semibold">{s.name}</p>
                                        </div>
                                    </td>
                                    <td className="table-cell font-mono text-xs text-gray-500">{s.id}</td>
                                    <td className="table-cell"><Badge variant="info">{s.class}</Badge></td>
                                    <td className="table-cell text-xs text-gray-600"><p className="font-medium">{s.parent}</p><p className="text-gray-400">{s.phone}</p></td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.performance >= 80 ? 'bg-emerald-500' : s.performance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.performance}%` }} /></div>
                                            <span className="text-xs font-semibold text-gray-700 w-8">{s.performance}%</span>
                                            {s.trend === 'up' ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.attendance >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${s.attendance}%` }} /></div>
                                            <span className="text-xs text-gray-600">{s.attendance}%</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => open('view', s)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" title="View"><Eye size={14} /></button>
                                            <button onClick={() => open('promote', s)} className="btn-success text-xs py-1 px-2"><ArrowUpCircle size={12} /> Promote</button>
                                            <button onClick={() => open('repeat', s)} className="btn-danger text-xs py-1 px-2"><RotateCcw size={12} /> Repeat</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
                        <p className="text-xs text-gray-500">Showing {filtered.length} of {students.length} students</p>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            <Modal isOpen={modal === 'view'} onClose={close} title={`Student Profile — ${selected?.name}`}
                footer={<button className="btn-secondary" onClick={close}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">{selected.name[0]}</div>
                            <div><p className="text-lg font-bold text-gray-900">{selected.name}</p><p className="text-sm text-gray-500">{selected.id} · {selected.class}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[['Age', `${selected.age} years`], ['Parent', selected.parent], ['Parent Phone', selected.phone], ['Performance', `${selected.performance}%`], ['Attendance', `${selected.attendance}%`], ['Trend', selected.trend === 'up' ? '↑ Improving' : '↓ Declining']].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 p-3 rounded-xl"><p className="text-xs text-gray-500">{k}</p><p className="font-semibold mt-0.5 text-sm">{v}</p></div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Promote Modal */}
            <Modal isOpen={modal === 'promote'} onClose={close} title={`Promote ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={close}>Cancel</button><button className="btn-success" onClick={close}><ArrowUpCircle size={14} /> Confirm Promotion</button></>}>
                <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-sm font-semibold text-emerald-800">{selected?.name} — {selected?.class}</p>
                        <p className="text-xs text-emerald-600 mt-1">Will be promoted to: <strong>{selected?.class === 'P6A' ? 'P7' : 'S1 (Graduated)'}</strong></p>
                    </div>
                    <p className="text-sm text-gray-600">Current performance: <span className="font-semibold text-emerald-700">{selected?.performance}%</span> — meets promotion criteria.</p>
                </div>
            </Modal>

            {/* Repeat Modal */}
            <Modal isOpen={modal === 'repeat'} onClose={close} title={`Mark as Repeat — ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={close}>Cancel</button><button className="btn-danger" onClick={close}><RotateCcw size={14} /> Confirm Repeat</button></>}>
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800">⚠ {selected?.name} will repeat class <strong>{selected?.class}</strong> next term.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Repeating <span className="text-red-500">*</span></label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} className="input-field resize-none" rows={3} placeholder="e.g., Failed to meet minimum score of 50%. Struggles with core Mathematics concepts." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Support Plan</label>
                        <textarea className="input-field resize-none" rows={2} placeholder="e.g., Enroll in remedial Mathematics classes..." />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
