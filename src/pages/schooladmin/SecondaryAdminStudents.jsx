import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, TrendingUp, TrendingDown, Upload, Filter, Zap, CheckSquare, MoveRight, Eye, User, Phone, Calendar, BookOpen, Clock, Award, MapPin, RotateCcw, GraduationCap, Printer, Download, FileText, Send, CheckCircle2, Share2, Sparkles, Check, Camera } from 'lucide-react'

const initialSecondaryStudents = [
    { id: 'STU-S-042', name: 'Mary Namukasa', class: 'S1B', age: 14, gender: 'Female',
      parent: 'Jane Namukasa', parentPhone: '+256 772 111222', parentEmail: 'jane.namukasa@mail.com',
      parent1Name: 'Jane Namukasa', parent1Phone: '+256 772 111222', parent1Relation: 'Mother', parent1Email: 'jane.namukasa@mail.com',
      parent2Name: 'Robert Namukasa', parent2Phone: '+256 701 333555', parent2Relation: 'Father', parent2Email: 'robert.n@mail.com',
      nextOfKinName: 'Aunt Harriet Nambi', nextOfKinPhone: '+256 779 888999', nextOfKinRelation: 'Aunt',
      performance: 78, attendance: 98, fees: 'paid', joinDate: '2024-02-05', photo: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
      teachers: ['Mr. Patrick Mugisha', 'Ms. Dorothy Nassali', 'Mr. Brian Okello', 'Ms. Rita Acen', 'Mr. Julius Kintu', 'Ms. Harriet Nambi', 'Mr. Frank Kamya'],
      repeats: [],
      history: [
        { class: 'S1B', year: '2024', avg: 78, position: '12/50', remark: 'Current' },
      ]
    },
    { id: 'STU-S-015', name: 'John Doe', class: 'S3A', age: 16, gender: 'Male',
      parent: 'Jane Doe', parentPhone: '+256 701 222333', parentEmail: 'jane.doe@mail.com',
      parent1Name: 'Jane Doe', parent1Phone: '+256 701 222333', parent1Relation: 'Mother', parent1Email: 'jane.doe@mail.com',
      parent2Name: 'Peter Doe', parent2Phone: '+256 752 444666', parent2Relation: 'Father', parent2Email: 'peter.doe@mail.com',
      nextOfKinName: 'Uncle Mark Doe', nextOfKinPhone: '+256 780 111222', nextOfKinRelation: 'Uncle',
      performance: 85, attendance: 95, fees: 'paid', joinDate: '2022-02-07', photo: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
      teachers: ['Mr. Patrick Mugisha', 'Ms. Dorothy Nassali', 'Mr. Brian Okello', 'Ms. Rita Acen', 'Mr. Julius Kintu', 'Ms. Harriet Nambi', 'Mr. Frank Kamya'],
      repeats: [],
      history: [
        { class: 'S1A', year: '2022', avg: 80, position: '8/50', remark: 'Promoted' },
        { class: 'S2A', year: '2023', avg: 82, position: '6/48', remark: 'Promoted' },
        { class: 'S3A', year: '2024', avg: 85, position: '4/45', remark: 'Current' },
      ]
    },
    { id: 'STU-S-088', name: 'Peter Pan', class: 'S4A', age: 17, gender: 'Male',
      parent: 'Wendy Pan', parentPhone: '+256 785 333444', parentEmail: 'wendy.pan@mail.com',
      parent1Name: 'Wendy Pan', parent1Phone: '+256 785 333444', parent1Relation: 'Mother', parent1Email: 'wendy.pan@mail.com',
      parent2Name: '', parent2Phone: '', parent2Relation: 'Father', parent2Email: '',
      nextOfKinName: 'George Pan', nextOfKinPhone: '+256 777 999333', nextOfKinRelation: 'Uncle',
      performance: 62, attendance: 82, fees: 'partial', joinDate: '2021-02-01', photo: null,
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
      teachers: ['Mr. Patrick Mugisha', 'Ms. Dorothy Nassali', 'Mr. Brian Okello', 'Ms. Rita Acen', 'Mr. Julius Kintu', 'Ms. Harriet Nambi', 'Mr. Frank Kamya'],
      repeats: [{ class: 'S2', year: '2023', reason: 'Failed core subjects' }],
      history: [
        { class: 'S1A', year: '2021', avg: 58, position: '30/50', remark: 'Promoted' },
        { class: 'S2B', year: '2022', avg: 38, position: '44/48', remark: 'Repeated' },
        { class: 'S2A', year: '2023', avg: 55, position: '28/48', remark: 'Promoted' },
        { class: 'S3A', year: '2023', avg: 60, position: '25/45', remark: 'Promoted' },
        { class: 'S4A', year: '2024', avg: 62, position: '22/40', remark: 'Current' },
      ]
    },
    { id: 'STU-S-102', name: 'Alice Wonderland', class: 'S6', age: 19, gender: 'Female',
      parent: 'Catherine Wonderland', parentPhone: '+256 754 444555', parentEmail: 'catherine.w@mail.com',
      parent1Name: 'Catherine Wonderland', parent1Phone: '+256 754 444555', parent1Relation: 'Mother', parent1Email: 'catherine.w@mail.com',
      parent2Name: 'Henry Wonderland', parent2Phone: '+256 788 111333', parent2Relation: 'Father', parent2Email: 'henry.w@mail.com',
      nextOfKinName: 'Doreen Nakato', nextOfKinPhone: '+256 701 555777', nextOfKinRelation: 'Aunt',
      performance: 92, attendance: 100, fees: 'paid', joinDate: '2019-02-04', photo: 'https://images.unsplash.com/photo-1595956553066-fe24a8c33395?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'Physics', 'Economics', 'General Paper'],
      teachers: ['Mr. Patrick Mugisha', 'Mr. Brian Okello', 'Ms. Grace Muwonge', 'Ms. Dorothy Nassali'],
      repeats: [],
      history: [
        { class: 'S1A', year: '2019', avg: 88, position: '3/50', remark: 'Promoted' },
        { class: 'S2A', year: '2020', avg: 90, position: '2/48', remark: 'Promoted' },
        { class: 'S3A', year: '2021', avg: 91, position: '1/45', remark: 'Promoted' },
        { class: 'S4A', year: '2022', avg: 93, position: '1/40', remark: 'Promoted' },
        { class: 'S5', year: '2023', avg: 90, position: '2/35', remark: 'Promoted' },
        { class: 'S6', year: '2024', avg: 92, position: '1/30', remark: 'Current' },
      ]
    },
    { id: 'STU-S-201', name: 'Kenneth Sserwanga', class: 'S2A', age: 15, gender: 'Male',
      parent: 'Robert Sserwanga', parentPhone: '+256 700 888999', parentEmail: 'robert.sser@mail.com',
      parent1Name: 'Robert Sserwanga', parent1Phone: '+256 700 888999', parent1Relation: 'Father', parent1Email: 'robert.sser@mail.com',
      parent2Name: '', parent2Phone: '', parent2Relation: 'Mother', parent2Email: '',
      nextOfKinName: 'Samuel Sserwanga', nextOfKinPhone: '+256 772 444111', nextOfKinRelation: 'Brother',
      performance: 71, attendance: 89, fees: 'paid', joinDate: '2023-02-06', photo: null,
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
      teachers: ['Mr. Patrick Mugisha', 'Ms. Dorothy Nassali', 'Mr. Brian Okello', 'Ms. Rita Acen', 'Mr. Julius Kintu', 'Ms. Harriet Nambi', 'Mr. Frank Kamya'],
      repeats: [],
      history: [
        { class: 'S1B', year: '2023', avg: 68, position: '18/50', remark: 'Promoted' },
        { class: 'S2A', year: '2024', avg: 71, position: '15/48', remark: 'Current' },
      ]
    },
    { id: 'STU-S-156', name: 'Prossy Birungi', class: 'S5', age: 18, gender: 'Female',
      parent: 'Samuel Birungi', parentPhone: '+256 779 777888', parentEmail: 'samuel.birungi@mail.com',
      parent1Name: 'Samuel Birungi', parent1Phone: '+256 779 777888', parent1Relation: 'Father', parent1Email: 'samuel.birungi@mail.com',
      parent2Name: 'Grace Birungi', parent2Phone: '+256 754 222111', parent2Relation: 'Mother', parent2Email: 'grace.b@mail.com',
      nextOfKinName: 'Evelyn Birungi', nextOfKinPhone: '+256 700 333222', nextOfKinRelation: 'Sister',
      performance: 87, attendance: 96, fees: 'paid', joinDate: '2020-02-03', photo: 'https://images.unsplash.com/photo-1542810205-0a5b379f6a47?w=150&auto=format&fit=crop&q=80',
      subjects: ['Mathematics', 'Physics', 'Economics', 'General Paper'],
      teachers: ['Mr. Patrick Mugisha', 'Mr. Brian Okello', 'Ms. Grace Muwonge', 'Ms. Dorothy Nassali'],
      repeats: [],
      history: [
        { class: 'S1A', year: '2020', avg: 82, position: '7/50', remark: 'Promoted' },
        { class: 'S2B', year: '2021', avg: 84, position: '5/48', remark: 'Promoted' },
        { class: 'S3A', year: '2022', avg: 85, position: '4/45', remark: 'Promoted' },
        { class: 'S4A', year: '2023', avg: 86, position: '3/40', remark: 'Promoted' },
        { class: 'S5', year: '2024', avg: 87, position: '3/35', remark: 'Current' },
      ]
    },
]

export default function SecondaryAdminStudents() {
    const [students, setStudents] = useState(initialSecondaryStudents)
    const [classFilter, setClassFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [relocateTarget, setRelocateTarget] = useState('S1A')
    const [reportStudent, setReportStudent] = useState(null)
    const [reportToast, setReportToast] = useState(null)

    // New student registration form state (Allows max 2 parents + 1 next of kin)
    const [newStudent, setNewStudent] = useState({
        name: '',
        photo: null,
        class: 'S1A',
        age: 13,
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
            class: 'S1A',
            age: 13,
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
            triggerToast('Please enter a valid student name.')
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
            id: `STU-S-${String(students.length + 1).padStart(3, '0')}`,
            name: newStudent.name,
            photo: newStudent.photo,
            class: newStudent.class,
            age: Number(newStudent.age) || 14,
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
            subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
            teachers: ['Mr. Patrick Mugisha', 'Ms. Dorothy Nassali', 'Mr. Brian Okello', 'Ms. Rita Acen'],
            repeats: [],
            history: [
                { class: newStudent.class, year: '2026', avg: 75, position: 'New', remark: 'Enrolled' }
            ]
        }
        setStudents([createdStudent, ...students])
        setModal(null)
        resetNewStudent()
        triggerToast(`Secondary Student ${createdStudent.name} successfully enrolled in ${createdStudent.class}!`)
    }

    const triggerToast = (msg) => {
        setReportToast(msg)
        setTimeout(() => setReportToast(null), 3000)
    }

    const classes = ['All', 'S1A', 'S1B', 'S2', 'S3', 'S4A', 'S4B', 'S5', 'S6']
    const relocateClasses = classes.filter(c => c !== 'All')

    const filtered = students.filter(s => (classFilter === 'All' || s.class.startsWith(classFilter)) && (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)))

    const openAutoPromote = () => setModal('autopromote')

    const getAvgHistory = (student) => {
        const scores = student.history.map(h => h.avg)
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    }

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Students</h1><p className="page-subtitle">Manage all enrolled secondary students</p></div>
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
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{s.name[0]}</div>
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
                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
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
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Target Class</label><select className="input-field w-full" value={relocateTarget} onChange={(e) => setRelocateTarget(e.target.value)}>{relocateClasses.filter(c => c !== selected.class).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason for Relocation</label><input className="input-field w-full" placeholder="e.g. Stream balancing, subject combination changes" /></div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'promote'} onClose={() => setModal(null)} title={`Promote / Repeat — ${selected?.name}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-success" onClick={() => setModal(null)}>Promote to Next Class</button><button className="btn-danger" onClick={() => setModal(null)}>Mark as Repeat</button></>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><p className="text-sm font-semibold dark:text-slate-300">Current Class: <span className="text-primary-600 dark:text-primary-400">{selected.class}</span> → Next: <span className="text-emerald-600 dark:text-emerald-400">{selected.class === 'S6' ? 'Graduated' : `S${parseInt(selected.class.replace(/\D/g, '')) + 1}`}</span></p></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason if repeating</label><textarea className="input-field resize-none w-full" rows={3} placeholder="e.g., Did not meet the minimum UNEB score threshold..." /></div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'autopromote'} onClose={() => setModal(null)} title="Auto-Promote Students" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors" onClick={() => setModal(null)}><CheckSquare size={16} /> Confirm Auto-Promotion</button></>}>
                <div className="space-y-5">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2"><Zap size={18} /> System Auto-Promotion</h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Automatically promote all students with an average score of <strong>40% or higher</strong>. Students below 40% will be marked to repeat.</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-slate-700 pb-2"><h3 className="font-semibold text-gray-900 dark:text-white">Promotion Preview</h3></div>
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto"><table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs uppercase font-semibold"><tr><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-center">Score</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {students.map(s => {
                                        const isPassing = s.performance >= 40
                                        const nextClass = s.class === 'S6' ? 'Graduated' : `S${parseInt(s.class.replace(/\D/g, '')) + 1}`
                                        return (
                                            <tr key={s.id} className={isPassing ? 'bg-emerald-50/10 dark:bg-emerald-900/10' : 'bg-red-50/30 dark:bg-red-900/10'}>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-200">{s.name} <span className="text-gray-400 dark:text-slate-500 font-normal text-xs ml-1">({s.class})</span></td>
                                                <td className="px-4 py-3 text-center font-bold text-gray-700 dark:text-slate-300">{s.performance}%</td>
                                                <td className={`px-4 py-3 font-semibold ${isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-danger-600 dark:text-red-400'}`}>{isPassing ? `Promote to ${nextClass}` : `Repeat ${s.class}`}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table></div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Enhanced Student Profile Modal */}
            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Student Profile" size="xl"
                footer={<div className="flex justify-end w-full"><button className="btn-secondary" onClick={() => setModal(null)}>Close</button></div>}>
                {selected && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700/50 rounded-2xl border border-blue-100 dark:border-slate-700">
                            {selected.photo ? (
                                <img src={selected.photo} alt={selected.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700 flex-shrink-0" />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
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
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-3 rounded-xl"><User size={14} className="text-blue-500 mb-1" /><p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Age</p><p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{selected.age} years</p></div>
                            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-3 rounded-xl"><User size={14} className="text-slate-600 dark:text-slate-400 mb-1" /><p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Gender</p><p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{selected.gender}</p></div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-3 rounded-xl"><Calendar size={14} className="text-emerald-500 mb-1" /><p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Joined</p><p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{new Date(selected.joinDate).toLocaleDateString('en-UG', { year: 'numeric', month: 'short' })}</p></div>
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-3 rounded-xl"><Award size={14} className="text-amber-500 mb-1" /><p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Avg Performance</p><p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{getAvgHistory(selected)}%</p></div>
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

                        {/* Subjects & Teachers */}
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

                        {/* Repeats */}
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

                        {/* Academic History */}
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
                                                <td className="py-2.5"><Badge variant={h.remark === 'Repeated' ? 'danger' : h.remark === 'Current' ? 'info' : 'success'}>{h.remark}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Official Academic Report Card Modal */}
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
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                    <GraduationCap size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Kampala Secondary School
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Academic Report — Term 1 2026
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Student Biodata Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Student Name</span>
                                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{reportStudent.name}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Student ID</span>
                                <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{reportStudent.id}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Class</span>
                                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{reportStudent.class}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Attendance</span>
                                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{reportStudent.attendance}% (49/50 Days)</p>
                            </div>
                        </div>

                        {/* NCDC CBC Grading Scale Reference Guide */}
                        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50 text-[11px]">
                            <p className="font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                                <Award size={13} /> NCDC Competency Grading Scale Key (A–E):
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] pt-1">
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-blue-100 dark:border-slate-700">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Grade A (2.5–3.0 / 80-100%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Exceptional / Innovative</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-blue-100 dark:border-slate-700">
                                    <span className="font-bold text-blue-600 dark:text-blue-400">Grade B (1.9–2.4 / 65-79%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Outstanding / Proficient</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-blue-100 dark:border-slate-700">
                                    <span className="font-bold text-amber-600 dark:text-amber-400">Grade C (1.4–1.8 / 50-64%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Satisfactory / Adequate</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-blue-100 dark:border-slate-700">
                                    <span className="font-bold text-purple-600 dark:text-purple-400">Grade D (0.9–1.3 / 40-49%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Basic / Minimum Pass</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded border border-blue-100 dark:border-slate-700">
                                    <span className="font-bold text-red-600 dark:text-red-400">Grade E (0.0–0.8 / 0-39%)</span>
                                    <p className="text-gray-500 dark:text-slate-400">Elementary / Developing</p>
                                </div>
                            </div>
                        </div>

                        {/* CBC Subject Performance & Competency Achievement Table */}
                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold">
                                    <tr>
                                        <th className="p-2.5">Subject &amp; Facilitator</th>
                                        <th className="p-2.5 text-center">Activities of Integration (AoI - 20%)</th>
                                        <th className="p-2.5 text-center">End of Term (80%)</th>
                                        <th className="p-2.5 text-center">Total (100%)</th>
                                        <th className="p-2.5 text-center">CBC Grade</th>
                                        <th className="p-2.5">Topic Competency Achieved &amp; Descriptor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                                    {[
                                        { sub: 'Mathematics', teacher: 'Mr. Patrick Mugisha', aoi: '2.8 / 3.0 (18.6%)', eot: '74 / 80', total: 93, grade: 'A', desc: 'Independently applies statistical models and geometric proofs to real scenarios.' },
                                        { sub: 'English Language', teacher: 'Ms. Dorothy Nassali', aoi: '2.6 / 3.0 (17.3%)', eot: '68 / 80', total: 85, grade: 'A', desc: 'Communicates fluently with advanced discursive composition and critical review.' },
                                        { sub: 'Physics', teacher: 'Mr. Brian Okello', aoi: '2.7 / 3.0 (18.0%)', eot: '70 / 80', total: 88, grade: 'A', desc: 'Designs functional electrical circuits and explains thermodynamic properties.' },
                                        { sub: 'Chemistry', teacher: 'Ms. Rita Acen', aoi: '2.4 / 3.0 (16.0%)', eot: '62 / 80', total: 78, grade: 'B', desc: 'Accurately tests water hardness and conducts titration procedures with safety.' },
                                        { sub: 'Biology', teacher: 'Mr. Julius Kintu', aoi: '2.7 / 3.0 (18.0%)', eot: '67 / 80', total: 85, grade: 'A', desc: 'Demonstrates environmental biodiversity conservation models effectively.' },
                                        { sub: 'History & Political Ed', teacher: 'Ms. Harriet Nambi', aoi: '2.5 / 3.0 (16.7%)', eot: '65 / 80', total: 82, grade: 'A', desc: 'Evaluates constitutional governance, civic duties, and regional pan-Africanism.' },
                                        { sub: 'Geography', teacher: 'Mr. Frank Kamya', aoi: '2.6 / 3.0 (17.3%)', eot: '68 / 80', total: 85, grade: 'A', desc: 'Interprets topographical contours, GIS data, and climate variability maps.' },
                                    ].map((r, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                                            <td className="p-2.5">
                                                <p className="font-bold text-gray-900 dark:text-white">{r.sub}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-slate-400">{r.teacher}</p>
                                            </td>
                                            <td className="p-2.5 text-center text-gray-600 dark:text-slate-300 font-mono">{r.aoi}</td>
                                            <td className="p-2.5 text-center text-gray-600 dark:text-slate-300 font-mono">{r.eot}</td>
                                            <td className="p-2.5 text-center font-bold text-gray-900 dark:text-white font-mono">{r.total}%</td>
                                            <td className="p-2.5 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${r.grade === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'}`}>
                                                    Grade {r.grade}
                                                </span>
                                            </td>
                                            <td className="p-2.5 text-gray-600 dark:text-slate-300 text-[11px] leading-snug">{r.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Generic Skills, Values & Mandatory Project Assessment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Generic Skills & Values Rating */}
                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-500" /> Generic 21st-Century Skills &amp; Values
                                </h4>
                                <div className="space-y-2">
                                    {[
                                        { skill: 'Critical Thinking & Problem Solving', rating: 'Advanced (Exceptional)', star: '⭐⭐⭐⭐⭐' },
                                        { skill: 'Collaboration & Team Leadership', rating: 'Proficient (High)', star: '⭐⭐⭐⭐' },
                                        { skill: 'Creativity & Innovative Thinking', rating: 'Advanced (Exceptional)', star: '⭐⭐⭐⭐⭐' },
                                        { skill: 'Digital Literacy & Research Skills', rating: 'Proficient (High)', star: '⭐⭐⭐⭐' },
                                        { skill: 'Integrity, Respect & Social Values', rating: 'Exemplary', star: '⭐⭐⭐⭐⭐' },
                                    ].map((g, gi) => (
                                        <div key={gi} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-800 p-1.5 px-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <span className="font-medium text-gray-700 dark:text-slate-300">{g.skill}</span>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{g.rating}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Term Project Assessment */}
                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                                    <BookOpen size={14} className="text-emerald-500" /> Mandatory NLSC Project Assessment
                                </h4>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900 dark:text-white">Project:</span>
                                        <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-xs">
                                            Score: 9.4 / 10.0 (Advanced)
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-slate-300 italic text-[11px]">
                                        &ldquo;Community Solid Waste Upcycling &amp; Organic Bio-Fertilizer Innovation Prototype.&rdquo;
                                    </p>
                                    <div className="text-[10px] text-gray-500 dark:text-slate-400 pt-1 border-t border-gray-100 dark:border-slate-700">
                                        Facilitator: Mr. Brian Okello • Assessment: Exemplary teamwork, evidence of working model, and articulate presentation.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall CBC Qualification Standing */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">CBC Status</span>
                                <p className="text-base font-black text-indigo-700 dark:text-indigo-300 mt-0.5">RESULT 1 (QUALIFIED)</p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Average Score</span>
                                <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">85.1% (Grade A)</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Stream Rank</span>
                                <p className="text-base font-black text-purple-700 dark:text-purple-300 mt-0.5">Rank 4 / 45</p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Fee Standing</span>
                                <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">CLEARED</p>
                            </div>
                        </div>

                        {/* Remarks & Official Endorsement */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">Class Facilitator&apos;s Qualitative Assessment:</p>
                                <p className="text-gray-600 dark:text-slate-300 italic text-[11px]">
                                    &ldquo;Mary demonstrates exceptional intellectual autonomy and mastery of modern competence strands. She solves problems with enthusiasm and leads team investigations effectively.&rdquo;
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-semibold">Teacher: Mr. Patrick Mugisha (Digital Signature: Verified ✓)</p>
                            </div>

                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-xs">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">Headteacher&apos;s Endorsement &amp; Seal:</p>
                                <p className="text-gray-600 dark:text-slate-300 italic text-[11px]">
                                    &ldquo;Promoted with High Distinction under the New Lower Secondary Curriculum. All continuous assessment records registered with UNEB.&rdquo;
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-semibold">Principal: Mrs. Grace Nabakooza (Official Seal: Verified ✓)</p>
                            </div>
                        </div>

                        {/* Resumption & Next Term Info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/50 rounded-xl text-xs">
                            <span className="text-gray-600 dark:text-slate-300">
                                📅 <strong>Next Term Begins:</strong> Monday, May 18, 2026
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                                CBC Ref: NCDC-NLSC-2026-T1-{reportStudent.id}
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

            {/* Enroll / Add Secondary Student Modal with Photo Upload, 2 Parents & Next of Kin */}
            <Modal
                isOpen={modal === 'enroll'}
                onClose={() => { setModal(null); resetNewStudent() }}
                title="Enroll New Secondary Student"
                size="xl"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setModal(null); resetNewStudent() }}>Cancel</button>
                        <button className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5" onClick={handleEnrollStudent}>
                            <Plus size={14} /> Enroll Student
                        </button>
                    </>
                }
            >
                <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
                    {/* Section 1: Student Biodata & Photo */}
                    <div className="p-4 bg-indigo-50/60 dark:bg-slate-800/70 rounded-2xl border border-indigo-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-700/60 pb-2">
                            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                                <GraduationCap size={15} /> Student Biodata &amp; Photo
                            </span>
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Secondary Section</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative group">
                                {newStudent.photo ? (
                                    <img
                                        src={newStudent.photo}
                                        alt="Student Preview"
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
                                <label className="text-xs font-bold text-slate-800 dark:text-white block">
                                    Student Passport / Portrait Photo
                                </label>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Upload a clear portrait photo for school records and academic report cards.
                                </p>
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer shadow-sm">
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
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Full Student Name *</label>
                                <input
                                    type="text"
                                    className="input-field text-xs"
                                    placeholder="e.g., Patricia Nakato"
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Assigned Class *</label>
                                <select
                                    className="select-field text-xs font-semibold"
                                    value={newStudent.class}
                                    onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
                                >
                                    {classes.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Gender</label>
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
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Age (Years)</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="22"
                                    className="input-field text-xs"
                                    value={newStudent.age}
                                    onChange={e => setNewStudent({ ...newStudent, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Initial Fees Status</label>
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
                                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">Parent / Guardian 1 (Primary Contact) *</h5>
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
                                        <option value="Jane Namukasa|+256 772 111222|jane.namukasa@mail.com|Mother">Jane Namukasa (Mary &amp; Patricia's Parent)</option>
                                        <option value="Jane Doe|+256 701 222333|jane.doe@mail.com|Mother">Jane Doe (John's Parent)</option>
                                        <option value="Wendy Pan|+256 785 333444|wendy.pan@mail.com|Mother">Wendy Pan (Peter's Parent)</option>
                                        <option value="Catherine Wonderland|+256 754 444555|catherine.w@mail.com|Mother">Catherine Wonderland (Alice's Parent)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        className="input-field text-xs"
                                        placeholder="e.g., Richard Nakato"
                                        value={newStudent.parent1Name}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className="input-field text-xs"
                                        placeholder="+256 772 123456"
                                        value={newStudent.parent1Phone}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                                    <select
                                        className="select-field text-xs"
                                        value={newStudent.parent1Relation}
                                        onChange={e => setNewStudent({ ...newStudent, parent1Relation: e.target.value })}
                                    >
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Guardian">Guardian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="input-field text-xs"
                                        placeholder="richard.n@mail.com"
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
                                    <h5 className="text-xs font-bold text-slate-800 dark:text-white">Parent / Guardian 2 (Secondary Contact)</h5>
                                </div>
                                <span className="text-[10px] text-slate-400 italic">Optional (Max 2nd parent)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field text-xs"
                                        placeholder="e.g., Beatrice Nakato"
                                        value={newStudent.parent2Name}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input-field text-xs"
                                        placeholder="+256 701 654321"
                                        value={newStudent.parent2Phone}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                                    <select
                                        className="select-field text-xs"
                                        value={newStudent.parent2Relation}
                                        onChange={e => setNewStudent({ ...newStudent, parent2Relation: e.target.value })}
                                    >
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Guardian">Guardian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="input-field text-xs"
                                        placeholder="beatrice.n@mail.com"
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
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Next of Kin Full Name *</label>
                                <input
                                    type="text"
                                    className="input-field text-xs"
                                    placeholder="e.g., Aunt Agnes Nassali"
                                    value={newStudent.nextOfKinName}
                                    onChange={e => setNewStudent({ ...newStudent, nextOfKinName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Next of Kin Phone *</label>
                                <input
                                    type="tel"
                                    className="input-field text-xs"
                                    placeholder="+256 780 777666"
                                    value={newStudent.nextOfKinPhone}
                                    onChange={e => setNewStudent({ ...newStudent, nextOfKinPhone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Relationship to Student *</label>
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
