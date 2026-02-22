import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { CheckCircle, XCircle, Clock, Bell, Users, Save, AlertTriangle } from 'lucide-react'

const studentsByClass = {
    P6A: [
        { id: 1, name: 'Ivan Namukasa', status: null },
        { id: 2, name: 'Grace Mukasa', status: null },
        { id: 5, name: 'Moses Achola', status: null },
        { id: 8, name: 'Esther Akello', status: null },
        { id: 9, name: 'Brian Mwesige', status: null },
        { id: 10, name: 'Joy Apio', status: null },
        { id: 11, name: 'Kevin Ssekandi', status: null },
        { id: 12, name: 'Lydia Nabwire', status: null },
    ],
    P7B: [
        { id: 3, name: 'David Ouma', status: null },
        { id: 4, name: 'Faith Ssali', status: null },
        { id: 6, name: 'Ruth Nabirye', status: null },
        { id: 7, name: 'Samuel Kato', status: null },
        { id: 13, name: 'Paul Omara', status: null },
        { id: 14, name: 'Sarah Atim', status: null },
    ],
}

const calendarData = [
    { day: 17, rate: 95 }, { day: 18, rate: 92 }, { day: 19, rate: 88 }, { day: 20, rate: 97 },
    { day: 21, rate: 94 }, { day: 22, rate: null },
]

export default function TeacherAttendance() {
    const [selectedClass, setSelectedClass] = useState('P6A')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [attendance, setAttendance] = useState({})
    const [modal, setModal] = useState(null)
    const [saved, setSaved] = useState(false)

    const students = studentsByClass[selectedClass] || []

    const setStatus = (id, status) => setAttendance(prev => ({ ...prev, [id]: status }))

    const markAll = (status) => {
        const all = {}
        students.forEach(s => { all[s.id] = status })
        setAttendance(all)
    }

    const absentees = students.filter(s => attendance[s.id] === 'absent')
    const presentCount = students.filter(s => attendance[s.id] === 'present').length
    const markedCount = students.filter(s => attendance[s.id]).length

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">Mark daily attendance for your classes</p>
                </div>

                {/* Controls */}
                <div className="card flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 font-medium mb-1">Class</label>
                        <div className="flex gap-2">
                            {['P6A', 'P7B'].map(c => (
                                <button key={c} onClick={() => { setSelectedClass(c); setAttendance({}) }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedClass === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 font-medium mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
                    </div>
                    <div className="ml-auto flex gap-2 flex-wrap">
                        <button onClick={() => markAll('present')} className="btn-success text-xs py-1.5 px-3"><CheckCircle size={13} /> All Present</button>
                        <button onClick={() => markAll('absent')} className="btn-danger text-xs py-1.5 px-3"><XCircle size={13} /> All Absent</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance list */}
                    <div className="card lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title mb-0">{selectedClass} — {new Date(date).toLocaleDateString('en-UG', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                            <span className="text-xs text-gray-500">{markedCount}/{students.length} marked</span>
                        </div>
                        <div className="space-y-2">
                            {students.map(s => (
                                <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${attendance[s.id] === 'present' ? 'border-emerald-300 bg-emerald-50' : attendance[s.id] === 'absent' ? 'border-red-300 bg-red-50' : attendance[s.id] === 'late' ? 'border-amber-300 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[['present', CheckCircle, 'hover:bg-emerald-100 text-emerald-600', attendance[s.id] === 'present' ? 'bg-emerald-500 text-white' : ''],
                                        ['late', Clock, 'hover:bg-amber-100 text-amber-600', attendance[s.id] === 'late' ? 'bg-amber-500 text-white' : ''],
                                        ['absent', XCircle, 'hover:bg-red-100 text-red-600', attendance[s.id] === 'absent' ? 'bg-red-500 text-white' : '']
                                        ].map(([status, Icon, hover, active]) => (
                                            <button key={status} onClick={() => setStatus(s.id, status)} title={status}
                                                className={`p-1.5 rounded-lg transition-all ${active || hover}`}>
                                                <Icon size={16} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={handleSave} className="btn-primary">
                                <Save size={14} /> {saved ? 'Saved ✓' : 'Save Attendance'}
                            </button>
                            {absentees.length > 0 && (
                                <button onClick={() => setModal('sms')} className="btn-secondary">
                                    <Bell size={14} /> Notify {absentees.length} Parent{absentees.length > 1 ? 's' : ''}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Summary + mini-calendar */}
                    <div className="space-y-4">
                        <div className="card">
                            <h2 className="section-title">Today's Summary</h2>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {[
                                    { label: 'Present', count: presentCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'Absent', count: absentees.length, color: 'text-red-600', bg: 'bg-red-50' },
                                    { label: 'Late', count: students.filter(s => attendance[s.id] === 'late').length, color: 'text-amber-600', bg: 'bg-amber-50' },
                                ].map(s => (
                                    <div key={s.label} className={`p-3 rounded-xl ${s.bg}`}>
                                        <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            {markedCount > 0 && (
                                <div className="mt-3"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Rate</span><span>{Math.round(presentCount / students.length * 100)}%</span></div>
                                    <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${presentCount / students.length * 100}%` }} /></div>
                                </div>
                            )}
                        </div>
                        <div className="card">
                            <h2 className="section-title">This Week — {selectedClass}</h2>
                            <div className="grid grid-cols-5 gap-1">
                                {calendarData.map((d, i) => (
                                    <div key={i} className={`flex flex-col items-center p-2 rounded-lg text-center ${d.rate === null ? 'bg-primary-100' : d.rate >= 90 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                        <p className="text-xs text-gray-500 font-medium">Feb</p>
                                        <p className="text-sm font-bold text-gray-900">{d.day}</p>
                                        <p className={`text-xs font-semibold ${d.rate === null ? 'text-primary-600' : d.rate >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{d.rate === null ? 'Today' : `${d.rate}%`}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SMS Modal */}
            <Modal isOpen={modal === 'sms'} onClose={() => setModal(null)} title="Notify Parents of Absences"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Bell size={14} /> Send SMS</button></>}>
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm font-semibold text-amber-800"><AlertTriangle size={14} className="inline mr-1" />{absentees.length} student{absentees.length > 1 ? 's' : ''} absent today</p>
                        <ul className="mt-1 text-xs text-amber-700 space-y-0.5">{absentees.map(a => <li key={a.id}>• {a.name}</li>)}</ul>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMS Message</label>
                        <textarea className="input-field resize-none" rows={3} defaultValue={`Dear Parent, your child was absent from school today, ${new Date(date).toLocaleDateString('en-UG')}. Please contact us if this is unplanned. — Kampala Primary School`} />
                    </div>
                    <p className="text-xs text-gray-400">Will be sent via Africa's Talking SMS Gateway to {absentees.length} parent number{absentees.length > 1 ? 's' : ''}.</p>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
