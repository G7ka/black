import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { CalendarDays, Plus, Clock, MapPin, Edit, Trash2, CheckSquare, Printer, Coffee } from 'lucide-react'

// Dummy Data
const defaultClasses = ['P1A', 'P1B', 'P2A', 'P2B', 'P3A', 'P3B', 'P4A', 'P4B', 'P5A', 'P5B', 'P6A', 'P6B', 'P6C', 'P7A', 'P7B']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Timetable structure: array of rows, each is either a 'slot' or a 'break'
const defaultRows = [
    { type: 'slot', label: '8:00 AM - 9:20 AM' },
    { type: 'slot', label: '9:20 AM - 10:40 AM' },
    { type: 'slot', label: '10:40 AM - 12:00 PM' },
    { type: 'break', name: 'Lunch Break', time: '12:00 PM - 2:00 PM' },
    { type: 'slot', label: '2:00 PM - 3:00 PM' },
    { type: 'slot', label: '3:00 PM - 4:00 PM' },
    { type: 'break', name: 'Evening Break', time: '4:00 PM - 5:00 PM' },
]

// Seed dummy timetable for P6A
const initialTimetable = {
    'Monday': [
        { time: '8:00 AM - 9:20 AM', subject: 'Mathematics', teacher: 'Mr. Kenneth Okello', room: 'Room 12' },
        { time: '9:20 AM - 10:40 AM', subject: 'English', teacher: 'Ms. Agnes Nassali', room: 'Room 12' },
        { time: '10:40 AM - 12:00 PM', subject: 'Science', teacher: 'Mr. David Byaruhanga', room: 'Sci Lab 1' },
    ],
    'Tuesday': [
        { time: '8:00 AM - 9:20 AM', subject: 'Social Studies', teacher: 'Ms. Sarah Acen', room: 'Room 12' },
        { time: '9:20 AM - 10:40 AM', subject: 'Mathematics', teacher: 'Mr. Kenneth Okello', room: 'Room 12' },
    ]
}

const breakColors = [
    { bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800/30', icon: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', text: 'text-amber-700 dark:text-amber-400', subtext: 'text-amber-500 dark:text-amber-500' },
    { bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-200 dark:border-orange-800/30', icon: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', text: 'text-orange-700 dark:text-orange-400', subtext: 'text-orange-500 dark:text-orange-500' },
    { bg: 'bg-teal-50 dark:bg-teal-900/10', border: 'border-teal-200 dark:border-teal-800/30', icon: 'bg-teal-100 dark:bg-teal-900/30', iconColor: 'text-teal-600 dark:text-teal-400', text: 'text-teal-700 dark:text-teal-400', subtext: 'text-teal-500 dark:text-teal-500' },
    { bg: 'bg-rose-50 dark:bg-rose-900/10', border: 'border-rose-200 dark:border-rose-800/30', icon: 'bg-rose-100 dark:bg-rose-900/30', iconColor: 'text-rose-600 dark:text-rose-400', text: 'text-rose-700 dark:text-rose-400', subtext: 'text-rose-500 dark:text-rose-500' },
]

export default function SchoolAdminTimetable() {
    const [selectedClass, setSelectedClass] = useState(new URLSearchParams(window.location.search).get('stream') || 'P6A')
    const [timetableData, setTimetableData] = useState(initialTimetable)
    const [rows, setRows] = useState(defaultRows)
    const [modal, setModal] = useState(false)
    const [breakModal, setBreakModal] = useState(false)
    const [editingRows, setEditingRows] = useState([])
    const [formData, setFormData] = useState({ day: days[0], time: '', subject: '', teacher: '', room: '' })

    const allSlotLabels = rows.filter(r => r.type === 'slot').map(r => r.label)

    const openModal = (day = days[0], time = allSlotLabels[0], lesson = null) => {
        if (lesson) {
            setFormData({ day, time, subject: lesson.subject, teacher: lesson.teacher, room: lesson.room })
        } else {
            setFormData({ day, time, subject: '', teacher: '', room: '' })
        }
        setModal(true)
    }

    const saveLesson = () => {
        setTimetableData(prev => {
            const currentDayArr = (prev[formData.day] || []).filter(l => l.time !== formData.time)
            currentDayArr.push({ time: formData.time, subject: formData.subject, teacher: formData.teacher, room: formData.room })
            return { ...prev, [formData.day]: currentDayArr }
        })
        setModal(false)
    }

    const deleteLesson = (day, time, e) => {
        e.stopPropagation()
        if (window.confirm('Delete this lesson?')) {
            setTimetableData(prev => ({
                ...prev,
                [day]: (prev[day] || []).filter(l => l.time !== time)
            }))
        }
    }

    // Break editing
    const openBreakEditor = () => {
        setEditingRows(rows.map(r => ({ ...r })))
        setBreakModal(true)
    }

    const updateBreak = (idx, field, value) => {
        setEditingRows(prev => {
            const updated = [...prev]
            updated[idx] = { ...updated[idx], [field]: value }
            return updated
        })
    }

    const addBreakRow = () => {
        setEditingRows(prev => [...prev, { type: 'break', name: 'New Break', time: '' }])
    }

    const addSlotRow = () => {
        setEditingRows(prev => [...prev, { type: 'slot', label: '' }])
    }

    const removeRow = (idx) => {
        setEditingRows(prev => prev.filter((_, i) => i !== idx))
    }

    const moveRow = (idx, direction) => {
        setEditingRows(prev => {
            const updated = [...prev]
            const target = idx + direction
            if (target < 0 || target >= updated.length) return prev
            ;[updated[idx], updated[target]] = [updated[target], updated[idx]]
            return updated
        })
    }

    const saveBreaks = () => {
        setRows(editingRows)
        setBreakModal(false)
    }

    const renderLessonCell = (day, time) => {
        const lesson = (timetableData[day] || []).find(l => l.time === time)
        return (
            <td key={day} onClick={() => !lesson && openModal(day, time)} className="p-2 border-r border-slate-100 dark:border-slate-700/50 last:border-0 align-top h-24 relative group cursor-pointer">
                {lesson ? (
                    <div onClick={() => openModal(day, time, lesson)} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 h-full hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm">
                        <p className="font-bold text-blue-900 dark:text-blue-300 text-sm leading-tight">{lesson.subject}</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-medium truncate">{lesson.teacher}</p>
                        <div className="flex items-center gap-1 text-[10px] text-blue-500 dark:text-blue-300 mt-2 font-semibold bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 w-max px-1.5 py-0.5 rounded shadow-sm">
                            <MapPin size={10} /> {lesson.room}
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                            <button className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors dark:text-slate-300"><Edit size={12} /></button>
                            <button onClick={(e) => deleteLesson(day, time, e)} className="p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors dark:text-slate-300"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 dark:text-blue-400">
                        <Plus size={20} />
                    </div>
                )}
            </td>
        )
    }

    let breakIndex = 0

    return (
        <DashboardLayout role="schooladmin-primary">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Class Timetables</h1>
                        <p className="page-subtitle">Manage weekly schedules for all Primary classes.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            className="input-field py-2 bg-white dark:bg-slate-800"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {defaultClasses.map(c => <option key={c} value={c}>{c} Timetable</option>)}
                        </select>
                        <button onClick={openBreakEditor} className="btn-secondary flex items-center gap-2" title="Edit Breaks & Time Slots">
                            <Coffee size={16} /> Edit Breaks
                        </button>
                        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                            <Plus size={16} /> Add Lesson
                        </button>
                    </div>
                </div>

                {/* Timetable Grid */}
                <div className="card p-0 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <div className="overflow-x-auto"><table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 w-32 border-r border-slate-200 dark:border-slate-700">Time</th>
                                    {days.map(day => (
                                        <th key={day} className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center border-r border-slate-200 dark:border-slate-700 last:border-0">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {rows.map((row, idx) => {
                                    if (row.type === 'break') {
                                        const colors = breakColors[breakIndex % breakColors.length]
                                        breakIndex++
                                        return (
                                            <tr key={`break-${idx}`}>
                                                <td colSpan={6} className={`${colors.bg} p-0`}>
                                                    <div className={`flex items-center justify-center py-3 border-y ${colors.border}`}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded-full ${colors.icon} flex items-center justify-center`}>
                                                                <Clock size={12} className={colors.iconColor} />
                                                            </div>
                                                            <span className={`text-sm font-bold ${colors.text} uppercase tracking-wider`}>{row.name}</span>
                                                            {row.time && <span className={`text-xs font-medium ${colors.subtext} ml-1`}>({row.time})</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    return (
                                        <tr key={`slot-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 border-r border-slate-100 dark:border-slate-700/50 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30">{row.label}</td>
                                            {days.map(day => renderLessonCell(day, row.label))}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table></div>
                    </div>
                </div>
            </div>

            {/* Print Timetable Button */}
            <div className="flex justify-end mt-4">
                <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 print:hidden">
                    <Printer size={16} /> Print Timetable
                </button>
            </div>

            {/* Lesson Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Manage Schedule Slot"
                footer={<><button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button><button disabled={!formData.subject || !formData.teacher} className="btn-primary" onClick={saveLesson}><CheckSquare size={14} /> Save Slot</button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Day of Week</label>
                            <select value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })} className="select-field">
                                {days.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Time Slot</label>
                            <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="select-field">
                                {allSlotLabels.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subject</label>
                        <input className="input-field" placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Assigned Teacher</label>
                        <input className="input-field" placeholder="e.g. Mr. Kenneth Okello" value={formData.teacher} onChange={e => setFormData({ ...formData, teacher: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Classroom / Location</label>
                        <input className="input-field" placeholder="e.g. Room 12" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} />
                    </div>
                </div>
            </Modal>

            {/* Edit Breaks & Schedule Modal */}
            <Modal isOpen={breakModal} onClose={() => setBreakModal(false)} title="Edit Schedule & Breaks" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setBreakModal(false)}>Cancel</button><button className="btn-primary" onClick={saveBreaks}><CheckSquare size={14} /> Save Schedule</button></>}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300">Configure your timetable layout. Add, edit, reorder, or remove lesson slots and break periods. Use the arrows to reorder rows.</p>

                    <div className="space-y-2">
                        {editingRows.map((row, idx) => (
                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${row.type === 'break' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-700'}`}>
                                {/* Row number + type badge */}
                                <div className="flex flex-col items-center gap-1 w-8">
                                    <button onClick={() => moveRow(idx, -1)} disabled={idx === 0} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 disabled:opacity-30 text-xs">▲</button>
                                    <button onClick={() => moveRow(idx, 1)} disabled={idx === editingRows.length - 1} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 disabled:opacity-30 text-xs">▼</button>
                                </div>

                                {/* Type badge */}
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${row.type === 'break' ? 'bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}`}>
                                    {row.type === 'break' ? 'Break' : 'Lesson'}
                                </span>

                                {/* Fields */}
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    {row.type === 'break' ? (
                                        <>
                                            <input
                                                className="input-field text-sm"
                                                placeholder="Break name, e.g. Lunch Break"
                                                value={row.name}
                                                onChange={e => updateBreak(idx, 'name', e.target.value)}
                                            />
                                            <input
                                                className="input-field text-sm"
                                                placeholder="e.g. 12:00 PM - 2:00 PM"
                                                value={row.time}
                                                onChange={e => updateBreak(idx, 'time', e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <input
                                            className="input-field text-sm col-span-2"
                                            placeholder="e.g. 8:00 AM - 9:20 AM"
                                            value={row.label}
                                            onChange={e => updateBreak(idx, 'label', e.target.value)}
                                        />
                                    )}
                                </div>

                                {/* Delete */}
                                <button onClick={() => removeRow(idx)} className="p-1.5 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Remove row">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add buttons */}
                    <div className="flex gap-2">
                        <button onClick={addSlotRow} className="flex-1 py-2.5 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl text-sm font-semibold text-blue-500 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2">
                            <Plus size={14} /> Add Lesson Slot
                        </button>
                        <button onClick={addBreakRow} className="flex-1 py-2.5 border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center justify-center gap-2">
                            <Coffee size={14} /> Add Break
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
