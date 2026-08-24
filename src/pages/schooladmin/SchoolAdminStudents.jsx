import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, TrendingUp, TrendingDown, Upload, Filter, Zap, CheckSquare, MoveRight, Eye, User, Phone, Calendar, BookOpen, Clock, Award, MapPin, RotateCcw, GraduationCap, Printer, Download, FileText, Send, CheckCircle2, Share2, Sparkles, Check, Camera } from 'lucide-react'

const initialPrimaryStudents = [
    { id: 'STU-001', name: 'Ivan Namukasa', class: 'P7A', age: 13, gender: 'Male',
      parent: 'Mary Namukasa', parentPhone: '+256 772 111222', parentEmail: 'mary.namukasa@mail.com',
      parent1Name: 'Mary Namukasa', parent1Phone: '+256 772 111222', parent1Relation: 'Mother', parent1Email: 'mary.namukasa@mail.com',
      parent2Name: 'Moses Namukasa', parent2Phone: '+256 701 444333', parent2Relation: 'Father', parent2Email: 'moses.namukasa@mail.com',
      nextOfKinName: 'David Byaruhanga', nextOfKinPhone: '+256 780 999888', nextOfKinRelation: 'Uncle',
      performance: 82, attendance: 94, fees: 'paid', joinDate: '2019-02-04', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'],
      teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mr. David Byaruhanga', 'Ms. Sarah Acen', 'Mr. Paul Kintu'],
      repeats: [],
      history: [
        { class: 'P1A', year: '2019', avg: 74, position: '12/45', remark: 'Promoted' },
        { class: 'P2B', year: '2020', avg: 78, position: '8/48', remark: 'Promoted' },
        { class: 'P3A', year: '2020', avg: 72, position: '15/40', remark: 'COVID Year' },
        { class: 'P4A', year: '2021', avg: 80, position: '6/52', remark: 'Promoted' },
        { class: 'P5B', year: '2022', avg: 79, position: '10/44', remark: 'Promoted' },
        { class: 'P6A', year: '2023', avg: 83, position: '5/50', remark: 'Promoted' },
        { class: 'P7A', year: '2024', avg: 82, position: '7/38', remark: 'Current' },
      ]
    },
    { id: 'STU-002', name: 'Grace Mukasa', class: 'P6B', age: 12, gender: 'Female',
      parent: 'John Mukasa', parentPhone: '+256 701 222333', parentEmail: 'john.mukasa@mail.com',
      parent1Name: 'John Mukasa', parent1Phone: '+256 701 222333', parent1Relation: 'Father', parent1Email: 'john.mukasa@mail.com',
      parent2Name: 'Florence Mukasa', parent2Phone: '+256 752 555666', parent2Relation: 'Mother', parent2Email: 'florence.m@mail.com',
      nextOfKinName: 'Aunt Harriet Nambi', nextOfKinPhone: '+256 779 111333', nextOfKinRelation: 'Aunt',
      performance: 91, attendance: 98, fees: 'paid', joinDate: '2019-02-04', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'],
      teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mr. David Byaruhanga', 'Ms. Sarah Acen', 'Mr. Paul Kintu'],
      repeats: [],
      history: [
        { class: 'P1A', year: '2019', avg: 88, position: '3/45', remark: 'Promoted' },
        { class: 'P2A', year: '2020', avg: 90, position: '2/48', remark: 'Promoted' },
        { class: 'P3B', year: '2021', avg: 92, position: '1/40', remark: 'Promoted' },
        { class: 'P4B', year: '2022', avg: 89, position: '3/52', remark: 'Promoted' },
        { class: 'P5A', year: '2023', avg: 91, position: '2/44', remark: 'Promoted' },
        { class: 'P6B', year: '2024', avg: 91, position: '1/50', remark: 'Current' },
      ]
    },
    { id: 'STU-003', name: 'David Ouma', class: 'P5A', age: 11, gender: 'Male',
      parent: 'Patricia Ouma', parentPhone: '+256 785 333444', parentEmail: 'patricia.ouma@mail.com',
      parent1Name: 'Patricia Ouma', parent1Phone: '+256 785 333444', parent1Relation: 'Mother', parent1Email: 'patricia.ouma@mail.com',
      parent2Name: '', parent2Phone: '', parent2Relation: 'Father', parent2Email: '',
      nextOfKinName: 'Robert Ouma', nextOfKinPhone: '+256 700 444888', nextOfKinRelation: 'Uncle',
      performance: 65, attendance: 87, fees: 'partial', joinDate: '2020-02-03', photo: null,
      subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'],
      teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mr. David Byaruhanga', 'Ms. Sarah Acen', 'Mr. Paul Kintu'],
      repeats: [{ class: 'P3', year: '2022', reason: 'Below passing threshold' }],
      history: [
        { class: 'P1B', year: '2020', avg: 58, position: '30/45', remark: 'Promoted' },
        { class: 'P2A', year: '2021', avg: 52, position: '35/48', remark: 'Promoted' },
        { class: 'P3A', year: '2022', avg: 38, position: '38/40', remark: 'Repeated' },
        { class: 'P3B', year: '2023', avg: 62, position: '20/42', remark: 'Promoted' },
        { class: 'P4A', year: '2023', avg: 60, position: '28/52', remark: 'Promoted' },
        { class: 'P5A', year: '2024', avg: 65, position: '22/44', remark: 'Current' },
      ]
    },
    { id: 'STU-004', name: 'Faith Ssali', class: 'P4B', age: 10, gender: 'Female',
      parent: 'Daniel Ssali', parentPhone: '+256 754 444555', parentEmail: 'daniel.ssali@mail.com',
      parent1Name: 'Daniel Ssali', parent1Phone: '+256 754 444555', parent1Relation: 'Father', parent1Email: 'daniel.ssali@mail.com',
      parent2Name: 'Rose Ssali', parent2Phone: '+256 788 333111', parent2Relation: 'Mother', parent2Email: 'rose.ssali@mail.com',
      nextOfKinName: 'Joseph Kintu', nextOfKinPhone: '+256 701 999222', nextOfKinRelation: 'Grandparent',
      performance: 78, attendance: 92, fees: 'overdue', joinDate: '2021-02-01', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education', 'Physical Education'],
      teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mr. David Byaruhanga', 'Ms. Sarah Acen', 'Mr. Paul Kintu', 'Mrs. Florence Nalubega'],
      repeats: [],
      history: [
        { class: 'P1A', year: '2021', avg: 75, position: '10/45', remark: 'Promoted' },
        { class: 'P2B', year: '2022', avg: 77, position: '9/48', remark: 'Promoted' },
        { class: 'P3A', year: '2023', avg: 80, position: '7/40', remark: 'Promoted' },
        { class: 'P4B', year: '2024', avg: 78, position: '8/52', remark: 'Current' },
      ]
    },
    { id: 'STU-005', name: 'Moses Achola', class: 'P7B', age: 13, gender: 'Male',
      parent: 'Helen Achola', parentPhone: '+256 700 555666', parentEmail: 'helen.achola@mail.com',
      parent1Name: 'Helen Achola', parent1Phone: '+256 700 555666', parent1Relation: 'Mother', parent1Email: 'helen.achola@mail.com',
      parent2Name: '', parent2Phone: '', parent2Relation: 'Father', parent2Email: '',
      nextOfKinName: 'Peter Achola', nextOfKinPhone: '+256 777 666111', nextOfKinRelation: 'Brother',
      performance: 55, attendance: 76, fees: 'paid', joinDate: '2018-02-05', photo: null,
      subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'],
      teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mr. David Byaruhanga', 'Ms. Sarah Acen', 'Mr. Paul Kintu'],
      repeats: [{ class: 'P5', year: '2023', reason: 'Poor performance in core subjects' }],
      history: [
        { class: 'P1B', year: '2018', avg: 60, position: '25/45', remark: 'Promoted' },
        { class: 'P2A', year: '2019', avg: 55, position: '30/48', remark: 'Promoted' },
        { class: 'P3B', year: '2020', avg: 50, position: '32/40', remark: 'Promoted' },
        { class: 'P4A', year: '2021', avg: 48, position: '40/52', remark: 'Promoted' },
        { class: 'P5A', year: '2022', avg: 35, position: '42/44', remark: 'Repeated' },
        { class: 'P5B', year: '2023', avg: 52, position: '30/44', remark: 'Promoted' },
        { class: 'P6A', year: '2023', avg: 54, position: '38/50', remark: 'Promoted' },
        { class: 'P7B', year: '2024', avg: 55, position: '30/38', remark: 'Current' },
      ]
    },
    { id: 'STU-006', name: 'Ruth Nabirye', class: 'P3A', age: 9, gender: 'Female',
      parent: 'James Nabirye', parentPhone: '+256 779 666777', parentEmail: 'james.nabirye@mail.com',
      parent1Name: 'James Nabirye', parent1Phone: '+256 779 666777', parent1Relation: 'Father', parent1Email: 'james.nabirye@mail.com',
      parent2Name: 'Agnes Nabirye', parent2Phone: '+256 755 888999', parent2Relation: 'Mother', parent2Email: 'agnes.n@mail.com',
      nextOfKinName: 'Grace Nabirye', nextOfKinPhone: '+256 701 444777', nextOfKinRelation: 'Sister',
      performance: 88, attendance: 100, fees: 'paid', joinDate: '2022-02-07', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'English', 'Literacy I', 'Literacy II', 'Religious Education'],
      teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mrs. Jane Namulindwa', 'Mr. Simon Musoke', 'Mr. Paul Kintu'],
      repeats: [],
      history: [
        { class: 'P1A', year: '2022', avg: 85, position: '5/45', remark: 'Promoted' },
        { class: 'P2B', year: '2023', avg: 87, position: '4/48', remark: 'Promoted' },
        { class: 'P3A', year: '2024', avg: 88, position: '3/40', remark: 'Current' },
      ]
    },
]

export default function SchoolAdminStudents() {
    const [students, setStudents] = useState(initialPrimaryStudents)
    const [classFilter, setClassFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [relocateTarget, setRelocateTarget] = useState('P1')
    const [reportStudent, setReportStudent] = useState(null)
    const [reportToast, setReportToast] = useState(null)

    // New student registration form state (Allows max 2 parents + 1 next of kin)
    const [newStudent, setNewStudent] = useState({
        name: '',
        photo: null,
        class: 'P1',
        age: 6,
        gender: 'Male',
        fees: 'paid',
        // Parent 1 (Primary)
        parent1Name: '',
        parent1Phone: '',
        parent1Relation: 'Mother',
        parent1Email: '',
        // Parent 2 (Secondary - Optional)
        parent2Name: '',
        parent2Phone: '',
        parent2Relation: 'Father',
        parent2Email: '',
        // Next of Kin (Emergency Contact)
        nextOfKinName: '',
        nextOfKinPhone: '',
        nextOfKinRelation: 'Uncle'
    })

    const resetNewStudent = () => {
        setNewStudent({
            name: '',
            photo: null,
            class: 'P1',
            age: 6,
            gender: 'Male',
            fees: 'paid',
            parent1Name: '',
            parent1Phone: '',
            parent1Relation: 'Mother',
            parent1Email: '',
            parent2Name: '',
            parent2Phone: '',
            parent2Relation: 'Father',
            parent2Email: '',
            nextOfKinName: '',
            nextOfKinPhone: '',
            nextOfKinRelation: 'Uncle'
        })
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewStudent(prev => ({ ...prev, photo: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEnrollStudent = () => {
        if (!newStudent.name.trim()) {
            triggerToast('Please enter a valid pupil full name.')
            return
        }
        if (!newStudent.parent1Name.trim() || !newStudent.parent1Phone.trim()) {
            triggerToast('Please provide Primary Parent / Guardian (Parent 1) name & phone.')
            return
        }
        if (!newStudent.nextOfKinName.trim() || !newStudent.nextOfKinPhone.trim()) {
            triggerToast('Please provide Next of Kin name & contact number.')
            return
        }

        const createdStudent = {
            id: `STU-${String(students.length + 1).padStart(3, '0')}`,
            name: newStudent.name,
            photo: newStudent.photo,
            class: newStudent.class,
            age: Number(newStudent.age) || 7,
            gender: newStudent.gender,
            parent: newStudent.parent1Name,
            parentPhone: newStudent.parent1Phone,
            parentEmail: newStudent.parent1Email || `${newStudent.name.toLowerCase().replace(/[^a-z]/g, '')}@mail.com`,
            parent1Name: newStudent.parent1Name,
            parent1Phone: newStudent.parent1Phone,
            parent1Relation: newStudent.parent1Relation,
            parent1Email: newStudent.parent1Email,
            parent2Name: newStudent.parent2Name || '',
            parent2Phone: newStudent.parent2Phone || '',
            parent2Relation: newStudent.parent2Relation || 'Father',
            parent2Email: newStudent.parent2Email || '',
            nextOfKinName: newStudent.nextOfKinName,
            nextOfKinPhone: newStudent.nextOfKinPhone,
            nextOfKinRelation: newStudent.nextOfKinRelation,
            performance: 75,
            attendance: 100,
            fees: newStudent.fees,
            joinDate: new Date().toISOString().split('T')[0],
            subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'],
            teachers: ['Mr. Kenneth Okello', 'Ms. Agnes Nassali', 'Mr. David Byaruhanga', 'Ms. Sarah Acen'],
            repeats: [],
            history: [
                { class: newStudent.class, year: '2026', avg: 75, position: 'New', remark: 'Enrolled' }
            ]
        }
        setStudents([createdStudent, ...students])
        setModal(null)
        resetNewStudent()
        triggerToast(`Pupil ${createdStudent.name} successfully enrolled in ${createdStudent.class}!`)
    }

    const triggerToast = (msg) => {
        setReportToast(msg)
        setTimeout(() => setReportToast(null), 3000)
    }

    const classes = ['All', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6A', 'P6B', 'P7']
    const relocateClasses = classes.filter(c => c !== 'All')

    const filtered = students.filter(s => (classFilter === 'All' || s.class.startsWith(classFilter)) && (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)))

    const openAutoPromote = () => setModal('autopromote')

    const getAvgHistory = (student) => {
        const scores = student.history.map(h => h.avg)
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    }

    return (
        <DashboardLayout role="schooladmin-primary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Students</h1><p className="page-subtitle">Manage all enrolled students</p></div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('import')}><Upload size={15} /> Import</button>
                        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2" onClick={openAutoPromote}><Zap size={15} /> Auto-Promote</button>
                        <button className="btn-primary" onClick={() => setModal('enroll')}><Plus size={15} /> Enroll Student</button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {classes.map(c => (
                        <button key={c} onClick={() => setClassFilter(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${classFilter === c ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>{c}</button>
                    ))}
                    <div className="ml-auto relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-60" placeholder="Search students..." /></div>
                </div>

                <div className="card p-0">
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Student', 'ID', 'Class', 'Parent Contact', 'Performance', 'Fees', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 cursor-pointer transition-colors" onClick={(e) => { if (e.target.closest('button')) return; setSelected(s); setModal('view'); }}>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            {s.photo ? (
                                                <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-600 flex-shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{s.name[0]}</div>
                                            )}
                                            <div><p className="text-sm font-semibold dark:text-white">{s.name}</p><p className="text-xs text-gray-400 dark:text-slate-500">{s.age} yrs • {s.gender}</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell font-mono text-xs text-gray-500 dark:text-slate-400">{s.id}</td>
                                    <td className="table-cell"><Badge variant="info">{s.class}</Badge></td>
                                    <td className="table-cell text-xs text-gray-600 dark:text-slate-300">
                                        <p className="font-semibold text-gray-900 dark:text-white">{s.parent1Name || s.parent}</p>
                                        <p className="text-gray-400 dark:text-slate-500 flex items-center gap-1"><Phone size={10} /> {s.parent1Phone || s.parentPhone}</p>
                                        {s.nextOfKinName && (
                                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                                NoK: {s.nextOfKinName} ({s.nextOfKinPhone})
                                            </p>
                                        )}
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-100 dark:bg-slate-700/50 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.performance >= 80 ? 'bg-emerald-500' : s.performance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.performance}%` }} /></div>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{s.performance}%</span>
                                            {s.performance >= 80 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
                                        </div>
                                    </td>
                                    <td className="table-cell"><Badge variant={s.fees === 'paid' ? 'success' : s.fees === 'partial' ? 'warning' : 'danger'}>{s.fees}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelected(s); setModal('relocate') }} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"><MoveRight size={12} /> Relocate</button>
                                            <button onClick={() => { setSelected(s); setModal('promote') }} className="btn-primary text-xs py-1 px-2 text-white bg-blue-600 hover:bg-blue-700">Promote</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-slate-400">{filtered.length} students</p>
                        <div className="flex gap-2"><button className="btn-secondary text-xs py-1 px-3">Previous</button><button className="btn-primary text-xs py-1 px-3">Next</button></div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'relocate'} onClose={() => setModal(null)} title={`Relocate Student: ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}>Confirm Relocation</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-slate-300">Move <strong>{selected.name}</strong> to a different class stream or entirely new level.</p>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4"><p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Current Class: {selected.class}</p></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Target Class</label>
                            <select className="input-field w-full" value={relocateTarget} onChange={(e) => setRelocateTarget(e.target.value)}>
                                {relocateClasses.filter(c => c !== selected.class).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason for Relocation</label>
                            <input className="input-field w-full" placeholder="e.g. Stream balancing, requested by parent" />
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'promote'} onClose={() => setModal(null)} title={`Promote / Repeat — ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-success" onClick={() => setModal(null)}>Promote to Next Class</button><button className="btn-danger" onClick={() => setModal(null)}>Mark as Repeat</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><p className="text-sm font-semibold dark:text-slate-300">Current Class: <span className="text-primary-600 dark:text-primary-400">{selected.class}</span> → Next: <span className="text-emerald-600 dark:text-emerald-400">{selected.class.startsWith('P7') ? 'Graduated' : selected.class.replace(/\d/, d => +d + 1)}</span></p></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason if repeating</label><textarea className="input-field resize-none w-full" rows={3} placeholder="e.g., Did not meet the minimum score threshold..." /></div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'autopromote'} onClose={() => setModal(null)} title="Auto-Promote Students" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors" onClick={() => setModal(null)}><CheckSquare size={16} /> Confirm Auto-Promotion</button></>}>
                <div className="space-y-5">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2"><Zap size={18} /> System Auto-Promotion</h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Automatically promote all students with an average score of <strong>40% or higher</strong> to the next class. Students below 40% will be marked to repeat.</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-slate-700 pb-2"><h3 className="font-semibold text-gray-900 dark:text-white">Promotion Preview</h3></div>
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700/50"><tr><th className="p-3 text-left">Student</th><th className="p-3 text-left">Current</th><th className="p-3 text-left">Avg Score</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Target Class</th></tr></thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">{students.map(s => { const avg = getAvgHistory(s); const willPromote = avg >= 40; return (<tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/20"><td className="p-3 font-semibold dark:text-white">{s.name}</td><td className="p-3"><Badge variant="info">{s.class}</Badge></td><td className="p-3"><span className={`font-bold ${willPromote ? 'text-emerald-600' : 'text-red-600'}`}>{avg}%</span></td><td className="p-3">{willPromote ? <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">Promote</span> : <span className="text-xs font-semibold text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5 rounded-full">Repeat</span>}</td><td className="p-3 font-medium text-gray-700 dark:text-slate-300">{willPromote ? (s.class.startsWith('P7') ? 'Graduated' : s.class.replace(/\d/, d => +d + 1)) : s.class}</td></tr>); })}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Enhanced Student Profile Modal */}
            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Student Profile" size="xl"
                footer={<div className="flex justify-end w-full"><button className="btn-secondary" onClick={() => setModal(null)}>Close</button></div>}>
                {selected && (
                    <div className="space-y-6">
                        {/* Header with photo and basic info */}
                        <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700/50 rounded-2xl border border-blue-100 dark:border-slate-700">
                            {selected.photo ? (
                                <img src={selected.photo} alt={selected.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700 flex-shrink-0" />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
                                    {selected.name.split(' ').map(n => n[0]).join('')}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Student ID: <span className="font-mono font-semibold text-gray-700 dark:text-slate-300">{selected.id}</span></p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="info">{selected.class}</Badge>
                                    <Badge variant={selected.fees === 'paid' ? 'success' : selected.fees === 'partial' ? 'warning' : 'danger'}>{selected.fees}</Badge>
                                    {selected.repeats.length > 0 && <Badge variant="warning">{selected.repeats.length} Repeat(s)</Badge>}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className="text-right">
                                    <p className={`text-3xl font-bold ${selected.performance >= 80 ? 'text-emerald-600 dark:text-emerald-400' : selected.performance >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{selected.performance}%</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Current Score</p>
                                </div>
                                <button
                                    onClick={() => setReportStudent(selected)}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                                >
                                    <FileText size={14} /> Generate Academic Report
                                </button>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: User, label: 'Age', value: `${selected.age} years`, color: 'blue' },
                                { icon: User, label: 'Gender', value: selected.gender, color: 'blue' },
                                { icon: Calendar, label: 'Joined', value: new Date(selected.joinDate).toLocaleDateString('en-UG', { year: 'numeric', month: 'short' }), color: 'emerald' },
                                { icon: Award, label: 'Avg Performance', value: `${getAvgHistory(selected)}%`, color: 'amber' },
                            ].map(item => (
                                <div key={item.label} className={`bg-${item.color}-50 dark:bg-${item.color}-900/10 border border-${item.color}-100 dark:border-${item.color}-800/30 p-3 rounded-xl`}>
                                    <item.icon size={14} className={`text-${item.color}-500 mb-1`} />
                                    <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Parents (Max 2) & Next of Kin Emergency Contacts */}
                        <div className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                    <User size={15} className="text-blue-600" /> Parents &amp; Emergency Contacts
                                </h4>
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
                                    Max 2 Parents &bull; 1 Next of Kin
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Parent 1 (Primary) */}
                                <div className="bg-blue-50/60 dark:bg-slate-700/40 border border-blue-100 dark:border-slate-600 p-3 rounded-xl space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Parent 1 (Primary)</span>
                                        <Badge variant="info">{selected.parent1Relation || 'Primary'}</Badge>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selected.parent1Name || selected.parent}</p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 flex items-center gap-1.5">
                                        <Phone size={11} className="text-blue-500" /> {selected.parent1Phone || selected.parentPhone}
                                    </p>
                                    {(selected.parent1Email || selected.parentEmail) && (
                                        <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{selected.parent1Email || selected.parentEmail}</p>
                                    )}
                                </div>

                                {/* Parent 2 (Secondary) */}
                                <div className="bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 p-3 rounded-xl space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Parent 2 (Secondary)</span>
                                        {selected.parent2Name ? <Badge variant="secondary">{selected.parent2Relation || 'Father'}</Badge> : <span className="text-[10px] text-gray-400 italic">None</span>}
                                    </div>
                                    {selected.parent2Name ? (
                                        <>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{selected.parent2Name}</p>
                                            <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 flex items-center gap-1.5">
                                                <Phone size={11} className="text-slate-500" /> {selected.parent2Phone}
                                            </p>
                                            {selected.parent2Email && (
                                                <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{selected.parent2Email}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-400 dark:text-slate-400 italic pt-2">No 2nd parent registered</p>
                                    )}
                                </div>

                                {/* Next of Kin (Emergency Contact) */}
                                <div className="bg-amber-50/60 dark:bg-slate-700/40 border border-amber-200 dark:border-slate-600 p-3 rounded-xl space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Next of Kin</span>
                                        <Badge variant="warning">{selected.nextOfKinRelation || 'Next of Kin'}</Badge>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selected.nextOfKinName || 'Emergency Contact'}</p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 flex items-center gap-1.5">
                                        <Phone size={11} className="text-amber-500" /> {selected.nextOfKinPhone || selected.parentPhone}
                                    </p>
                                    <p className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">&bull; Emergency Contact</p>
                                </div>
                            </div>
                        </div>

                        {/* Current Subjects & Teachers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen size={14} className="text-emerald-500" /> Current Subjects</h4>
                                <ul className="space-y-1.5">{selected.subjects.map((sub, i) => (<li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{sub}</li>))}</ul>
                            </div>
                            <div className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2"><GraduationCap size={14} className="text-blue-500" /> Teachers</h4>
                                <ul className="space-y-1.5">{selected.teachers.map((t, i) => (<li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{t}</li>))}</ul>
                            </div>
                        </div>

                        {/* Repeats warning */}
                        {selected.repeats.length > 0 && (
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                                <h4 className="font-bold text-sm text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2"><RotateCcw size={14} /> Class Repeats ({selected.repeats.length})</h4>
                                {selected.repeats.map((r, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-amber-700 dark:text-amber-300 mt-1">
                                        <Badge variant="warning">{r.class}</Badge>
                                        <span>{r.year} — {r.reason}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Academic History Timeline */}
                        <div className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Clock size={14} className="text-purple-500" /> Academic History</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                        <th className="pb-2 text-left font-semibold">Year</th><th className="pb-2 text-left font-semibold">Class</th><th className="pb-2 text-center font-semibold">Avg Score</th><th className="pb-2 text-center font-semibold">Position</th><th className="pb-2 text-left font-semibold">Remark</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                        {selected.history.map((h, i) => (
                                            <tr key={i} className={h.remark === 'Repeated' ? 'bg-red-50/30 dark:bg-red-900/10' : h.remark === 'Current' ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}>
                                                <td className="py-2.5 text-gray-700 dark:text-slate-300 font-medium">{h.year}</td>
                                                <td className="py-2.5"><Badge variant="info">{h.class}</Badge></td>
                                                <td className={`py-2.5 text-center font-bold ${h.avg >= 80 ? 'text-emerald-600 dark:text-emerald-400' : h.avg >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{h.avg}%</td>
                                                <td className="py-2.5 text-center text-gray-600 dark:text-slate-300 font-medium">{h.position}</td>
                                                <td className="py-2.5">
                                                    <Badge variant={h.remark === 'Repeated' ? 'danger' : h.remark === 'Current' ? 'info' : h.remark === 'COVID Year' ? 'warning' : 'success'}>{h.remark}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Official Primary Academic Report Card Modal */}
            <Modal
                isOpen={!!reportStudent}
                onClose={() => setReportStudent(null)}
                title="Academic Report"
                size="2xl"
                footer={
                    <div className="flex flex-wrap items-center justify-between w-full gap-2">
                        <button className="btn-secondary" onClick={() => setReportStudent(null)}>Close Preview</button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => triggerToast(`Academic report link sent to parent (${reportStudent?.parentPhone}) via SMS!`)}
                                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                                <Send size={14} /> Send to Parent (SMS)
                            </button>
                            <button
                                onClick={() => triggerToast(`Academic Report PDF generated for ${reportStudent?.name}!`)}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                                <Download size={14} /> Download PDF
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                                <Printer size={14} /> Print Report
                            </button>
                        </div>
                    </div>
                }
            >
                {reportStudent && (
                    <div className="space-y-5 bg-white dark:bg-slate-900 p-2 sm:p-4 rounded-xl print:p-0">
                        {/* School Header */}
                        <div className="text-center border-b border-gray-200 dark:border-slate-700 pb-3">
                            <div className="flex items-center justify-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                    <GraduationCap size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Kampala Primary School
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Academic Report — Term 1 2026
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pupil Biodata Summary Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Student Name</span>
                                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{reportStudent.name}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Student ID</span>
                                <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">{reportStudent.id}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Class</span>
                                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{reportStudent.class}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Attendance</span>
                                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{reportStudent.attendance}% (47/50 Days)</p>
                            </div>
                        </div>

                        {/* NCDC Primary Competency Level Descriptors Guide */}
                        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800/50 text-[11px]">
                            <p className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                                <Award size={13} /> NCDC Primary Competency Mastery Descriptors:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] pt-1">
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-indigo-100 dark:border-slate-700">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">EE (Level 4 / 80-100%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Exceeding Expectations</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-indigo-100 dark:border-slate-700">
                                    <span className="font-bold text-blue-600 dark:text-blue-400">ME (Level 3 / 65-79%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Meeting Expectations</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-indigo-100 dark:border-slate-700">
                                    <span className="font-bold text-amber-600 dark:text-amber-400">AE (Level 2 / 50-64%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Approaching Expectations</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-indigo-100 dark:border-slate-700">
                                    <span className="font-bold text-red-600 dark:text-red-400">BE (Level 1 / 0-49%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Below Expectations</p>
                                </div>
                            </div>
                        </div>

                        {/* Primary Core Learning Areas & Competency Strands Table */}
                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold">
                                    <tr>
                                        <th className="p-2.5">Learning Area &amp; Teacher</th>
                                        <th className="p-2.5 text-center">Formative AoI (50%)</th>
                                        <th className="p-2.5 text-center">End of Term (50%)</th>
                                        <th className="p-2.5 text-center">Total (100%)</th>
                                        <th className="p-2.5 text-center">Mastery Level</th>
                                        <th className="p-2.5">Specific Learning Outcome Competency Achieved</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                                    {[
                                        { sub: 'English & Literacy I', teacher: 'Ms. Agnes Nassali', mt: 44, eot: 45, total: 89, level: 'EE (Level 4)', desc: 'Reads fluently with expression, writes coherent descriptive paragraphs, and demonstrates excellent spelling.' },
                                        { sub: 'Mathematics & Numeracy', teacher: 'Mr. Kenneth Okello', mt: 46, eot: 47, total: 93, level: 'EE (Level 4)', desc: 'Masters multi-digit arithmetic, solves fraction word problems, and calculates geometric perimeter accurately.' },
                                        { sub: 'Integrated Science & Health', teacher: 'Mr. David Byaruhanga', mt: 43, eot: 45, total: 88, level: 'EE (Level 4)', desc: 'Identifies plant/animal adaptations, demonstrates clean water filtration, and practices personal hygiene.' },
                                        { sub: 'Social Studies & R.E', teacher: 'Ms. Sarah Acen', mt: 42, eot: 44, total: 86, level: 'EE (Level 4)', desc: 'Explains Ugandan community heritage, civic leadership roles, and demonstrates strong moral values.' },
                                        { sub: 'Creative Arts & Physical Health', teacher: 'Mr. Paul Kintu', mt: 45, eot: 46, total: 91, level: 'EE (Level 4)', desc: 'Creates balanced local craft models, sings traditional folk melodies in tune, and displays agile physical coordination.' },
                                    ].map((r, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                                            <td className="p-2.5">
                                                <p className="font-bold text-gray-900 dark:text-white">{r.sub}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-slate-400">{r.teacher}</p>
                                            </td>
                                            <td className="p-2.5 text-center text-gray-600 dark:text-slate-300 font-mono">{r.mt} / 50</td>
                                            <td className="p-2.5 text-center text-gray-600 dark:text-slate-300 font-mono">{r.eot} / 50</td>
                                            <td className="p-2.5 text-center font-bold text-gray-900 dark:text-white font-mono">{r.total}%</td>
                                            <td className="p-2.5 text-center">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full font-black text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                    {r.level}
                                                </span>
                                            </td>
                                            <td className="p-2.5 text-gray-600 dark:text-slate-300 text-[11px] leading-snug">{r.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Holistic Life Skills & Values Rating */}
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-500" /> Pupil Life Skills, Behavioral Values &amp; Character Development
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { trait: 'Active Listening & Expression', score: 'EE (Level 4)', desc: 'Articulate & attentive' },
                                    { trait: 'Numeracy & Logic Reasoning', score: 'EE (Level 4)', desc: 'Fast mental computation' },
                                    { trait: 'Peer Empathy & Teamwork', score: 'EE (Level 4)', desc: 'Helpful and collaborative' },
                                    { trait: 'Personal Cleanliness & Neatness', score: 'EE (Level 4)', desc: 'Exemplary work habits' },
                                ].map((t, ti) => (
                                    <div key={ti} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700 text-center">
                                        <p className="font-bold text-gray-800 dark:text-slate-200 text-[11px]">{t.trait}</p>
                                        <p className="font-black text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">{t.score}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overall Primary Competency Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Overall Mastery</span>
                                <p className="text-base font-black text-blue-700 dark:text-blue-300 mt-0.5">HIGHLY COMPETENT (EE)</p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Composite Average</span>
                                <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">89.4% (Distinction)</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Class Position</span>
                                <p className="text-base font-black text-purple-700 dark:text-purple-300 mt-0.5">Position 1 / 38</p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Fee Clearance</span>
                                <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">CLEARED</p>
                            </div>
                        </div>

                        {/* Teacher & Headteacher Qualitative Endorsement */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">Class Teacher&apos;s Qualitative Remarks:</p>
                                <p className="text-gray-600 dark:text-slate-300 italic text-[11px]">
                                    &ldquo;Ivan is an inquisitive, highly capable pupil who reads extensively and solves mathematical problems with ease. He participates eagerly in group learning activities.&rdquo;
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-semibold">Teacher: Mr. Kenneth Okello (Digital Signature: Verified ✓)</p>
                            </div>

                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">Headteacher&apos;s Official Endorsement:</p>
                                <p className="text-gray-600 dark:text-slate-300 italic text-[11px]">
                                    &ldquo;Promoted with High Honors. An exemplary learner exhibiting the highest ideals of the Competency-Based Primary Curriculum.&rdquo;
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-semibold">Headteacher: Mr. Joseph Sserwadda (Official Seal: Verified ✓)</p>
                            </div>
                        </div>

                        {/* Resumption & Next Term Info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl text-xs">
                            <span className="text-gray-600 dark:text-slate-300">
                                📅 <strong>Next Term Begins:</strong> Monday, May 18, 2026
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">
                                CBC Ref: NCDC-PRI-2026-T1-{reportStudent.id}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Toast Notification */}
            {reportToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-bounce">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{reportToast}</span>
                </div>
            )}

            {/* Enroll / Add Student Modal with Photo Upload, 2 Parents & Next of Kin */}
            <Modal
                isOpen={modal === 'enroll'}
                onClose={() => { setModal(null); resetNewStudent() }}
                title="Enroll New Primary Pupil"
                size="xl"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setModal(null); resetNewStudent() }}>Cancel</button>
                        <button className="btn-primary flex items-center gap-1.5" onClick={handleEnrollStudent}>
                            <Plus size={14} /> Enroll Pupil
                        </button>
                    </>
                }
            >
                <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
                    {/* Section 1: Pupil Bio & Photo */}
                    <div className="p-4 bg-blue-50/60 dark:bg-slate-800/70 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-700/60 pb-2">
                            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                                <GraduationCap size={15} /> Pupil Biodata &amp; Photo
                            </span>
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Primary Section</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative group">
                                {newStudent.photo ? (
                                    <img
                                        src={newStudent.photo}
                                        alt="Student Preview"
                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 border-2 border-dashed border-blue-300 dark:border-slate-600 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Camera size={20} />
                                        <span className="text-[9px] font-bold mt-0.5">Photo</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left space-y-1">
                                <label className="text-xs font-bold text-gray-800 dark:text-white block">
                                    Pupil Passport / Portrait Photo
                                </label>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                                    Upload a clear portrait photo for school records and academic report cards.
                                </p>
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer shadow-sm">
                                    <Upload size={13} />
                                    <span>{newStudent.photo ? 'Change Photo' : 'Upload Image'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                            <div className="sm:col-span-2">
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Full Pupil Name *</label>
                                <input
                                    type="text"
                                    className="input-field text-xs"
                                    placeholder="e.g., Jonathan Lwanga"
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Assigned Class *</label>
                                <select
                                    className="select-field text-xs font-semibold"
                                    value={newStudent.class}
                                    onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
                                >
                                    {classes.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Gender</label>
                                <select
                                    className="select-field text-xs"
                                    value={newStudent.gender}
                                    onChange={e => setNewStudent({ ...newStudent, gender: e.target.value })}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Age (Years)</label>
                                <input
                                    type="number"
                                    min="4"
                                    max="18"
                                    className="input-field text-xs"
                                    value={newStudent.age}
                                    onChange={e => setNewStudent({ ...newStudent, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Initial Fees Status</label>
                                <select
                                    className="select-field text-xs"
                                    value={newStudent.fees}
                                    onChange={e => setNewStudent({ ...newStudent, fees: e.target.value })}
                                >
                                    <option value="paid">Paid in Full</option>
                                    <option value="partial">Partial Payment</option>
                                    <option value="overdue">Pending / Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Parents (Up to 2 Parents Allowed) */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                <User size={15} className="text-blue-600 dark:text-blue-400" /> Parents / Guardians (Maximum 2 Parents)
                            </span>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
                                2 Parents Allowed
                            </span>
                        </div>

                        {/* Parent 1 (Primary) */}
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                                    <h5 className="text-xs font-bold text-gray-800 dark:text-white">Parent / Guardian 1 (Primary Contact) *</h5>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400 font-medium">Link to Sibling's Parent:</span>
                                    <select
                                        className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300"
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (!val) return
                                            const parts = val.split('|')
                                            setNewStudent(prev => ({
                                                ...prev,
                                                parent1Name: parts[0] || prev.parent1Name,
                                                parent1Phone: parts[1] || prev.parent1Phone,
                                                parent1Email: parts[2] || prev.parent1Email,
                                                parent1Relation: parts[3] || prev.parent1Relation,
                                                parent: parts[0] || prev.parent,
                                                parentPhone: parts[1] || prev.parentPhone,
                                                parentEmail: parts[2] || prev.parentEmail
                                            }))
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="">-- Choose Existing Parent --</option>
                                        <option value="Mary Namukasa|+256 772 111222|mary.n@email.com|Mother">Mary Namukasa (Ivan &amp; Sarah's Parent)</option>
                                        <option value="John Mukasa|+256 752 333444|john.m@email.com|Father">John Mukasa (Peter's Parent)</option>
                                        <option value="David Opio|+256 780 777888|david.o@email.com|Father">David Opio (Daniel &amp; Esther's Parent)</option>
                                        <option value="Alice Kemigisha|+256 701 555666|alice.k@email.com|Mother">Alice Kemigisha (Paul's Parent)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        className="input-field text-xs"
                                        placeholder="e.g., Sarah Lwanga"
                                        value={newStudent.parent1Name}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className="input-field text-xs"
                                        placeholder="+256 772 987654"
                                        value={newStudent.parent1Phone}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Relationship</label>
                                    <select
                                        className="select-field text-xs"
                                        value={newStudent.parent1Relation}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Relation: e.target.value })}
                                    >
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Guardian">Guardian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="input-field text-xs"
                                        placeholder="sarah.l@mail.com"
                                        value={newStudent.parent1Email}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Parent 2 (Secondary - Optional) */}
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-slate-600 dark:bg-slate-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                                    <h5 className="text-xs font-bold text-gray-800 dark:text-white">Parent / Guardian 2 (Secondary Contact)</h5>
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-slate-400 italic">Optional (Max 2nd parent)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field text-xs"
                                        placeholder="e.g., Charles Lwanga"
                                        value={newStudent.parent2Name}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input-field text-xs"
                                        placeholder="+256 701 123456"
                                        value={newStudent.parent2Phone}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Relationship</label>
                                    <select
                                        className="select-field text-xs"
                                        value={newStudent.parent2Relation}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Relation: e.target.value })}
                                    >
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Guardian">Guardian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="input-field text-xs"
                                        placeholder="charles.l@mail.com"
                                        value={newStudent.parent2Email}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Next of Kin (Emergency Contact) */}
                    <div className="p-4 bg-amber-50/50 dark:bg-slate-800/70 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between border-b border-amber-200/70 dark:border-slate-700/60 pb-2">
                            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Phone size={15} className="text-amber-600" /> Next of Kin (Emergency Contact) *
                            </span>
                            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                                Emergency Line
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Next of Kin Full Name *</label>
                                <input
                                    type="text"
                                    className="input-field text-xs"
                                    placeholder="e.g., Uncle Paul Mukasa"
                                    value={newStudent.nextOfKinName}
                                    onChange={e => setNewStudent({ ...newStudent, nextOfKinName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Next of Kin Phone *</label>
                                <input
                                    type="tel"
                                    className="input-field text-xs"
                                    placeholder="+256 780 444555"
                                    value={newStudent.nextOfKinPhone}
                                    onChange={e => setNewStudent({ ...newStudent, nextOfKinPhone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-slate-200 mb-1">Relationship to Pupil *</label>
                                <select
                                    className="select-field text-xs"
                                    value={newStudent.nextOfKinRelation}
                                    onChange={e => setNewStudent({ ...newStudent, nextOfKinRelation: e.target.value })}
                                >
                                    <option value="Uncle">Uncle</option>
                                    <option value="Aunt">Aunt</option>
                                    <option value="Brother">Brother</option>
                                    <option value="Sister">Sister</option>
                                    <option value="Grandparent">Grandparent</option>
                                    <option value="Legal Guardian">Legal Guardian</option>
                                    <option value="Family Friend">Family Friend</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'import'} onClose={() => setModal(null)} title="Import Students"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Upload size={14} /> Import</button></>}>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                        <Upload size={28} className="mx-auto text-gray-400 dark:text-slate-500 mb-2" />
                        <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Drop .xlsx or .csv here</p>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
