import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    Sparkles, Send, User, Bot, DollarSign, Calendar,
    BookOpen, Clock, CheckCircle2, AlertCircle, RefreshCw,
    Download, Phone, ArrowRight, Shield, Award, MessageSquare,
    ChevronDown, ThumbsUp, ThumbsDown, Copy, Check
} from 'lucide-react';

export default function ParentAiChat() {
    const [selectedChild, setSelectedChild] = useState('ivan');
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    const childrenData = {
        ivan: {
            name: 'Ivan Namukasa',
            class: 'Senior 4 East (S.4)',
            admissionNo: 'STU-2026-0842',
            fees: {
                totalTerm: 'UGX 1,450,000',
                paid: 'UGX 1,450,000',
                balance: 'UGX 0.00',
                status: 'Cleared',
                receiptNo: 'REC-UGA-8821'
            },
            grades: [
                { subject: 'Mathematics', score: '88%', grade: 'D1', remarks: 'Excellent problem solving' },
                { subject: 'Physics', score: '82%', grade: 'D1', remarks: 'Strong practical concepts' },
                { subject: 'Chemistry', score: '79%', grade: 'D2', remarks: 'Good lab performance' },
                { subject: 'Biology', score: '85%', grade: 'D1', remarks: 'Consistently top of stream' },
                { subject: 'English Language', score: '76%', grade: 'D2', remarks: 'Good essay comprehension' }
            ],
            attendance: {
                rate: '98.6%',
                presentDays: 44,
                absentDays: 1,
                todayStatus: 'Present (Checked in at 7:22 AM)',
                streak: '18 consecutive school days'
            },
            teachers: {
                classTeacher: 'Mr. Kenneth Okello (Maths) - +256 772 100 200',
                headOfSection: 'Mrs. Florence Nakato - +256 701 300 400'
            }
        },
        grace: {
            name: 'Grace Namukasa',
            class: 'Primary 6 Blue (P.6)',
            admissionNo: 'STU-2026-0129',
            fees: {
                totalTerm: 'UGX 980,000',
                paid: 'UGX 700,000',
                balance: 'UGX 280,000',
                status: 'Pending Balance',
                receiptNo: 'REC-UGA-9914'
            },
            grades: [
                { subject: 'Mathematics', score: '91%', grade: 'D1', remarks: 'Outstanding arithmetic' },
                { subject: 'Science', score: '89%', grade: 'D1', remarks: 'Exceptional projects' },
                { subject: 'Social Studies (SST)', score: '84%', grade: 'D1', remarks: 'Very attentive in class' },
                { subject: 'English', score: '86%', grade: 'D1', remarks: 'Superb creative writing' }
            ],
            attendance: {
                rate: '100%',
                presentDays: 45,
                absentDays: 0,
                todayStatus: 'Present (Checked in at 7:15 AM)',
                streak: '45 consecutive school days'
            },
            teachers: {
                classTeacher: 'Tr. Sarah Nabirye (English) - +256 782 555 666',
                headOfSection: 'Tr. David Mukasa - +256 752 111 222'
            }
        }
    };

    const currentChild = childrenData[selectedChild];

    // Initial message history
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            time: '12:00 PM',
            text: `Hello Mary! I am your EduManage Parent AI Assistant. I have instant access to ${currentChild.name}'s verified academic records, fee ledgers, daily attendance, and school calendar for Kampala High School. How can I help you today?`,
            cardType: null
        }
    ]);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Quick Prompt Suggestions
    const quickPrompts = [
        { label: '💰 Check fee balance', query: `What is the current fee status and balance for ${currentChild.name}?` },
        { label: '📊 View latest grades', query: `Can you show me ${currentChild.name}'s latest grades and term performance?` },
        { label: '⏱️ Today\'s attendance', query: `Did ${currentChild.name} attend school today and what is the attendance rate?` },
        { label: '📅 Upcoming school dates', query: `When is the next visitation day, midterm exams, and end of term?` },
        { label: '🧑‍🏫 Contact class teacher', query: `Who is ${currentChild.name}'s class teacher and how can I reach them?` }
    ];

    // Simulated Intelligent Response Generator
    const generateAiResponse = (userText) => {
        const lower = userText.toLowerCase();
        let reply = '';
        let cardType = null;
        let cardData = null;

        if (lower.includes('fee') || lower.includes('balance') || lower.includes('pay') || lower.includes('money') || lower.includes('receipt')) {
            reply = `Here is the verified financial summary for **${currentChild.name}** (${currentChild.class}) for Term 1:`;
            cardType = 'fees';
            cardData = currentChild.fees;
        } else if (lower.includes('grade') || lower.includes('mark') || lower.includes('score') || lower.includes('performance') || lower.includes('report') || lower.includes('exam')) {
            reply = `Here is the current academic assessment breakdown for **${currentChild.name}** (${currentChild.class}):`;
            cardType = 'grades';
            cardData = currentChild.grades;
        } else if (lower.includes('attendance') || lower.includes('present') || lower.includes('absent') || lower.includes('arrive') || lower.includes('check in')) {
            reply = `Here is the live attendance tracking record for **${currentChild.name}**:`;
            cardType = 'attendance';
            cardData = currentChild.attendance;
        } else if (lower.includes('date') || lower.includes('visitation') || lower.includes('term') || lower.includes('holiday') || lower.includes('calendar') || lower.includes('exam date')) {
            reply = `Here are the official upcoming school events and dates for this academic term:`;
            cardType = 'calendar';
            cardData = [
                { event: 'Mid-Term Assessment Week', date: 'October 14 - 18, 2026', badge: 'Academics' },
                { event: 'Term 1 General Visitation Day', date: 'October 25, 2026 (9:00 AM - 4:00 PM)', badge: 'Parents' },
                { event: 'Annual Sports Day & Inter-House Gala', date: 'November 08, 2026', badge: 'Co-Curricular' },
                { event: 'End of Term UNEB Mock Final Exams', date: 'November 22 - 28, 2026', badge: 'Examinations' },
                { event: 'Official Term 1 Closure & Report Cards', date: 'December 04, 2026', badge: 'Closure' }
            ];
        } else if (lower.includes('teacher') || lower.includes('contact') || lower.includes('phone') || lower.includes('headteacher') || lower.includes('reach')) {
            reply = `Here are the official contact channels for **${currentChild.name}**'s educators:`;
            cardType = 'teachers';
            cardData = currentChild.teachers;
        } else {
            reply = `Thank you for your question regarding **${currentChild.name}** (${currentChild.class}). As your school assistant, I can instantly pull fees, marksheets, attendance, or connect you with teachers. Please select a quick action or ask any question about Kampala High School policies.`;
        }

        return { reply, cardType, cardData };
    };

    const handleSendMessage = (textToSend) => {
        const query = (textToSend || inputMessage).trim();
        if (!query) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: query,
            cardType: null
        };

        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate fast AI processing
        setTimeout(() => {
            const { reply, cardType, cardData } = generateAiResponse(query);
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: reply,
                cardType,
                cardData
            };
            setIsTyping(false);
            setMessages(prev => [...prev, aiMsg]);
        }, 500);
    };

    const handleCopyText = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1800);
    };

    const handleResetChat = () => {
        setMessages([
            {
                id: Date.now(),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Chat reset. Hello Mary! I am ready to answer any questions about ${currentChild.name}'s school progress, fees, or attendance.`,
                cardType: null
            }
        ]);
    };

    return (
        <DashboardLayout role="parent">
            <div className="max-w-5xl mx-auto space-y-4">
                
                {/* Header Bar */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    EduBot Parent AI Assistant
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Records
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                Instant automated answers for fees, attendance, UNEB grades, and teacher contacts.
                            </p>
                        </div>
                    </div>

                    {/* Child Switcher Dropdown */}
                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 hidden sm:inline">
                            Student:
                        </span>
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ivan">Ivan Namukasa (S.4 East)</option>
                            <option value="grace">Grace Namukasa (P.6 Blue)</option>
                        </select>
                        <button
                            onClick={handleResetChat}
                            title="Clear conversation"
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Chat Container */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm flex flex-col h-[650px] overflow-hidden">
                    
                    {/* Chat Messages Log */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                        {messages.map((msg, index) => {
                            const isAi = msg.sender === 'ai';
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                                >
                                    {/* Bot Avatar */}
                                    {isAi && (
                                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                                            <Bot size={16} />
                                        </div>
                                    )}

                                    <div className={`max-w-xl space-y-2 ${isAi ? 'items-start' : 'items-end'}`}>
                                        
                                        {/* Message Bubble */}
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                            isAi
                                                ? 'bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-tl-sm border border-gray-200/70 dark:border-slate-800'
                                                : 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                                        }`}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>

                                            {/* RENDER EMBEDDED DATA CARDS */}
                                            {/* 1. Fees Data Card */}
                                            {msg.cardType === 'fees' && msg.cardData && (
                                                <div className="mt-3 p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2.5 text-xs">
                                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                                                        <span className="font-semibold text-gray-600 dark:text-slate-400">Term 1 Total Billed:</span>
                                                        <span className="font-bold text-gray-900 dark:text-white font-mono">{msg.cardData.totalTerm}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                                                        <span className="font-semibold text-gray-600 dark:text-slate-400">Total Paid to Date:</span>
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{msg.cardData.paid}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                                                        <span className="font-semibold text-gray-600 dark:text-slate-400">Outstanding Balance:</span>
                                                        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{msg.cardData.balance}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-1">
                                                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                                                            msg.cardData.status === 'Cleared'
                                                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                                                        }`}>
                                                            {msg.cardData.status}
                                                        </span>
                                                        <span className="text-gray-400 text-[11px] font-mono">Ref: {msg.cardData.receiptNo}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. Grades Data Card */}
                                            {msg.cardType === 'grades' && msg.cardData && (
                                                <div className="mt-3 bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden text-xs">
                                                    <table className="w-full text-left">
                                                        <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 font-semibold border-b border-gray-100 dark:border-slate-800">
                                                            <tr>
                                                                <th className="py-2 px-3">Subject</th>
                                                                <th className="py-2 px-3">Score</th>
                                                                <th className="py-2 px-3">Grade</th>
                                                                <th className="py-2 px-3 hidden sm:table-cell">Remarks</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                                                            {msg.cardData.map((g, i) => (
                                                                <tr key={i}>
                                                                    <td className="py-2 px-3 font-medium">{g.subject}</td>
                                                                    <td className="py-2 px-3 font-bold font-mono">{g.score}</td>
                                                                    <td className="py-2 px-3">
                                                                        <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                                                                            {g.grade}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-3 text-gray-500 dark:text-slate-400 hidden sm:table-cell">{g.remarks}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* 3. Attendance Data Card */}
                                            {msg.cardType === 'attendance' && msg.cardData && (
                                                <div className="mt-3 p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2 text-xs">
                                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                                                        <span className="font-semibold text-gray-600 dark:text-slate-400">Today's Presence:</span>
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                            <CheckCircle2 size={14} /> {msg.cardData.todayStatus}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                                                        <span className="font-semibold text-gray-600 dark:text-slate-400">Overall Attendance Rate:</span>
                                                        <span className="font-bold text-gray-900 dark:text-white font-mono">{msg.cardData.rate}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                                                        <span>Days Present: <strong>{msg.cardData.presentDays}</strong></span>
                                                        <span>Streak: <strong>{msg.cardData.streak}</strong></span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 4. Calendar Events Card */}
                                            {msg.cardType === 'calendar' && msg.cardData && (
                                                <div className="mt-3 space-y-2 text-xs">
                                                    {msg.cardData.map((ev, i) => (
                                                        <div key={i} className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                                            <div>
                                                                <p className="font-bold text-gray-900 dark:text-white">{ev.event}</p>
                                                                <p className="text-[11px] text-gray-500 dark:text-slate-400">{ev.date}</p>
                                                            </div>
                                                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-semibold text-[10px]">
                                                                {ev.badge}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* 5. Teachers Contact Card */}
                                            {msg.cardType === 'teachers' && msg.cardData && (
                                                <div className="mt-3 p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2 text-xs">
                                                    <div className="pb-2 border-b border-gray-100 dark:border-slate-800">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Class Teacher</span>
                                                        <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{msg.cardData.classTeacher}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Head of Section</span>
                                                        <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{msg.cardData.headOfSection}</p>
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                        {/* Bottom Action / Meta */}
                                        <div className={`flex items-center gap-2 px-1 text-[11px] text-gray-400 dark:text-slate-500 ${isAi ? 'justify-start' : 'justify-end'}`}>
                                            <span>{msg.time}</span>
                                            {isAi && (
                                                <>
                                                    <span>•</span>
                                                    <button
                                                        onClick={() => handleCopyText(msg.text, index)}
                                                        className="hover:text-gray-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
                                                    >
                                                        {copiedIndex === index ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                                        <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                    </div>

                                    {/* User Avatar */}
                                    {!isAi && (
                                        <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex gap-3 justify-start items-center animate-in fade-in">
                                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="p-3.5 bg-gray-100 dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    <span className="text-xs text-gray-500 dark:text-slate-400 ml-2 font-medium">Pulling student records...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions Chips Bar */}
                    <div className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 flex-shrink-0">
                            Suggestions:
                        </span>
                        {quickPrompts.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(p.query)}
                                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors flex-shrink-0 shadow-2xs"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input Box */}
                    <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={`Ask anything about ${currentChild.name}'s fees, attendance, or grades...`}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="py-3 px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                            >
                                <span>Send</span>
                                <Send size={15} />
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}
