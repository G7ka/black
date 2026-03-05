import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Plus, Edit2, Calendar as CalendarIcon, Users, CheckSquare, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react'

// Dummy Data
const currentMonth = "February 2026";
const daysInMonth = 28;
const startDayOfWeek = 0; // 0 = Sunday

// Assignments mapped by date
const assignmentsRecord = {
    5: [{ id: 101, title: 'Math Quiz 1', class: 'P6A', totalMarks: 20 }],
    12: [{ id: 102, title: 'Science Experiment Report', class: 'P6A', totalMarks: 50 }],
    18: [{ id: 103, title: 'English Essay', class: 'P7B', totalMarks: 100 }],
    24: [{ id: 104, title: 'Math Homework 4', class: 'P6A', totalMarks: 10 }],
    26: [{ id: 105, title: 'Social Studies Maps', class: 'P7B', totalMarks: 30 }, { id: 106, title: 'Mental Math', class: 'P6A', totalMarks: 20 }],
}

const roster = [
    { id: 1, name: 'Ivan Namukasa', marks: { 101: 18, 102: 45, 103: 88, 104: null, 105: 25, 106: 15 } },
    { id: 2, name: 'Grace Mukasa', marks: { 101: 20, 102: 48, 103: 92, 104: 10, 105: 28, 106: 19 } },
    { id: 3, name: 'Moses Achola', marks: { 101: null, 102: 30, 103: 70, 104: null, 105: null, 106: null } }, // Multiple missing
    { id: 4, name: 'Esther Akello', marks: { 101: 15, 102: null, 103: 85, 104: 8, 105: 26, 106: 12 } },
    { id: 5, name: 'Brian Mwesige', marks: { 101: 19, 102: 42, 103: null, 104: 9, 105: 29, 106: null } },
]

export default function TeacherAssignments() {
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [tempDate, setTempDate] = useState('')

    const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyGrids = Array.from({ length: startDayOfWeek }, (_, i) => i)

    const handleDayClick = (day) => {
        setSelectedDate(day)
        setSelectedAssignment(null)
    }

    const handleAssignmentClick = (assignment) => {
        setSelectedAssignment(assignment)
    }

    const openCreateForDate = (day) => {
        setTempDate(`2026-02-${day.toString().padStart(2, '0')}`)
        setIsCreateModalOpen(true)
    }

    return (
        <DashboardLayout role="teacher">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="page-title">Assignment Record</h1>
                    <p className="page-subtitle">Track issued assignments and enter student marks.</p>
                </div>
                <button className="btn-primary" onClick={() => { setTempDate(''); setIsCreateModalOpen(true) }}>
                    <Plus size={15} /> Record Assignment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2 card bg-white shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={20} /></button>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{currentMonth}</h2>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={20} /></button>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-slate-50 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}

                        {emptyGrids.map(i => <div key={`empty-${i}`} className="bg-white min-h-[100px]" />)}

                        {daysList.map(day => {
                            const dayAssignments = assignmentsRecord[day] || []
                            const isSelected = selectedDate === day
                            const isToday = day === 24 // Mock today

                            return (
                                <div
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    className={`bg-white min-h-[120px] p-2 cursor-pointer transition-all hover:bg-primary-50 
                                    ${isSelected ? 'ring-2 ring-primary-500 ring-inset bg-primary-50/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white shadow-md' : 'text-slate-700'}`}>
                                            {day}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openCreateForDate(day) }}
                                            className="text-slate-300 hover:text-primary-600 transition-colors p-1"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="space-y-1.5">
                                        {dayAssignments.map((a, idx) => (
                                            <div
                                                key={a.id}
                                                className={`text-[10px] sm:text-xs px-2 py-1.5 rounded-lg border leading-tight truncate font-medium
                                                ${a.class === 'P6A' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-purple-50 border-purple-200 text-purple-800'}
                                                `}
                                            >
                                                <span className="opacity-75 mr-1 font-bold">{idx + 1}.</span>{a.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Side Panel: Daily Details & Roster */}
                <div className="space-y-6">
                    {/* Day Summary */}
                    <div className="card border-2 border-slate-200/60 bg-slate-50 shadow-inner">
                        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                            <CalendarIcon size={18} className="text-primary-500" />
                            {selectedDate ? `Feb ${selectedDate}, 2026` : 'Select a Date'}
                        </h3>

                        {!selectedDate ? (
                            <p className="text-sm text-slate-500 text-center py-8">Click on a day in the calendar to view or record assignments.</p>
                        ) : (assignmentsRecord[selectedDate] || []).length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-slate-500 mb-4">No assignments recorded for this day.</p>
                                <button className="btn-primary py-1.5 text-sm" onClick={() => openCreateForDate(selectedDate)}>Record Assignment</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignmentsRecord[selectedDate].map((a, idx) => (
                                    <div
                                        key={a.id}
                                        onClick={() => handleAssignmentClick(a)}
                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-0.5
                                        ${selectedAssignment?.id === a.id ? 'border-primary-500 shadow-md bg-white' : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 text-sm">Assignment {idx + 1}</h4>
                                            <Badge variant={a.class === 'P6A' ? 'info' : 'purple'}>{a.class}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium mb-3">{a.title}</p>
                                        <div className="flex items-center text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-md inline-flex">
                                            Max Marks: {a.totalMarks}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mark Sheet Roster */}
                    {selectedAssignment && (
                        <div className="card shadow-lg border-t-4 border-t-primary-500">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Mark Sheet</h3>
                                    <p className="text-xs text-slate-500 font-medium">{selectedAssignment.title}</p>
                                </div>
                                <Badge variant="warning" className="animate-pulse">Editing</Badge>
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {roster.map(student => {
                                    const score = student.marks[selectedAssignment.id]
                                    const isMissing = score === null || score === undefined

                                    return (
                                        <div key={student.id} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${isMissing ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200 hover:border-primary-300'}`}>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${isMissing ? 'bg-red-400' : 'bg-primary-500'}`}>
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 truncate">{student.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    defaultValue={isMissing ? '' : score}
                                                    placeholder="--"
                                                    className={`w-14 text-center px-1 py-1 border rounded-md text-sm font-bold focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all
                                                    ${isMissing ? 'border-red-300 bg-white text-red-600 placeholder-red-300' : 'border-slate-300 bg-white text-slate-900'}`}
                                                />
                                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">/ {selectedAssignment.totalMarks}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                <button className="btn-primary w-full py-2 shadow-md shadow-primary-500/20"><Check size={16} /> Save Marks</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Assignment Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Record New Assignment" size="md"
                footer={<><button className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button><button className="btn-primary" onClick={() => setIsCreateModalOpen(false)}><CheckSquare size={14} /> Record & Open Marks</button></>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date Issued</label>
                        <input type="date" className="input-field" defaultValue={tempDate} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class</label>
                        <select className="select-field"><option>P6A</option><option>P7B</option></select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assignment Title</label>
                        <input className="input-field" placeholder="e.g., Chapter 5 Exercises" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maximum Marks</label>
                        <input type="number" className="input-field" placeholder="e.g., 100" />
                    </div>
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-200 text-xs font-medium flex gap-2">
                        <FileText size={16} className="text-blue-500 flex-shrink-0" />
                        <p>This will simply record the assignment on the calendar so you can enter student marks later. Students will see it on their schedule but will not submit digital files.</p>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
