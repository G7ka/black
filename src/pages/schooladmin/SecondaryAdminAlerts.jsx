import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Megaphone, MessageSquare, Mail, AlertTriangle, Send, Users, Clock, History, CheckCircle, Bell } from 'lucide-react'

const history = [
    { id: 1, type: 'SMS', audience: 'S4 Parents', message: 'Dear Parent, S4 mock examinations begin next week Monday. Please ensure your child is prepared.', date: 'Feb 20, 2026', time: '14:30', status: 'Delivered' },
    { id: 3, type: 'Emergency', audience: 'All Users', message: 'Heavy rainfall warning. School will close at 3 PM today. Please arrange for early pick-up.', date: 'Jan 15, 2026', time: '11:00', status: 'Delivered' },
]

export default function SecondaryAdminAlerts() {
    const [messageType, setMessageType] = useState('SMS')
    const [audience, setAudience] = useState('All Parents')
    const [message, setMessage] = useState('')

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><Megaphone className="text-indigo-600" /> Emergency & Broadcasts</h1>
                        <p className="page-subtitle">Send bulk SMS, Emails, or App Notifications to the secondary school community.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Composer */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card border-t-4 border-t-indigo-500">
                            <h2 className="section-title mb-6">Compose Broadcast</h2>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Type Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Method</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['SMS', 'App Notification', 'Email'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setMessageType(type)}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1
                                                        ${messageType === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {type === 'SMS' ? <MessageSquare size={16} /> : type === 'Email' ? <Mail size={16} /> : <Bell size={16} />}
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Audience Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
                                        <select
                                            className="input-field w-full py-3 focus:ring-indigo-500"
                                            value={audience}
                                            onChange={(e) => setAudience(e.target.value)}
                                        >
                                            <option>All Parents</option>
                                            <option>All Teachers</option>
                                            <option>All Students</option>
                                            <option>Specific Class (e.g. S1 - S6)</option>
                                            <option className="text-red-500 font-bold">EMERGENCY: ALL USERS</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-sm font-semibold text-slate-700">Message Content</label>
                                        <span className={`text-xs font-bold ${message.length > 160 && messageType === 'SMS' ? 'text-red-500' : 'text-slate-400'}`}>
                                            {message.length} / {messageType === 'SMS' ? 160 : 500} chars {messageType === 'SMS' && message.length > 160 && '(Will send as 2 SMS limits)'}
                                        </span>
                                    </div>
                                    <textarea
                                        rows={5}
                                        className="input-field w-full resize-none focus:ring-indigo-500"
                                        placeholder={`Type your ${messageType} message here...`}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Warning & Send */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                        <AlertTriangle size={16} className="flex-shrink-0" />
                                        <p>This action cannot be undone once sent.</p>
                                    </div>
                                    <button className="flex items-center gap-2 w-full sm:w-auto px-8 py-3 text-base bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm" disabled={!message.trim()}>
                                        <Send size={18} /> Send Broadcast Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Broadcast History */}
                    <div className="card p-0 flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <p className="font-bold text-slate-800 flex items-center gap-2"><History size={16} className="text-slate-500" /> Recent Broadcasts</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {history.map(item => (
                                <div key={item.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white relative overflow-hidden">
                                    {item.type === 'Emergency' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={item.type === 'Emergency' ? 'danger' : item.type === 'SMS' ? 'primary' : 'warning'}>{item.type}</Badge>
                                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5 mt-3">
                                        <Users size={14} className="text-slate-400" /> {item.audience}
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">"{item.message}"</p>
                                    <div className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600">
                                        <CheckCircle size={12} /> {item.status} ({item.time})
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
