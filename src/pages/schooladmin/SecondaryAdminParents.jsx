import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, Edit2, Trash2, Mail, Phone, Save, CheckCircle2, Clock, CheckCircle, UserX, Camera, Upload, GraduationCap, X, User, Check } from 'lucide-react'

const initialSecondaryParents = [
    { id: 'PAR-S-001', name: 'Jane Namukasa', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80', students: ['Mary Namukasa (S1B)', 'Patricia Nakato (S1A)'], phone: '+256 772 111222', email: 'jane.namukasa@mail.com', status: 'active', balance: 'UGX 450,000', leaveReason: '', leaveReturn: '', leaveNotes: '' },
    { id: 'PAR-S-002', name: 'Jane Doe', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', students: ['John Doe (S3A)'], phone: '+256 701 222333', email: 'jane.doe@mail.com', status: 'active', balance: 'UGX 0', leaveReason: '', leaveReturn: '', leaveNotes: '' },
    { id: 'PAR-S-003', name: 'Wendy Pan', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', students: ['Peter Pan (S4A)'], phone: '+256 785 333444', email: 'wendy.pan@mail.com', status: 'active', balance: 'UGX 210,000', leaveReason: '', leaveReturn: '', leaveNotes: '' },
    { id: 'PAR-S-004', name: 'Catherine Wonderland', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', students: ['Alice Wonderland (S6)'], phone: '+256 754 444555', email: 'catherine.w@mail.com', status: 'active', balance: 'UGX 0', leaveReason: '', leaveReturn: '', leaveNotes: '' },
    { id: 'PAR-S-005', name: 'Robert Sserwanga', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', students: ['Kenneth Sserwanga (S2A)'], phone: '+256 700 888999', email: 'robert.sser@mail.com', status: 'inactive', balance: 'UGX 0', leaveReason: 'Relocated', leaveReturn: '', leaveNotes: 'Moved overseas' },
]

const parentLeaveReasons = ['Traveling', 'Relocated', 'Unavailable', 'Medical', 'Work Assignment', 'Other']

const availableSecondaryStudents = [
    { id: 'STD-S-001', name: 'Mary Namukasa', class: 'S1B', fees: 'paid', performance: 88 },
    { id: 'STD-S-002', name: 'John Doe', class: 'S3A', fees: 'paid', performance: 76 },
    { id: 'STD-S-003', name: 'Peter Pan', class: 'S4A', fees: 'partial', performance: 82 },
    { id: 'STD-S-004', name: 'Alice Wonderland', class: 'S6', fees: 'paid', performance: 94 },
    { id: 'STD-S-005', name: 'Kenneth Sserwanga', class: 'S2A', fees: 'paid', performance: 70 },
    { id: 'STD-S-006', name: 'Patricia Nakato', class: 'S1A', fees: 'overdue', performance: 68 },
    { id: 'STD-S-007', name: 'David Okello', class: 'S5', fees: 'paid', performance: 85 },
    { id: 'STD-S-008', name: 'Brian Ssemwogerere', class: 'S2B', fees: 'paid', performance: 79 },
]

export default function SecondaryAdminParents() {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [parents, setParents] = useState(initialSecondaryParents)
    const [successMsg, setSuccessMsg] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    // Edit form state
    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPhoto, setEditPhoto] = useState(null)
    const [editStudents, setEditStudents] = useState([])
    const [editStudentSearch, setEditStudentSearch] = useState('')

    // Add form state
    const [addName, setAddName] = useState('')
    const [addPhone, setAddPhone] = useState('')
    const [addEmail, setAddEmail] = useState('')
    const [addPhoto, setAddPhoto] = useState(null)
    const [addStudents, setAddStudents] = useState([])
    const [addStudentSearch, setAddStudentSearch] = useState('')

    // Leave/inactive form state
    const [leaveReason, setLeaveReason] = useState('')
    const [leaveReturn, setLeaveReturn] = useState('')
    const [leaveNotes, setLeaveNotes] = useState('')

    const handlePhotoUpload = (e, isEdit = false) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (isEdit) setEditPhoto(reader.result)
                else setAddPhoto(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const toggleAddStudent = (label) => {
        setAddStudents(prev =>
            prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
        )
    }

    const toggleEditStudent = (label) => {
        setEditStudents(prev =>
            prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
        )
    }

    const filtered = parents.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
        const matchesFilter = statusFilter === 'All' || (statusFilter === 'Active' && p.status === 'active') || (statusFilter === 'Inactive' && (p.status === 'inactive' || p.status === 'on-leave'))
        return matchesSearch && matchesFilter
    })

    const openEdit = (p) => {
        setSelected(p)
        setEditName(p.name)
        setEditPhone(p.phone)
        setEditEmail(p.email)
        setEditPhoto(p.photo || null)
        setEditStudents(p.students || [])
        setEditStudentSearch('')
        setModal('edit')
    }

    const saveEdit = () => {
        setParents(prev => prev.map(p => p.id === selected.id ? { ...p, name: editName, phone: editPhone, email: editEmail, photo: editPhoto, students: editStudents } : p))
        setModal(null)
        setSuccessMsg(`Parent updated! Linked to ${editStudents.length} secondary students.`)
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const deleteParent = (parent) => {
        if (window.confirm(`Remove ${parent.name} from the system? This will unlink their student accounts.`)) {
            setParents(prev => prev.filter(p => p.id !== parent.id))
            setSuccessMsg(`${parent.name} removed.`)
            setTimeout(() => setSuccessMsg(''), 3000)
        }
    }

    const addParent = () => {
        if (!addName.trim() || !addPhone.trim()) return
        const newParent = {
            id: `PAR-S-${String(parents.length + 5).padStart(3, '0')}`,
            name: addName,
            photo: addPhoto,
            students: addStudents,
            phone: addPhone,
            email: addEmail,
            status: 'active',
            balance: 'UGX 0',
            leaveReason: '',
            leaveReturn: '',
            leaveNotes: '',
        }
        setParents([...parents, newParent])
        setAddName(''); setAddPhone(''); setAddEmail(''); setAddPhoto(null); setAddStudents([]); setAddStudentSearch('')
        setModal(null)
        setSuccessMsg(`Parent ${newParent.name} registered with ${newParent.students.length} linked students!`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    const openLeaveModal = (p) => {
        setSelected(p)
        setLeaveReason(p.leaveReason || 'Traveling')
        setLeaveReturn(p.leaveReturn || '')
        setLeaveNotes(p.leaveNotes || '')
        setModal('leave')
    }

    const saveLeave = () => {
        setParents(prev => prev.map(p => p.id === selected.id ? { ...p, status: 'on-leave', leaveReason, leaveReturn, leaveNotes } : p))
        setModal(null)
        setSuccessMsg(`${selected.name} marked as on leave/inactive.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    const markActive = (p) => {
        setParents(prev => prev.map(par => par.id === p.id ? { ...par, status: 'active', leaveReason: '', leaveReturn: '', leaveNotes: '' } : par))
        setSuccessMsg(`${p.name} is now active.`)
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6 relative">

                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Secondary School Parents</h1>
                        <p className="page-subtitle">Manage parent contacts, portal accounts & communication for Kampala Secondary School</p>
                    </div>
                    <button className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setModal('add')}>
                        <Plus size={15} /> Add Parent
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by name or phone..." />
                    </div>
                    <div className="flex items-center gap-2">
                        {['All', 'Active', 'Inactive'].map(f => (
                            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}>{f}</button>
                        ))}
                        <span className="text-sm text-gray-500 dark:text-slate-400 font-medium ml-2">{filtered.length} parents</span>
                    </div>
                </div>

                <div className="card p-0 border-t-4 border-t-indigo-500">
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Parent Name', 'Linked Students', 'Contact Info', 'Balance', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-700/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            {p.photo ? (
                                                <img src={p.photo} alt={p.name} className="w-9 h-9 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-600 flex-shrink-0" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                    {p.name.split(' ').pop()[0]}
                                                </div>
                                            )}
                                            <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p><p className="text-xs text-gray-400 dark:text-slate-500">{p.id}</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex flex-col gap-1">
                                            {p.students.length > 0 ? p.students.map((s, i) => <span key={i} className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md w-fit">{s}</span>) : <span className="text-xs text-gray-400 dark:text-slate-500 italic">No students linked</span>}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="text-sm text-gray-600 dark:text-slate-300 flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400 dark:text-slate-500" /> {p.phone}</span>
                                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400 dark:text-slate-500" /> {p.email}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell"><span className={`font-semibold text-sm ${p.balance === 'UGX 0' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{p.balance}</span></td>
                                    <td className="table-cell"><Badge variant={p.status === 'active' ? 'success' : p.status === 'on-leave' ? 'warning' : 'gray'}>{p.status === 'on-leave' ? 'On Leave' : p.status}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-1 flex-wrap">
                                            <button onClick={() => { setSelected(p); setModal('view') }} className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" title="View"><Eye size={14} /></button>
                                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400" title="Edit"><Edit2 size={14} /></button>
                                            {p.status === 'active' ? (
                                                <button onClick={() => openLeaveModal(p)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold hover:shadow-sm transition-all" title="Set Inactive/Leave"><UserX size={12} /> Leave</button>
                                            ) : (
                                                <button onClick={() => markActive(p)} className="py-1 px-2 text-xs flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold hover:shadow-sm transition-all"><CheckCircle size={12} /> Activate</button>
                                            )}
                                            <button onClick={() => deleteParent(p)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400" title="Remove"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                    {filtered.length === 0 && <div className="p-8 text-center text-gray-400 dark:text-slate-500">No parents found.</div>}
                </div>
            </div>

            {/* Leave/Inactive Modal */}
            <Modal isOpen={modal === 'leave'} onClose={() => setModal(null)} title={`Set Leave/Inactive: ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white" onClick={saveLeave}><UserX size={14} /> Confirm</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-slate-300">Mark <strong className="text-gray-900 dark:text-white">{selected.name}</strong> as on leave or inactive. They will be flagged in the system until reactivated.</p>
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
                            <textarea className="input-field resize-none" rows={2} value={leaveNotes} onChange={e => setLeaveNotes(e.target.value)} placeholder="e.g., Will be out of the country until next term..." />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Parent Modal */}
            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Register New Secondary Parent" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white" onClick={addParent} disabled={!addName.trim() || !addPhone.trim()}><Plus size={14} /> Register Parent</button></>}>
                <div className="space-y-4">
                    {/* Photo Upload Section */}
                    <div className="p-3.5 bg-indigo-50/60 dark:bg-slate-800/70 rounded-xl border border-indigo-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group">
                            {addPhoto ? (
                                <img
                                    src={addPhoto}
                                    alt="Parent Preview"
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 border-2 border-dashed border-indigo-300 dark:border-slate-600 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Camera size={20} />
                                    <span className="text-[9px] font-bold mt-0.5">Photo</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-1">
                            <label className="text-xs font-bold text-gray-800 dark:text-white block">
                                Parent / Guardian Photo
                            </label>
                            <p className="text-[11px] text-gray-500 dark:text-slate-400">
                                Upload a profile photo for the parent portal & identification.
                            </p>
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer shadow-sm">
                                <Upload size={13} />
                                <span>{addPhoto ? 'Change Photo' : 'Upload Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoUpload(e, false)}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name *</label>
                            <input type="text" className="input-field" placeholder="e.g., Catherine Wonderland" value={addName} onChange={e => setAddName(e.target.value)} />
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number *</label><input type="tel" className="input-field" placeholder="+256 700 000000" value={addPhone} onChange={e => setAddPhone(e.target.value)} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address</label><input type="email" className="input-field" placeholder="parent@email.com" value={addEmail} onChange={e => setAddEmail(e.target.value)} /></div>

                        {/* Interactive Multi-Child Linking Section */}
                        <div className="col-span-2 p-3.5 bg-blue-50/50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <GraduationCap size={15} className="text-blue-600 dark:text-blue-400" /> Link Children / Students
                                </label>
                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full">
                                    {addStudents.length} {addStudents.length === 1 ? 'Student' : 'Students'} Linked
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Parents can have more than 1 child. Select all secondary students for this parent:
                            </p>

                            {/* Selected Children Badges */}
                            {addStudents.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                                    {addStudents.map((child, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                            {child}
                                            <button
                                                type="button"
                                                onClick={() => toggleAddStudent(child)}
                                                className="hover:text-red-500 rounded-full ml-1"
                                                title="Remove student"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Search and Toggle Children List */}
                            <div className="space-y-1.5">
                                <div className="relative">
                                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className="input-field text-xs pl-8 py-1.5"
                                        placeholder="Search student by name or class (e.g., S1B, S3A)..."
                                        value={addStudentSearch}
                                        onChange={e => setAddStudentSearch(e.target.value)}
                                    />
                                </div>

                                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                                    {availableSecondaryStudents
                                        .filter(s =>
                                            `${s.name} ${s.class}`.toLowerCase().includes(addStudentSearch.toLowerCase())
                                        )
                                        .map(s => {
                                            const label = `${s.name} (${s.class})`
                                            const isSelected = addStudents.includes(label)
                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => toggleAddStudent(label)}
                                                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                                            : 'bg-white dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/80'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <User size={13} className={isSelected ? 'text-white' : 'text-slate-400'} />
                                                        <span>{s.name}</span>
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                                                    }`}>
                                                        {s.class}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 flex items-start gap-2 mt-2">
                            <input type="checkbox" className="mt-1" id="send_invite_secondary" defaultChecked />
                            <label htmlFor="send_invite_secondary" className="text-sm text-gray-700 dark:text-slate-200">Send welcome SMS/Email with parent portal login credentials</label>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Parent Modal */}
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Edit Parent & Linked Students" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white" onClick={saveEdit}><Save size={14} /> Save Changes</button></>}>
                <div className="space-y-4">
                    {/* Photo upload for edit */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        {editPhoto ? (
                            <img src={editPhoto} alt="Parent" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shadow-sm" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300"><Camera size={18} /></div>
                        )}
                        <label className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-700 hover:bg-gray-50 cursor-pointer">
                            <span>Change Photo</span>
                            <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} className="hidden" />
                        </label>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name</label><input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number</label><input className="input-field" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email Address</label><input className="input-field" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></div>
                    </div>

                    {/* Interactive Edit Multi-Child Linking */}
                    <div className="p-3.5 bg-blue-50/50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                <GraduationCap size={15} className="text-blue-600 dark:text-blue-400" /> Manage Linked Students ({editStudents.length})
                            </label>
                        </div>

                        {/* Selected Children Badges */}
                        {editStudents.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                                {editStudents.map((child, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                        {child}
                                        <button
                                            type="button"
                                            onClick={() => toggleEditStudent(child)}
                                            className="hover:text-red-500 rounded-full ml-1"
                                            title="Remove student"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-amber-600 dark:text-amber-400">No students linked to this parent.</p>
                        )}

                        <div className="space-y-1.5">
                            <div className="relative">
                                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="input-field text-xs pl-8 py-1.5"
                                    placeholder="Search student by name or class to add/remove..."
                                    value={editStudentSearch}
                                    onChange={e => setEditStudentSearch(e.target.value)}
                                />
                            </div>

                            <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                                {availableSecondaryStudents
                                    .filter(s =>
                                        `${s.name} ${s.class}`.toLowerCase().includes(editStudentSearch.toLowerCase())
                                    )
                                    .map(s => {
                                        const label = `${s.name} (${s.class})`
                                        const isSelected = editStudents.includes(label)
                                        return (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => toggleEditStudent(label)}
                                                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                                        : 'bg-white dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/80'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <User size={13} className={isSelected ? 'text-white' : 'text-slate-400'} />
                                                    <span>{s.name}</span>
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                                                }`}>
                                                    {s.class}
                                                </span>
                                            </button>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* View Parent Modal */}
            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Parent & Family Details" size="lg"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {selected.photo ? (
                                <img src={selected.photo} alt={selected.name} className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-700 flex-shrink-0" />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
                                    {selected.name.split(' ').pop()[0]}
                                </div>
                            )}
                            <div>
                                <p className="text-lg font-bold dark:text-white">{selected.name}</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{selected.id} &bull; <span className="font-semibold text-blue-600 dark:text-blue-400">{selected.students.length} Registered {selected.students.length === 1 ? 'Student' : 'Students'}</span></p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Phone', selected.phone], ['Email', selected.email], ['Status', selected.status === 'on-leave' ? 'On Leave' : selected.status], ['Outstanding Balance', selected.balance]].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-xl"><p className="text-xs text-gray-500 dark:text-slate-400">{k}</p><p className="font-semibold mt-0.5 dark:text-white">{v}</p></div>
                            ))}
                        </div>
                        {(selected.status === 'on-leave' || selected.status === 'inactive') && selected.leaveReason && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">Leave/Inactive Details</p>
                                <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Reason:</strong> {selected.leaveReason}</p>
                                {selected.leaveReturn && <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Expected Return:</strong> {selected.leaveReturn}</p>}
                                {selected.leaveNotes && <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">{selected.leaveNotes}</p>}
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
                                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <GraduationCap size={15} className="text-blue-600" /> Linked Secondary Students ({selected.students.length})
                                </p>
                                <button onClick={() => { setModal(null); openEdit(selected) }} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                                    <Plus size={12} /> Add / Remove Student
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selected.students.length > 0 ? selected.students.map((s, i) => (
                                    <div key={i} className="p-3 border border-blue-100 dark:border-slate-600 rounded-xl bg-blue-50/40 dark:bg-slate-700/60 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                                {s.split(' ')[0][0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{s.split(' (')[0]}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-slate-400">Class: <span className="font-semibold text-blue-600 dark:text-blue-400">{s.includes('(') ? s.split('(')[1].replace(')', '') : 'Enrolled'}</span></p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                )) : <p className="text-sm text-gray-400 dark:text-slate-500 italic p-3">No students linked yet.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
