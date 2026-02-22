import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Bell, CheckCircle, AlertTriangle, Info, Megaphone, GraduationCap, DollarSign, CalendarDays } from 'lucide-react'

const notifications = [
    { id: 1, type: 'danger', icon: DollarSign, title: 'Fee Payment Reminder', body: 'Your fee balance of UGX 365,000 for Term 1, 2026 is due on March 1. Please settle to avoid disruption.', time: '1 hour ago', read: false },
    { id: 2, type: 'success', icon: GraduationCap, title: 'Excellent Grade Alert', body: "Ivan scored 91% in Social Studies — the highest in class P6A. Congratulations!", time: '3 hours ago', read: false },
    { id: 3, type: 'warning', icon: CalendarDays, title: 'Late Arrival Notice', body: 'Ivan arrived 25 minutes late on Monday, February 17. Please ensure punctual school arrival.', time: 'Feb 17', read: true },
    { id: 4, type: 'info', icon: Megaphone, title: 'School Announcement', body: 'Parent-Teacher Meeting scheduled for February 28, 2026 at 3:00 PM. Attendance is required.', time: 'Feb 16', read: true },
    { id: 5, type: 'success', icon: CheckCircle, title: 'Attendance Streak', body: 'Ivan has achieved 5 consecutive days of full attendance this week. Keep it up!', time: 'Feb 14', read: true },
    { id: 6, type: 'warning', icon: AlertTriangle, title: 'Absence Notice', body: 'Ivan was absent on Tuesday, February 10. An excused absence note has been recorded.', time: 'Feb 10', read: true },
    { id: 7, type: 'info', icon: Info, title: 'New Assignment Posted', body: 'Mr. Okello posted a new Mathematics assignment due February 24. Please check if Ivan has started.', time: 'Feb 9', read: true },
]

const typeConfig = {
    danger: { bg: 'bg-red-50 border-red-200', badge: 'danger', iconBg: 'bg-red-100 text-red-600' },
    success: { bg: 'bg-emerald-50 border-emerald-200', badge: 'success', iconBg: 'bg-emerald-100 text-emerald-600' },
    warning: { bg: 'bg-amber-50 border-amber-200', badge: 'warning', iconBg: 'bg-amber-100 text-amber-600' },
    info: { bg: 'bg-blue-50 border-blue-100', badge: 'info', iconBg: 'bg-blue-100 text-blue-600' },
}

export default function ParentNotifications() {
    const [read, setRead] = useState(notifications.reduce((acc, n) => ({ ...acc, [n.id]: n.read }), {}))
    const markAll = () => setRead(prev => Object.fromEntries(Object.keys(prev).map(k => [k, true])))
    const unreadCount = Object.values(read).filter(v => !v).length

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><Bell /> Notifications</h1>
                        <p className="page-subtitle">Stay updated on Ivan's progress and school announcements</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">{unreadCount} unread</span>}
                        <button onClick={markAll} className="btn-secondary text-sm"><CheckCircle size={14} /> Mark all read</button>
                    </div>
                </div>

                <div className="space-y-3">
                    {notifications.map(n => {
                        const cfg = typeConfig[n.type]
                        const isRead = read[n.id]
                        return (
                            <div key={n.id} onClick={() => setRead(p => ({ ...p, [n.id]: true }))} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${isRead ? 'bg-white border-gray-100 opacity-70' : `${cfg.bg} border shadow-sm`}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}><n.icon size={18} /></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <p className={`text-sm font-bold ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
                                        {!isRead && <Badge variant={cfg.badge}>New</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-500">{n.body}</p>
                                    <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </DashboardLayout>
    )
}
