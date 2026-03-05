import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Trash2, Upload, AlertTriangle, CheckCircle, MoveRight, Clock, CheckCircle2 } from 'lucide-react'

const initialTeachers = [
    { id: 'TCH-001', name: 'Mr. Kenneth Okello', subject: 'Mathematics', class: 'P6, P7', phone: '+256 779 123456', email: 'k.okello@kps.ug', status: 'active', attendance: 96, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
    { id: 'TCH-002', name: 'Ms. Agnes Nassali', subject: 'English', class: 'P4, P5', phone: '+256 752 234567', email: 'a.nassali@kps.ug', status: 'active', attendance: 98, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
    { id: 'TCH-003', name: 'Mr. Ivan Byaruhanga', subject: 'Science', class: 'P5, P6', phone: '+256 701 345678', email: 'i.byaruhanga@kps.ug', status: 'on-leave', attendance: 88, leaveReason: 'Leave', leaveStart: '2026-02-15', leaveEnd: '2026-03-01', leaveNotes: 'Annual leave' },
    { id: 'TCH-004', name: 'Ms. Patricia Acen', subject: 'Social Studies', class: 'P1, P2', phone: '+256 780 456789', email: 'p.acen@kps.ug', status: 'active', attendance: 100, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
    { id: 'TCH-005', name: 'Mr. Samuel Waiswa', subject: 'Religious Ed.', class: 'P3, P4', phone: '+256 755 567890', email: 's.waiswa@kps.ug', status: 'active', attendance: 94, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
]

const absenceReports = [
    { id: 1, date: 'Feb 21, 2026', time: '8:30 AM', teacher: 'Mr. Kenneth Okello', subject: 'Mathematics', reporter: 'Ivan Namukasa (P6A)', details: 'Teacher did not show up for the entire lesson.', status: 'pending' },
    { id: 2, date: 'Feb 19, 2026', time: '11:00 AM', teacher: 'Mr. Ivan Byaruhanga', subject: 'Science', reporter: 'Sarah Kemigisha (P5B)', details: 'Arrived 40 minutes late.', status: 'reviewed' },
]

const allPrimaryClasses = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6A', 'P6B', 'P7']
const allPrimarySubjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Ed.', 'Physical Ed.', 'Art & Craft']
const leaveReasons = ['Leave', 'Field Trip', 'Sick Leave', 'Conference', 'Personal', 'Maternity/Paternity', 'Other']

export default function SchoolAdminTeachers() {
    const [teachers, setTeachers] = useState(initialTeachers)
    const [view, setView] = useState('staff') // 'staff' or 'reports'
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [relocateSubject, setRelocateSubject] = useState('')
    const [relocateClasses, setRelocateClasses] = useState([])
    const [successMsg, setSuccessMsg] = useState('')

    // Leave modal state
    const [leaveReason, setLeaveReason] = useState('')
    const [leaveStart, setLeaveStart] = useState('')
    const [leaveEnd, setLeaveEnd] = useState('')
    const [leaveNotes, setLeaveNotes] = useState('')

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = statusFilter === 'All' || (statusFilter === 'Active' && t.status === 'active') || (statusFilter === 'On Leave' && (t.status === 'on-leave' || t.status === 'inactive'))
        return matchesSearch && matchesFilter
    })

    const handleRelocateClick = (t) => {
        setSelected(t)
        setRelocateSubject(t.subject)
        setRelocateClasses(t.class.split(', ').map(c => c.trim()))
        setModal('relocate')
    }

    const toggleClassSelection = (cls) => {
        if (relocateClasses.includes(cls)) {
            setRelocateClasses(relocateClasses.filter(c => c !== cls))
        } else {
            setRelocateClasses([...relocateClasses, cls])
        }
    }

    const openLeaveModal = (t) => {
        setSelected(t)
        setLeaveReason(t.leaveReason || 'Leave')
        setLeaveStart(t.leaveStart || '')
        setLeaveEnd(t.leaveEnd || '')
        setLeaveNotes(t.leaveNotes || '')
        setModal('leave')
    }

    const saveLeave = () => {
        setTeachers(prev => prev.map(t => t.id === selected.id ? {
            ...t,
            status: 'on-leave',
            leaveReason,
            leaveStart,
            leaveEnd,
            leaveNotes
        } : t))
        setModal(null)
        setSuccessMsg(`${selected.name} marked as on leave.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    const markActive = (t) => {
        setTeachers(prev => prev.map(tc => tc.id === t.id ? { ...tc, status: 'active', leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' } : tc))
        setSuccessMsg(`${t.name} is now active.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    const markInactive = (t) => {
        setTeachers(prev => prev.map(tc => tc.id === t.id ? { ...tc, status: 'inactive' } : tc))
        setSuccessMsg(`${t.name} marked as inactive.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    return (
        <DashboardLayout role="schooladmin-primary">
            <div className="space-y-6 relative">

                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

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

                <div className="flex items-center border-b border-gray-200 dark:border-slate-700">
                    <button onClick={() => setView('staff')} className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${view === 'staff' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>Staff Directory</button>
                    <button onClick={() => setView('reports')} className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${view === 'reports' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>Absence Reports <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 py-0.5 px-2 rounded-full text-xs">2</span></button>
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
                                    <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 ring-1 ring-primary-300' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}>{f}</button>
                                ))}
                            </div>
                        </div>

                        <div className="card p-0">
                            <div className="overflow-x-auto"><table className="w-full">
                                <thead><tr>{['Teacher', 'Subject', 'Classes', 'Phone', 'Attendance', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                                <tbody>
                                    {filteredTeachers.map(t => (
                                        <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 cursor-pointer" onClick={(e) => {
                                            if (e.target.closest('button')) return;
                                            setSelected(t); setModal('view');
                                        }}>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{t.name.split(' ').pop()[0]}</div>
                                                    <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p><p className="text-xs text-gray-400 dark:text-slate-500">{t.email}</p></div>
                                                </div>
                                            </td>
                                            <td className="table-cell"><Badge variant="info">{t.subject}</Badge></td>
                                            <td className="table-cell text-sm text-gray-600 dark:text-slate-300">{t.class}</td>
                                            <td className="table-cell text-sm text-gray-500 dark:text-slate-400">{t.phone}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 w-16"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${t.attendance}%` }} /></div>
                                                    <span className="text-xs font-medium text-gray-600 dark:text-slate-400">{t.attendance}%</span>
                                                </div>
                                            </td>
                                            <td className="table-cell"><Badge variant={t.status === 'active' ? 'success' : t.status === 'on-leave' ? 'warning' : 'danger'}>{t.status === 'on-leave' ? 'On Leave' : t.status}</Badge></td>
                                            <td className="table-cell">
                                                <div className="flex gap-1 flex-wrap">
                                                    <button onClick={() => handleRelocateClick(t)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"><MoveRight size={12} /> Relocate</button>
                                                    {t.status === 'active' ? (
                                                        <button onClick={() => openLeaveModal(t)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold hover:shadow-sm transition-all"><Clock size={12} /> Set Leave</button>
                                                    ) : (
                                                        <button onClick={() => markActive(t)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold hover:shadow-sm transition-all"><CheckCircle size={12} /> Activate</button>
                                                    )}
                                                    <button onClick={() => markInactive(t)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400" title="Mark Inactive"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table></div>
                        </div>
                    </div>
                ) : (
                    <div className="card p-0">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Date Reported', 'Teacher', 'Class Subject', 'Reporter', 'Details', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {absenceReports.map(r => (
                                    <tr key={r.id} className="hover:bg-red-50/30 dark:hover:bg-red-900/10">
                                        <td className="table-cell text-sm font-medium text-gray-900 dark:text-white">{r.date}<p className="text-xs text-gray-500 dark:text-slate-400 font-normal">{r.time}</p></td>
                                        <td className="table-cell font-semibold text-gray-900 dark:text-white">{r.teacher}</td>
                                        <td className="table-cell"><Badge variant="gray">{r.subject}</Badge></td>
                                        <td className="table-cell text-sm font-semibold text-blue-600 dark:text-blue-400 underline cursor-pointer">{r.reporter}</td>
                                        <td className="table-cell text-sm text-gray-600 dark:text-slate-300 max-w-xs truncate" title={r.details}>{r.details}</td>
                                        <td className="table-cell"><Badge variant={r.status === 'pending' ? 'danger' : 'success'}>{r.status === 'pending' ? 'Pending Review' : 'Reviewed'}</Badge></td>
                                        <td className="table-cell">
                                            {r.status === 'pending' && <button className="btn-secondary text-xs px-2 py-1 flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700"><CheckCircle size={12} /> Mark Reviewed</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    </div>
                )}
            </div>

            {/* Leave/Inactive Modal */}
            <Modal isOpen={modal === 'leave'} onClose={() => setModal(null)} title={`Set Leave: ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={saveLeave}><Clock size={14} /> Confirm Leave</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-slate-300">Mark <strong className="text-gray-900 dark:text-white">{selected.name}</strong> as on leave or inactive. They will not appear in active staff lists until reactivated.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Reason</label>
                            <select className="select-field" value={leaveReason} onChange={e => setLeaveReason(e.target.value)}>
                                {leaveReasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Start Date</label>
                                <input type="date" className="input-field" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Expected Return</label>
                                <input type="date" className="input-field" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Notes (optional)</label>
                            <textarea className="input-field resize-none" rows={2} value={leaveNotes} onChange={e => setLeaveNotes(e.target.value)} placeholder="e.g., Will be attending a 2-week training..." />
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'relocate'} onClose={() => setModal(null)} title={`Relocate/Adjust: ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}>Save Changes</button></>}>
                {selected && (
                    <div className="space-y-5">
                        <p className="text-sm text-gray-600 dark:text-slate-300">Reassign <strong>{selected.name}</strong> to different subjects or primary classes.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">Main Subject</label>
                            <select className="input-field w-full" value={relocateSubject} onChange={e => setRelocateSubject(e.target.value)}>
                                {allPrimarySubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">Assigned Classes</label>
                            <div className="flex flex-wrap gap-2">
                                {allPrimaryClasses.map(cls => (
                                    <button
                                        key={cls}
                                        onClick={() => toggleClassSelection(cls)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${relocateClasses.includes(cls)
                                            ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500 shadow-sm'
                                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {cls}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Selected: {relocateClasses.join(', ') || 'None'}</p>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Teacher" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Add Teacher</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    {[['Full Name', 'text', 'Mr. John Doe'], ['Email', 'email', 'j.doe@school.ug'], ['Phone', '+256 700 000000', 'tel'], ['National ID', 'text', 'CM1234567']].map(([label, ph, type = 'text']) => (
                        <div key={label}><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">{label}</label><input type={type} className="input-field" placeholder={ph} /></div>
                    ))}
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Main Subject</label><select className="select-field"><option>Mathematics</option><option>English</option><option>Science</option><option>Social Studies</option><option>Religious Education</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Assigned Classes</label><select className="select-field" multiple><option>P1</option><option>P2</option><option>P3</option><option>P4</option><option>P5</option><option>P6</option><option>P7</option></select></div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Teacher Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">{selected.name.split(' ').pop()[0]}</div>
                            <div><p className="text-lg font-bold dark:text-white">{selected.name}</p><p className="text-sm text-gray-500 dark:text-slate-400">{selected.email}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Subject', selected.subject], ['Classes', selected.class], ['Phone', selected.phone], ['Attendance Rate', `${selected.attendance}%`], ['Status', selected.status === 'on-leave' ? 'On Leave' : selected.status], ['Staff ID', selected.id]].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-xl"><p className="text-xs text-gray-500 dark:text-slate-400">{k}</p><p className="font-semibold mt-0.5 dark:text-white">{v}</p></div>
                            ))}
                        </div>
                        {selected.status === 'on-leave' && selected.leaveReason && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">Leave Details</p>
                                <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Reason:</strong> {selected.leaveReason}</p>
                                {selected.leaveStart && <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Period:</strong> {selected.leaveStart} → {selected.leaveEnd || 'TBD'}</p>}
                                {selected.leaveNotes && <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">{selected.leaveNotes}</p>}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
