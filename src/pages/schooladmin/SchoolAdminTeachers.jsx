import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Trash2, Upload, AlertTriangle, CheckCircle } from 'lucide-react'

const teachers = [
    { id: 'TCH-001', name: 'Mr. Kenneth Okello', subject: 'Mathematics', class: 'P6, P7', phone: '+256 779 123456', email: 'k.okello@kps.ug', status: 'active', attendance: 96 },
    { id: 'TCH-002', name: 'Ms. Agnes Nassali', subject: 'English', class: 'P4, P5', phone: '+256 752 234567', email: 'a.nassali@kps.ug', status: 'active', attendance: 98 },
    { id: 'TCH-003', name: 'Mr. Ivan Byaruhanga', subject: 'Science', class: 'P5, P6', phone: '+256 701 345678', email: 'i.byaruhanga@kps.ug', status: 'leave', attendance: 88 },
    { id: 'TCH-004', name: 'Ms. Patricia Acen', subject: 'Social Studies', class: 'P1, P2', phone: '+256 780 456789', email: 'p.acen@kps.ug', status: 'active', attendance: 100 },
    { id: 'TCH-005', name: 'Mr. Samuel Waiswa', subject: 'Religious Ed.', class: 'P3, P4', phone: '+256 755 567890', email: 's.waiswa@kps.ug', status: 'active', attendance: 94 },
]

const absenceReports = [
    { id: 1, date: 'Feb 21, 2026', time: '8:30 AM', teacher: 'Mr. Kenneth Okello', subject: 'Mathematics', reporter: 'Ivan Namukasa (P6A)', details: 'Teacher did not show up for the entire lesson.', status: 'pending' },
    { id: 2, date: 'Feb 19, 2026', time: '11:00 AM', teacher: 'Mr. Ivan Byaruhanga', subject: 'Science', reporter: 'Sarah Kemigisha (P5B)', details: 'Arrived 40 minutes late.', status: 'reviewed' },
]

export default function SchoolAdminTeachers() {
    const [view, setView] = useState('staff') // 'staff' or 'reports'
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))

    return (
        <DashboardLayout role="schooladmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">{view === 'staff' ? 'Teachers' : 'Absence Reports'}</h1>
                        <p className="page-subtitle">{view === 'staff' ? 'Manage all teaching staff at Kampala Primary School' : 'Student-submitted teacher absence reports'}</p>
                    </div>
                    {view === 'staff' && (
                        <div className="flex gap-2">
                            <button className="btn-secondary" onClick={() => setModal('import')}><Upload size={15} /> Import</button>
                            <button className="btn-primary" onClick={() => setModal('add')}><Plus size={15} /> Add Teacher</button>
                        </div>
                    )}
                </div>

                <div className="flex items-center border-b border-gray-200">
                    <button onClick={() => setView('staff')} className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${view === 'staff' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Staff Directory</button>
                    <button onClick={() => setView('reports')} className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${view === 'reports' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Absence Reports <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">2</span></button>
                </div>

                {view === 'staff' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by name or subject..." />
                            </div>
                            <div className="flex gap-2">
                                {['All', 'Active', 'On Leave'].map(f => (
                                    <button key={f} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">{f}</button>
                                ))}
                            </div>
                        </div>

                        <div className="card p-0">
                            <table className="w-full">
                                <thead><tr>{['Teacher', 'Subject', 'Classes', 'Phone', 'Attendance', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                                <tbody>
                                    {filteredTeachers.map(t => (
                                        <tr key={t.id} className="hover:bg-blue-50/30">
                                            <td className="table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{t.name.split(' ').pop()[0]}</div>
                                                    <div><p className="text-sm font-semibold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.email}</p></div>
                                                </div>
                                            </td>
                                            <td className="table-cell"><Badge variant="info">{t.subject}</Badge></td>
                                            <td className="table-cell text-sm text-gray-600">{t.class}</td>
                                            <td className="table-cell text-sm text-gray-500">{t.phone}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-16"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${t.attendance}%` }} /></div>
                                                    <span className="text-xs font-medium text-gray-600">{t.attendance}%</span>
                                                </div>
                                            </td>
                                            <td className="table-cell"><Badge variant={t.status === 'active' ? 'success' : 'warning'}>{t.status}</Badge></td>
                                            <td className="table-cell">
                                                <div className="flex gap-1">
                                                    <button onClick={() => { setSelected(t); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" title="View"><Eye size={14} /></button>
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
                ) : (
                    <div className="card p-0">
                        <table className="w-full">
                            <thead><tr>{['Date Reported', 'Teacher', 'Class Subject', 'Reporter', 'Details', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {absenceReports.map(r => (
                                    <tr key={r.id} className="hover:bg-red-50/30">
                                        <td className="table-cell text-sm font-medium text-gray-900">{r.date}<p className="text-xs text-gray-500 font-normal">{r.time}</p></td>
                                        <td className="table-cell font-semibold text-gray-900">{r.teacher}</td>
                                        <td className="table-cell"><Badge variant="gray">{r.subject}</Badge></td>
                                        <td className="table-cell text-sm font-semibold text-blue-600 underline cursor-pointer">{r.reporter}</td>
                                        <td className="table-cell text-sm text-gray-600 max-w-xs truncate" title={r.details}>{r.details}</td>
                                        <td className="table-cell"><Badge variant={r.status === 'pending' ? 'danger' : 'success'}>{r.status === 'pending' ? 'Pending Review' : 'Reviewed'}</Badge></td>
                                        <td className="table-cell">
                                            {r.status === 'pending' && <button className="btn-secondary text-xs px-2 py-1 flex items-center gap-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"><CheckCircle size={12} /> Mark Reviewed</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Teacher" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Add Teacher</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    {[['Full Name', 'text', 'Mr. John Doe'], ['Email', 'email', 'j.doe@school.ug'], ['Phone', '+256 700 000000', 'tel'], ['National ID', 'text', 'CM1234567']].map(([label, ph, type = 'text']) => (
                        <div key={label}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input type={type} className="input-field" placeholder={ph} /></div>
                    ))}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Main Subject</label><select className="select-field"><option>Mathematics</option><option>English</option><option>Science</option><option>Social Studies</option><option>Religious Education</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Assigned Classes</label><select className="select-field" multiple><option>P1</option><option>P2</option><option>P3</option><option>P4</option><option>P5</option><option>P6</option><option>P7</option></select></div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Teacher Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">{selected.name.split(' ').pop()[0]}</div>
                            <div><p className="text-lg font-bold">{selected.name}</p><p className="text-sm text-gray-500">{selected.email}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Subject', selected.subject], ['Classes', selected.class], ['Phone', selected.phone], ['Attendance Rate', `${selected.attendance}%`], ['Status', selected.status], ['Staff ID', selected.id]].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 p-3 rounded-xl"><p className="text-xs text-gray-500">{k}</p><p className="font-semibold mt-0.5">{v}</p></div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
