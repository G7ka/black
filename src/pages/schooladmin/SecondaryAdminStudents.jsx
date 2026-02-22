import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, TrendingUp, TrendingDown, Upload, Filter, Zap, CheckSquare } from 'lucide-react'

const students = [
    { id: 'STU-001', name: 'Ivan Namukasa', class: 'P7', age: 13, parent: 'Mary Namukasa', phone: '+256 772 111222', performance: 82, attendance: 94, fees: 'paid' },
    { id: 'STU-002', name: 'Grace Mukasa', class: 'P6', age: 12, parent: 'John Mukasa', phone: '+256 701 222333', performance: 91, attendance: 98, fees: 'paid' },
    { id: 'STU-003', name: 'David Ouma', class: 'P5', age: 11, parent: 'Patricia Ouma', phone: '+256 785 333444', performance: 65, attendance: 87, fees: 'partial' },
    { id: 'STU-004', name: 'Faith Ssali', class: 'P4', age: 10, parent: 'Daniel Ssali', phone: '+256 754 444555', performance: 78, attendance: 92, fees: 'overdue' },
    { id: 'STU-005', name: 'Moses Achola', class: 'P7', age: 13, parent: 'Helen Achola', phone: '+256 700 555666', performance: 55, attendance: 76, fees: 'paid' },
    { id: 'STU-006', name: 'Ruth Nabirye', class: 'P3', age: 9, parent: 'James Nabirye', phone: '+256 779 666777', performance: 88, attendance: 100, fees: 'paid' },
]

export default function SecondaryAdminStudents() {
    const [classFilter, setClassFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const classes = ['All', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']
    const filtered = students.filter(s => (classFilter === 'All' || s.class === classFilter) && (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)))

    const openAutoPromote = () => setModal('autopromote')

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Students</h1><p className="page-subtitle">Manage all enrolled students</p></div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('import')}><Upload size={15} /> Import</button>
                        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2" onClick={openAutoPromote}><Zap size={15} /> Auto-Promote</button>
                        <button className="btn-primary" onClick={() => setModal('enroll')}><Plus size={15} /> Enroll</button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {classes.map(c => (
                        <button key={c} onClick={() => setClassFilter(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${classFilter === c ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{c}</button>
                    ))}
                    <div className="ml-auto relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-60" placeholder="Search students..." /></div>
                </div>

                <div className="card p-0">
                    <table className="w-full">
                        <thead><tr>{['Student', 'ID', 'Class', 'Parent Contact', 'Performance', 'Fees', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                                            <div><p className="text-sm font-semibold">{s.name}</p><p className="text-xs text-gray-400">{s.age} yrs</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell font-mono text-xs text-gray-500">{s.id}</td>
                                    <td className="table-cell"><Badge variant="info">{s.class}</Badge></td>
                                    <td className="table-cell text-xs text-gray-600"><p>{s.parent}</p><p className="text-gray-400">{s.phone}</p></td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.performance >= 80 ? 'bg-emerald-500' : s.performance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.performance}%` }} /></div>
                                            <span className="text-xs font-semibold text-gray-700">{s.performance}%</span>
                                            {s.performance >= 80 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
                                        </div>
                                    </td>
                                    <td className="table-cell"><Badge variant={s.fees === 'paid' ? 'success' : s.fees === 'partial' ? 'warning' : 'danger'}>{s.fees}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => { setSelected(s); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"><Eye size={14} /></button>
                                            <button onClick={() => { setSelected(s); setModal('promote') }} className="btn-primary text-xs py-1 px-2">Promote</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
                        <p className="text-xs text-gray-500">{filtered.length} students</p>
                        <div className="flex gap-2"><button className="btn-secondary text-xs py-1 px-3">Previous</button><button className="btn-primary text-xs py-1 px-3">Next</button></div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'promote'} onClose={() => setModal(null)} title={`Promote / Repeat — ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-success" onClick={() => setModal(null)}>Promote to Next Class</button><button className="btn-danger" onClick={() => setModal(null)}>Mark as Repeat</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-xl"><p className="text-sm font-semibold">Current Class: <span className="text-primary-600">{selected.class}</span> → Next: <span className="text-emerald-600">{selected.class === 'P7' ? 'Graduated' : selected.class.replace(/\d/, d => +d + 1)}</span></p></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Reason if repeating</label><textarea className="input-field resize-none" rows={3} placeholder="e.g., Did not meet the minimum score threshold..." /></div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'autopromote'} onClose={() => setModal(null)} title="Auto-Promote Students" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors" onClick={() => setModal(null)}><CheckSquare size={16} /> Confirm Auto-Promotion</button></>}>
                <div className="space-y-5">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                        <h4 className="font-bold text-emerald-800 flex items-center gap-2"><Zap size={18} /> System Auto-Promotion</h4>
                        <p className="text-sm text-emerald-700 mt-1">
                            The system will automatically promote all students with an average performance score of <strong>40% or higher</strong> to the next class level, according to the standard Ugandan curriculum passing threshold. Students below 40% will be marked to repeat.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                            <h3 className="font-semibold text-gray-900">Promotion Preview</h3>
                            <select className="select-field w-auto py-1.5 text-xs"><option>All Classes</option><option>P6 only</option></select>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                    <tr><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-center">Score</th><th className="px-4 py-3 text-left">Action</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map(s => {
                                        const isPassing = s.performance >= 40;
                                        const nextClass = s.class === 'P7' ? 'Graduated' : s.class.replace(/\d/, d => +d + 1);
                                        return (
                                            <tr key={s.id} className={isPassing ? 'bg-emerald-50/10' : 'bg-red-50/30'}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{s.name} <span className="text-gray-400 font-normal text-xs ml-1">({s.class})</span></td>
                                                <td className="px-4 py-3 text-center font-bold text-gray-700">{s.performance}%</td>
                                                <td className={`px-4 py-3 font-semibold ${isPassing ? 'text-emerald-600' : 'text-danger-600'}`}>
                                                    {isPassing ? `Promote to ${nextClass}` : `Repeat ${s.class}`}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Student Profile"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[['Name', selected.name], ['Student ID', selected.id], ['Class', selected.class], ['Age', `${selected.age} years`], ['Parent', selected.parent], ['Parent Phone', selected.phone], ['Performance', `${selected.performance}%`], ['Attendance', `${selected.attendance}%`], ['Fee Status', selected.fees]].map(([k, v]) => (
                            <div key={k} className="bg-gray-50 p-3 rounded-xl"><p className="text-xs text-gray-500">{k}</p><p className="font-semibold mt-0.5">{v}</p></div>
                        ))}
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'import'} onClose={() => setModal(null)} title="Import Students"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Upload size={14} /> Import</button></>}>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors">
                        <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">Drop .xlsx or .csv here</p>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
