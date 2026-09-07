import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Trash2, Upload, AlertTriangle, CheckCircle, MoveRight, Clock, CheckCircle2, Check, Camera, Image } from 'lucide-react'

const initialTeachers = [
    { id: 'TCH-001', name: 'Mr. Kenneth Okello', photo: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&auto=format&fit=crop&q=80', subject: 'Mathematics', class: 'P6, P7', phone: '+256 779 123456', email: 'k.okello@kps.ug', status: 'active', attendance: 96, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
    { id: 'TCH-002', name: 'Ms. Agnes Nassali', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80', subject: 'English', class: 'P4, P5', phone: '+256 752 234567', email: 'a.nassali@kps.ug', status: 'active', attendance: 98, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
    { id: 'TCH-003', name: 'Mr. Ivan Byaruhanga', photo: 'https://images.unsplash.com/photo-1507152927692-a5b1154e9515?w=150&auto=format&fit=crop&q=80', subject: 'Science', class: 'P5, P6', phone: '+256 701 345678', email: 'i.byaruhanga@kps.ug', status: 'on-leave', attendance: 88, leaveReason: 'Leave', leaveStart: '2026-02-15', leaveEnd: '2026-03-01', leaveNotes: 'Annual leave' },
    { id: 'TCH-004', name: 'Ms. Patricia Acen', photo: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=150&auto=format&fit=crop&q=80', subject: 'Social Studies', class: 'P1, P2', phone: '+256 780 456789', email: 'p.acen@kps.ug', status: 'active', attendance: 100, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
    { id: 'TCH-005', name: 'Mr. Samuel Waiswa', photo: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&auto=format&fit=crop&q=80', subject: 'Religious Ed.', class: 'P3, P4', phone: '+256 755 567890', email: 's.waiswa@kps.ug', status: 'active', attendance: 94, leaveReason: '', leaveStart: '', leaveEnd: '', leaveNotes: '' },
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

    // New Teacher form state (supports photo upload & multi-class assignment)
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        photo: null,
        email: '',
        phone: '',
        subject: 'Mathematics',
        classes: ['P6A', 'P7']
    })

    const resetNewTeacherForm = () => {
        setNewTeacher({
            name: '',
            photo: null,
            email: '',
            phone: '',
            subject: 'Mathematics',
            classes: ['P6A', 'P7']
        })
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewTeacher(prev => ({ ...prev, photo: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const toggleNewTeacherClass = (cls) => {
        setNewTeacher(prev => ({
            ...prev,
            classes: prev.classes.includes(cls)
                ? prev.classes.filter(c => c !== cls)
                : [...prev.classes, cls]
        }))
    }

    const handleAddNewTeacher = () => {
        if (!newTeacher.name.trim()) {
            setSuccessMsg('Please enter a valid teacher name.')
            setTimeout(() => setSuccessMsg(''), 3000)
            return
        }
        const createdTeacher = {
            id: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
            name: newTeacher.name,
            photo: newTeacher.photo || null,
            subject: newTeacher.subject,
            class: newTeacher.classes.length > 0 ? newTeacher.classes.join(', ') : 'Unassigned',
            phone: newTeacher.phone || '+256 700 000000',
            email: newTeacher.email || `${newTeacher.name.toLowerCase().replace(/[^a-z]/g, '')}@kps.ug`,
            status: 'active',
            attendance: 100,
            leaveReason: '',
            leaveStart: '',
            leaveEnd: '',
            leaveNotes: ''
        }
        setTeachers(prev => [createdTeacher, ...prev])
        setModal(null)
        resetNewTeacherForm()
        setSuccessMsg(`Teacher ${createdTeacher.name} successfully added and assigned to ${createdTeacher.class}!`)
        setTimeout(() => setSuccessMsg(''), 4000)
    }

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
                                                    {t.photo ? (
                                                        <img src={t.photo} alt={t.name} className="w-9 h-9 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-600 flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                            {t.name.split(' ').pop()[0]}
                                                        </div>
                                                    )}
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
                    <div className="card p-0 border-t-4 border-t-red-500">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Date Reported', 'Teacher', 'Class Subject', 'Reporter', 'Details', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {absenceReports.map(r => (
                                    <tr key={r.id} className="hover:bg-red-50/30 dark:hover:bg-red-900/10">
                                        <td className="table-cell text-sm font-medium dark:text-slate-200">{r.date}<p className="text-xs text-gray-500 dark:text-slate-400 font-normal">{r.time}</p></td>
                                        <td className="table-cell font-bold dark:text-slate-100">{r.teacher}</td>
                                        <td className="table-cell"><Badge variant="gray">{r.subject}</Badge></td>
                                        <td className="table-cell text-sm font-semibold text-primary-600 dark:text-primary-400 underline cursor-pointer">{r.reporter}</td>
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

            {/* Add Teacher Modal */}
            <Modal
                isOpen={modal === 'add'}
                onClose={() => { setModal(null); resetNewTeacherForm() }}
                title="Add New Teacher"
                size="lg"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setModal(null); resetNewTeacherForm() }}>Cancel</button>
                        <button className="btn-primary" onClick={handleAddNewTeacher}><Plus size={14} /> Add Teacher</button>
                    </>
                }
            >
                <div className="space-y-4">
                    {/* Profile Picture Upload Section */}
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-800/70 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group">
                            {newTeacher.photo ? (
                                <img
                                    src={newTeacher.photo}
                                    alt="Teacher Preview"
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-slate-700 border-2 border-dashed border-blue-300 dark:border-slate-600 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Camera size={20} />
                                    <span className="text-[9px] font-bold mt-0.5">Photo</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-1">
                            <label className="text-xs font-bold text-gray-800 dark:text-white block">
                                Profile Picture
                            </label>
                            <p className="text-[11px] text-gray-500 dark:text-slate-400">
                                Upload a professional teacher photo (JPG, PNG).
                            </p>
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer shadow-sm">
                                <Upload size={13} />
                                <span>{newTeacher.photo ? 'Change Photo' : 'Upload Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-200 mb-1">Full Name *</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g., Mr. Paul Musisi"
                                value={newTeacher.name}
                                onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-200 mb-1">Email Address *</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="p.musisi@kps.ug"
                                value={newTeacher.email}
                                onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-200 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                className="input-field"
                                placeholder="+256 700 123456"
                                value={newTeacher.phone}
                                onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-200 mb-1">Main Subject</label>
                            <select
                                className="select-field"
                                value={newTeacher.subject}
                                onChange={e => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                            >
                                {allPrimarySubjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Interactive Multi-Class Assignment */}
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                                Assigned Classes <span className="text-gray-400 font-normal">(Click multiple classes to assign)</span>
                            </label>
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                {newTeacher.classes.length} {newTeacher.classes.length === 1 ? 'Class' : 'Classes'} Selected
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                            {allPrimaryClasses.map(cls => {
                                const isSelected = newTeacher.classes.includes(cls)
                                return (
                                    <button
                                        key={cls}
                                        type="button"
                                        onClick={() => toggleNewTeacherClass(cls)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                            isSelected
                                                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                                                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {isSelected && <Check size={13} />}
                                        <span>{cls}</span>
                                    </button>
                                )
                            })}
                        </div>
                        {newTeacher.classes.length === 0 && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400">Please select at least one class for this teacher.</p>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Teacher Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {selected.photo ? (
                                <img src={selected.photo} alt={selected.name} className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-700 flex-shrink-0" />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">{selected.name.split(' ').pop()[0]}</div>
                            )}
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
