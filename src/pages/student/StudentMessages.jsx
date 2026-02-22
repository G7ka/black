import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Send, Clock, CheckCircle, MessageCircle } from 'lucide-react'

const conversations = [
    { id: 1, name: 'Mr. Kenneth Okello', role: 'Mathematics Teacher', avatar: 'K', color: 'from-emerald-400 to-teal-600', lastMsg: 'Well done on your Fractions test! Keep up the excellent work.', time: '10:30 AM', unread: 1 },
    { id: 2, name: 'Ms. Agnes Nassali', role: 'English Teacher', avatar: 'A', color: 'from-violet-400 to-purple-600', lastMsg: 'Please make sure to submit your book review by Friday.', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Mrs. Namukasa (Parent)', role: 'Parent', avatar: 'M', color: 'from-orange-400 to-amber-600', lastMsg: 'How was school today? Did you eat lunch?', time: 'Yesterday', unread: 2 },
]

const messagesMap = {
    1: [
        { from: 'teacher', text: 'Hello Ivan, just checking in on how you\'re finding the algebra chapter.', time: '9:00 AM', date: 'Feb 22' },
        { from: 'me', text: 'Good morning sir! It\'s a bit challenging but I\'m working through the exercises.', time: '9:15 AM', date: 'Feb 22' },
        { from: 'teacher', text: 'Well done on your Fractions test! Keep up the excellent work.', time: '10:30 AM', date: 'Feb 22' },
    ],
    2: [
        { from: 'teacher', text: 'Please make sure to submit your book review by Friday.', time: '3:00 PM', date: 'Feb 21' },
        { from: 'me', text: 'Yes Ms. Nassali, I will submit it by Thursday.', time: '4:00 PM', date: 'Feb 21' },
    ],
    3: [
        { from: 'teacher', text: 'How was school today? Did you eat lunch?', time: '4:30 PM', date: 'Feb 21' },
        { from: 'teacher', text: 'Please let me know when you get home safely.', time: '5:00 PM', date: 'Feb 21' },
    ],
}

export default function StudentMessages() {
    const [active, setActive] = useState(conversations[0])
    const [msg, setMsg] = useState('')
    const [localMessages, setLocalMessages] = useState(messagesMap)

    const send = () => {
        if (!msg.trim()) return
        const newMsg = { from: 'me', text: msg, time: 'Now', date: 'Feb 22' }
        setLocalMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), newMsg] }))
        setMsg('')
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-4">
                <div><h1 className="page-title">Messages</h1><p className="page-subtitle">Messages from teachers and family</p></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
                    {/* Sidebar */}
                    <div className="card p-0 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100"><p className="font-semibold text-gray-800">Conversations</p></div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.map(c => (
                                <div key={c.id} onClick={() => setActive(c)} className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-50 ${active.id === c.id ? 'bg-blue-50 border-l-4 border-l-primary-500' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{c.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between"><p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p><p className="text-xs text-gray-400 flex-shrink-0">{c.time}</p></div>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.lastMsg}</p>
                                    </div>
                                    {c.unread > 0 && <span className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{c.unread}</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="card p-0 lg:col-span-2 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center text-white font-bold`}>{active.avatar}</div>
                            <div><p className="font-semibold text-gray-900">{active.name}</p><p className="text-xs text-gray-400">{active.role}</p></div>
                        </div>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {(localMessages[active.id] || []).map((m, i) => (
                                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs xl:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${m.from === 'me' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'}`}>
                                        <p>{m.text}</p>
                                        <p className={`text-xs mt-1 ${m.from === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>{m.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 flex gap-2">
                            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="input-field flex-1" placeholder="Type a message..." />
                            <button onClick={send} className="btn-primary px-4"><Send size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
