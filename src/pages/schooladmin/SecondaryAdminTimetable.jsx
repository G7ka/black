import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { CalendarDays, Plus, Search, Filter, Clock, MapPin, Users, Edit, Trash2, CheckSquare } from 'lucide-react'

// Dummy Data
const classes = ['S1A', 'S1B', 'S2', 'S3', 'S4A', 'S4B', 'S5', 'S6']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['8:00 AM - 9:20 AM', '9:20 AM - 10:40 AM', '11:00 AM - 12:20 PM', '1:20 PM - 2:40 PM', '2:40 PM - 4:00 PM']

// Seed dummy timetable for S1B
const initialTimetable = {
    'Monday': [
        { time: '8:00 AM - 9:20 AM', subject: 'Physics', teacher: 'Mr. David Byaruhanga', room: 'Physics Lab' },
        { time: '9:20 AM - 10:40 AM', subject: 'History', teacher: 'Ms. Sarah Acen', room: 'Room 5' },
    ],
    'Tuesday': [
        { time: '11:00 AM - 12:20 PM', subject: 'Literature', teacher: 'Mr. Paul Kintu', room: 'Room 5' },
        { time: '2:40 PM - 4:00 PM', subject: 'Mathematics', teacher: 'Mrs. Jane Doe', room: 'Room 5' },
    ]
}

export default function SecondaryAdminTimetable() {
    const [selectedClass, setSelectedClass] = useState('S1B')
    const [timetableData, setTimetableData] = useState(initialTimetable)
    const [modal, setModal] = useState(false)
    const [formData, setFormData] = useState({ day: days[0], time: timeSlots[0], subject: '', teacher: '', room: '' })

    const openModal = (day = days[0], time = timeSlots[0], lesson = null) => {
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

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Class Timetables</h1>
                        <p className="page-subtitle">Manage weekly schedules for all Secondary classes.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            className="input-field py-2 bg-white"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {classes.map(c => <option key={c} value={c}>{c} Timetable</option>)}
                        </select>
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
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-700 w-32 border-r border-slate-200">Time</th>
                                    {days.map(day => (
                                        <th key={day} className="p-4 font-semibold text-slate-700 text-center border-r border-slate-200 last:border-0">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {timeSlots.map((time, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 border-r border-slate-100 text-sm font-bold text-slate-600 bg-slate-50">{time}</td>

                                        {/* Break Time Logic */}
                                        {time === '11:00 - 12:20' && idx === 2 ? (
                                            days.map(day => {
                                                const lesson = (timetableData[day] || []).find(l => l.time === time)
                                                return (
                                                    <td key={day} onClick={() => !lesson && openModal(day, time)} className="p-2 border-r border-slate-100 last:border-0 align-top h-24 relative group cursor-pointer">
                                                        {lesson ? (
                                                            <div onClick={() => openModal(day, time, lesson)} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 h-full hover:border-indigo-300 transition-colors">
                                                                <p className="font-bold text-indigo-900 text-sm">{lesson.subject}</p>
                                                                <p className="text-xs text-indigo-700 mt-1 truncate">{lesson.teacher}</p>
                                                                <div className="flex items-center gap-1 text-[10px] text-indigo-500 mt-2 font-medium bg-indigo-100 w-max px-2 py-0.5 rounded">
                                                                    <MapPin size={10} /> {lesson.room}
                                                                </div>

                                                                {/* Quick Actions overlay */}
                                                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded p-1 shadow-sm backdrop-blur-sm">
                                                                    <button className="p-1 hover:text-indigo-600 transition-colors"><Edit size={12} /></button>
                                                                    <button onClick={(e) => deleteLesson(day, time, e)} className="p-1 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-300 hover:bg-indigo-50 text-indigo-500">
                                                                <Plus size={20} />
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })
                                        ) : time === '13:20 - 14:40' && idx === 3 ? (
                                            <td colSpan={5} className="bg-slate-100 border-x-0 p-3 text-center text-sm font-bold text-slate-500 uppercase tracking-widest relative">
                                                <div className="absolute inset-0 border-b border-t border-slate-200"></div>
                                                <span className="relative bg-slate-100 px-4">Lunch Break (12:20 - 13:20)</span>
                                            </td>
                                        ) : (
                                            days.map(day => {
                                                const lesson = (timetableData[day] || []).find(l => l.time === time)
                                                return (
                                                    <td key={day} onClick={() => !lesson && openModal(day, time)} className="p-2 border-r border-slate-100 last:border-0 align-top h-24 relative group cursor-pointer">
                                                        {lesson ? (
                                                            <div onClick={() => openModal(day, time, lesson)} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 h-full hover:border-indigo-300 transition-colors shadow-sm">
                                                                <p className="font-bold text-indigo-900 text-sm leading-tight">{lesson.subject}</p>
                                                                <p className="text-xs text-indigo-700 mt-1 font-medium truncate">{lesson.teacher}</p>
                                                                <div className="flex items-center gap-1 text-[10px] text-indigo-500 mt-2 font-semibold bg-white border border-indigo-100 w-max px-1.5 py-0.5 rounded shadow-sm">
                                                                    <MapPin size={10} /> {lesson.room}
                                                                </div>

                                                                {/* Quick Actions overlay */}
                                                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded p-1 shadow-sm border border-slate-100">
                                                                    <button className="p-1 hover:text-indigo-600 transition-colors"><Edit size={12} /></button>
                                                                    <button onClick={(e) => deleteLesson(day, time, e)} className="p-1 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-300 hover:bg-indigo-50 text-indigo-500">
                                                                <Plus size={20} />
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    </div>
                </div>
            </div>

            {/* Lesson Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Manage Schedule Slot"
                footer={<><button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button><button disabled={!formData.subject || !formData.teacher} className="btn-primary" onClick={saveLesson}><CheckSquare size={14} /> Save Slot</button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                            <select value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })} className="select-field">
                                {days.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                            <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="select-field">
                                {timeSlots.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input className="input-field" placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Teacher</label>
                        <input className="input-field" placeholder="e.g. Mr. Kenneth Okello" value={formData.teacher} onChange={e => setFormData({ ...formData, teacher: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Classroom / Location</label>
                        <input className="input-field" placeholder="e.g. Room 12" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
