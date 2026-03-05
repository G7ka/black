import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Phone, Mail, BookOpen, User } from 'lucide-react'

const teachers = [
    { id: 1, name: 'Mr. Kenneth Okello', role: 'Mathematics Teacher & Class Teacher (P6A)', initials: 'KO', phone: '+256 772 123 456', email: 'kokello@kampalahigh.ug', color: 'from-emerald-400 to-teal-600' },
    { id: 2, name: 'Ms. Agnes Nassali', role: 'English Teacher', initials: 'AN', phone: '+256 752 987 654', email: 'anassali@kampalahigh.ug', color: 'from-violet-400 to-purple-600' },
    { id: 3, name: 'Mr. David Byaruhanga', role: 'Science Teacher', initials: 'DB', phone: '+256 701 234 567', email: 'dbyaruhanga@kampalahigh.ug', color: 'from-blue-400 to-blue-600' },
    { id: 4, name: 'Ms. Sarah Acen', role: 'Social Studies Teacher', initials: 'SA', phone: '+256 773 345 678', email: 'sacen@kampalahigh.ug', color: 'from-orange-400 to-amber-600' },
]

export default function StudentMessages() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">My Teachers</h1>
                        <p className="page-subtitle">Contact information for all your subject teachers.</p>
                    </div>
                    <div className="relative max-w-sm w-full">
                        <input
                            type="text"
                            placeholder="Find a teacher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                        />
                        <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTeachers.map(teacher => (
                        <div key={teacher.id} className="card p-0 overflow-hidden border-border hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className={`h-24 bg-gradient-to-r ${teacher.color} relative`}>
                                <div className="absolute -bottom-8 left-6">
                                    <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-md">
                                        <div className={`w-full h-full rounded-lg bg-gradient-to-br ${teacher.color} flex items-center justify-center text-white text-xl font-bold`}>
                                            {teacher.initials}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 pb-6 px-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{teacher.name}</h3>
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-4">
                                    <BookOpen size={14} className="text-primary-500" />
                                    <span>{teacher.role}</span>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                            <Phone size={14} />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">{teacher.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                            <Mail size={14} />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-600 truncate">{teacher.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredTeachers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No teachers found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
