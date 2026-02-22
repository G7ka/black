import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Edit2, Trash2, Library, Users } from 'lucide-react'

// Dummy data for classes and subjects
const classesData = [
    { id: 'C-P1', name: 'Primary 1', level: 'Lower Primary', students: 120, teachers: 4, subjects: ['Mathematics', 'English', 'Literacy I', 'Literacy II', 'Religious Education'] },
    { id: 'C-P2', name: 'Primary 2', level: 'Lower Primary', students: 115, teachers: 4, subjects: ['Mathematics', 'English', 'Literacy I', 'Literacy II', 'Religious Education'] },
    { id: 'C-P3', name: 'Primary 3', level: 'Lower Primary', students: 108, teachers: 4, subjects: ['Mathematics', 'English', 'Literacy I', 'Literacy II', 'Religious Education'] },
    { id: 'C-P4', name: 'Primary 4', level: 'Upper Primary', students: 130, teachers: 5, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education', 'Physical Education'] },
    { id: 'C-P5', name: 'Primary 5', level: 'Upper Primary', students: 125, teachers: 5, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'] },
    { id: 'C-P6', name: 'Primary 6', level: 'Upper Primary', students: 140, teachers: 6, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'] },
    { id: 'C-P7', name: 'Primary 7', level: 'Upper Primary', students: 110, teachers: 6, subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Education'] },
]

// System-wide subjects that can be assigned to classes
const availableSubjects = [
    'Mathematics', 'English', 'Science', 'Social Studies',
    'Religious Education', 'Literacy I', 'Literacy II',
    'Physical Education', 'Art and Craft', 'Luganda', 'Kiswahili'
]

export default function SchoolAdminClasses() {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)

    // For subject assignment modal
    const [selectedSubjects, setSelectedSubjects] = useState([])

    const filteredClasses = classesData.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.level.toLowerCase().includes(search.toLowerCase())
    )

    const openSubjectModal = (cls) => {
        setSelectedClass(cls)
        setSelectedSubjects(cls.subjects)
        setModal('subjects')
    }

    const toggleSubject = (subject) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
        } else {
            setSelectedSubjects([...selectedSubjects, subject])
        }
    }

    return (
        <DashboardLayout role="schooladmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Class & Subject Management</h1>
                        <p className="page-subtitle">Manage class streams and assign subjects</p>
                    </div>
                    <button className="btn-primary" onClick={() => setModal('addClass')}><Plus size={15} /> Add New Class</button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field pl-9"
                            placeholder="Search classes..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="card p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                                    <Badge variant={cls.level.includes('Lower') ? 'info' : 'success'} className="mt-1">{cls.level}</Badge>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit Class"><Edit2 size={14} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 mb-5 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Students</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5"><Users size={12} className="text-gray-400" /> {cls.students}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Teachers</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5"><Users size={12} className="text-gray-400" /> {cls.teachers}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Assigned Subjects ({cls.subjects.length})</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-4 max-h-20 overflow-y-auto">
                                    {cls.subjects.map(subject => (
                                        <span key={subject} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-md">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => openSubjectModal(cls)}
                                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Library size={14} /> Manage Subjects
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manage Subjects Modal */}
            <Modal isOpen={modal === 'subjects'} onClose={() => setModal(null)} title={`Manage Subjects — ${selectedClass?.name}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}>Save Subject Changes</button></>}>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Select which subjects should be taught in <strong>{selectedClass?.name}</strong>. Teachers can only assign grades for subjects selected here.</p>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        {availableSubjects.map(subject => {
                            const isSelected = selectedSubjects.includes(subject);
                            return (
                                <label
                                    key={subject}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-white border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                                    onClick={() => toggleSubject(subject)}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{subject}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </Modal>

            {/* Add Class Modal */}
            <Modal isOpen={modal === 'addClass'} onClose={() => setModal(null)} title="Create New Class"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Plus size={14} /> Create Class</button></>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                        <input type="text" className="input-field" placeholder="e.g., Senior 1, Primary 8..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                        <select className="select-field">
                            <option>Nursery</option>
                            <option>Lower Primary</option>
                            <option>Upper Primary</option>
                            <option>O Level (Secondary)</option>
                            <option>A Level (Secondary)</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
