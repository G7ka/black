import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Megaphone, MessageSquare, Mail, AlertTriangle, Send, Users, Clock, History, CheckCircle } from 'lucide-react'
import { classesApi } from '../../api/classes.api'
import { schoolAlertsApi } from '../../api/schoolOps.api'

const CHANNEL_MAP = { SMS: 'SMS', 'App Notification': 'APP', Email: 'EMAIL' }

export default function SchoolAdminAlerts({ role = "schooladmin-primary" }) {
    const [messageType, setMessageType] = useState('Email')
    const [audience, setAudience] = useState('All Parents')
    const [classAudience, setClassAudience] = useState('')
    const [message, setMessage] = useState('')
    const [classes, setClasses] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [sendError, setSendError] = useState('')
    const [sending, setSending] = useState(false)

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            const [classList, alerts] = await Promise.all([classesApi.list(), schoolAlertsApi.list()])
            setClasses(classList)
            setHistory(alerts)
        } catch (err) {
            setLoadError(err.message || 'Failed to load alerts')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const resolvedAudience = audience === 'Specific Class' ? `Class:${classAudience}` : audience === 'EMERGENCY: ALL USERS' ? 'EMERGENCY: ALL USERS' : audience

    const sendBroadcast = async () => {
        if (!message.trim()) return
        setSending(true); setSendError('')
        try {
            await schoolAlertsApi.send({
                channel: audience === 'EMERGENCY: ALL USERS' ? 'EMERGENCY' : CHANNEL_MAP[messageType],
                audience: resolvedAudience,
                message,
            })
            setMessage('')
            await load()
        } catch (err) {
            setSendError(err.message || 'Failed to send broadcast')
        } finally {
            setSending(false)
        }
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><Megaphone className="text-primary-600" /> Emergency & Broadcasts</h1>
                        <p className="page-subtitle">Send messages to your school community. Currently delivered by email — SMS/App push require a gateway that isn't connected yet.</p>
                    </div>
                </div>

                {loadError && <p className="text-sm text-red-600">{loadError}</p>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card">
                            <h2 className="section-title mb-6">Compose Broadcast</h2>
                            <div className="space-y-5">
                                {sendError && <p className="text-sm text-red-600">{sendError}</p>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Method</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['SMS', 'App Notification', 'Email'].map(type => (
                                                <button key={type} onClick={() => setMessageType(type)}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 ${messageType === type ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                    {type === 'SMS' ? <MessageSquare size={16} /> : type === 'Email' ? <Mail size={16} /> : <Megaphone size={16} />}
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                        {messageType !== 'Email' && <p className="text-[11px] text-amber-600 mt-1">Will be delivered by email — no {messageType} gateway connected.</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
                                        <select className="input-field w-full py-3" value={audience} onChange={(e) => setAudience(e.target.value)}>
                                            <option>All Parents</option>
                                            <option>All Teachers</option>
                                            <option>All Students</option>
                                            <option value="Specific Class">Specific Class</option>
                                            <option value="EMERGENCY: ALL USERS">EMERGENCY: ALL USERS</option>
                                        </select>
                                        {audience === 'Specific Class' && (
                                            <select className="input-field w-full py-2 mt-2" value={classAudience} onChange={e => setClassAudience(e.target.value)}>
                                                <option value="">Select class</option>
                                                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-sm font-semibold text-slate-700">Message Content</label>
                                        <span className="text-xs font-bold text-slate-400">{message.length} chars</span>
                                    </div>
                                    <textarea rows={5} className="input-field w-full resize-none" placeholder="Type your message here..." value={message} onChange={(e) => setMessage(e.target.value)} />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                        <AlertTriangle size={16} className="flex-shrink-0" /><p>This action cannot be undone once sent.</p>
                                    </div>
                                    <button className="btn-primary flex items-center gap-2 w-full sm:w-auto px-8 py-3 text-base" disabled={!message.trim() || sending} onClick={sendBroadcast}>
                                        <Send size={18} /> {sending ? 'Sending…' : 'Send Broadcast Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-0 flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <p className="font-bold text-slate-800 flex items-center gap-2"><History size={16} className="text-slate-500" /> Recent Broadcasts</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading && <p className="text-sm text-gray-400">Loading…</p>}
                            {!loading && history.map(item => (
                                <div key={item.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white relative overflow-hidden">
                                    {item.channel === 'EMERGENCY' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={item.channel === 'EMERGENCY' ? 'danger' : item.channel === 'SMS' ? 'info' : 'warning'}>{item.channel}</Badge>
                                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5 mt-3"><Users size={14} className="text-slate-400" /> {item.audience}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">"{item.message}"</p>
                                    <div className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600"><CheckCircle size={12} /> Sent to {item.recipientCount} recipient(s)</div>
                                </div>
                            ))}
                            {!loading && history.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No broadcasts sent yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
