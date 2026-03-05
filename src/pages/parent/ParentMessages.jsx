import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Phone, Mail, BookOpen, User, GraduationCap, Calendar } from 'lucide-react'

const childrenData = [
    {
        id: 1,
        name: 'Ivan Namukasa',
        class: 'Primary 6A',
        age: '11 years',
        teachers: [
            { id: 101, name: 'Mr. Kenneth Okello', role: 'Mathematics & Class Teacher', phone: '+256 772 123 456', email: 'kokello@kampalaprimary.ug', initials: 'KO', color: 'from-emerald-400 to-teal-600' },
            { id: 102, name: 'Ms. Agnes Nassali', role: 'English Teacher', phone: '+256 752 987 654', email: 'anassali@kampalaprimary.ug', initials: 'AN', color: 'from-violet-400 to-purple-600' }
        ]
    },
    {
        id: 2,
        name: 'Mary Namukasa',
        class: 'Senior 1B',
        age: '13 years',
        teachers: [
            { id: 201, name: 'Mr. David Byaruhanga', role: 'Science & Class Teacher', phone: '+256 701 234 567', email: 'dbyaruhanga@kampalasecondary.ug', initials: 'DB', color: 'from-blue-400 to-blue-600' },
            { id: 202, name: 'Ms. Sarah Acen', role: 'Social Studies', phone: '+256 773 345 678', email: 'sacen@kampalasecondary.ug', initials: 'SA', color: 'from-orange-400 to-amber-600' }
        ]
    }
]

export default function ParentMessages() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <DashboardLayout role="parent">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Children & Teachers</h1>
                        <p className="page-subtitle">View your children's details and contact their teachers directly.</p>
                    </div>
                    <div className="relative max-w-sm w-full">
                        <input
                            type="text"
                            placeholder="Search for a teacher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                        />
                        <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                </div>

                {childrenData.map(child => {
                    // Filter teachers based on search term, but only if they belong to this child
                    const filteredTeachers = child.teachers.filter(t =>
                        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.role.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    // If searching and no teachers match for this child, optionally hide the child's section.
                    // But usually, it's better to show the child and an empty state, or just hide. Let's hide if no matches and there's a search term.
                    if (searchTerm && filteredTeachers.length === 0) return null;

                    return (
                        <div key={child.id} className="space-y-4">
                            {/* Child Header Card */}
                            <div className="bg-white border-l-4 border-l-orange-500 rounded-xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{child.name}</h2>
                                        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mt-0.5">
                                            <span className="flex items-center gap-1"><BookOpen size={14} className="text-orange-400" /> {child.class}</span>
                                            <span className="flex items-center gap-1"><Calendar size={14} className="text-orange-400" /> {child.age}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teachers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-4 md:pl-8 border-l-2 border-slate-100 ml-4">
                                {filteredTeachers.map(teacher => (
                                    <div key={teacher.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className={`h-16 bg-gradient-to-r ${teacher.color} flex items-center px-4`}>
                                            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center text-white font-bold text-lg border border-white/30">
                                                {teacher.initials}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-slate-900 leading-tight mb-1">{teacher.name}</h3>
                                            <p className="text-xs font-semibold text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-md mb-3">{teacher.role}</p>

                                            <div className="space-y-2 mt-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span className="font-medium text-slate-700">{teacher.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail size={14} className="text-slate-400" />
                                                    <a href={`mailto:${teacher.email}`} className="font-medium text-slate-600 hover:text-primary-600 truncate">{teacher.email}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredTeachers.length === 0 && !searchTerm && (
                                    <p className="text-slate-500 text-sm py-4">No teachers assigned yet.</p>
                                )}
                            </div>
                        </div>
                    )
                })}

                {childrenData.every(child =>
                    child.teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.role.toLowerCase().includes(searchTerm.toLowerCase())).length === 0
                ) && searchTerm && (
                        <div className="text-center py-12 text-slate-500">
                            No teachers found matching "{searchTerm}".
                        </div>
                    )}
            </div>
        </DashboardLayout>
    )
}
