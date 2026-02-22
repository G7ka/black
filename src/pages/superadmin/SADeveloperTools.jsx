import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Key, Search, Copy, RefreshCw, ToggleLeft, ToggleRight, Terminal, CheckCircle } from 'lucide-react'

const apiKeys = [
    { id: 1, name: 'Production API Key', key: 'em_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '2026-01-15', lastUsed: '2026-02-22', status: 'active' },
    { id: 2, name: 'School Integration Key', key: 'em_school_xxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '2026-02-01', lastUsed: '2026-02-20', status: 'active' },
    { id: 3, name: 'Webhook Secret', key: 'whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: '2025-12-10', lastUsed: '2026-02-21', status: 'active' },
]

const sampleLogs = [
    'GET /api/v1/schools 200 45ms',
    'POST /api/v1/attendance 201 120ms',
    'GET /api/v1/students?class=P4 200 38ms',
    'PUT /api/v1/grades/654321 200 92ms',
    'POST /api/v1/payments/initiate 200 210ms',
    'GET /api/v1/schools/507f1f77 404 12ms',
    'POST /api/v1/sms/send 200 340ms',
]

export default function SADeveloperTools() {
    const [sandbox, setSandbox] = useState(false)
    const [logQuery, setLogQuery] = useState('')
    const [copied, setCopied] = useState(null)

    const copyKey = (id, key) => {
        navigator.clipboard.writeText(key).catch(() => { })
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const filteredLogs = logQuery ? sampleLogs.filter(l => l.toLowerCase().includes(logQuery.toLowerCase())) : sampleLogs

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title">Developer Tools</h1><p className="page-subtitle">API keys, log searcher, and sandbox environment</p></div>

                {/* Sandbox toggle */}
                <div className={`card flex items-center justify-between border-2 ${sandbox ? 'border-amber-400 bg-amber-50' : 'border-gray-100'}`}>
                    <div><p className="font-semibold text-gray-900">Sandbox Mode</p><p className="text-sm text-gray-500">All actions are simulated — no real data is affected</p></div>
                    <button onClick={() => setSandbox(p => !p)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors ${sandbox ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {sandbox ? <><ToggleRight size={16} /> SANDBOX ON</> : <><ToggleLeft size={16} /> SANDBOX OFF</>}
                    </button>
                </div>

                {/* API Keys */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title mb-0">API Keys</h2>
                        <button className="btn-primary text-xs py-1.5"><Key size={13} /> Generate New Key</button>
                    </div>
                    <div className="space-y-3">
                        {apiKeys.map(k => (
                            <div key={k.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{k.name}</p>
                                    <p className="text-xs font-mono text-gray-500 mt-0.5 truncate max-w-xs">{sandbox ? k.key.replace(/x/g, '*') : k.key}</p>
                                    <p className="text-xs text-gray-400 mt-1">Created: {k.created} · Last used: {k.lastUsed}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <button onClick={() => copyKey(k.id, k.key)} className="btn-secondary text-xs py-1.5 px-3">
                                        {copied === k.id ? <><CheckCircle size={11} className="text-emerald-500" /> Copied</> : <><Copy size={11} /> Copy</>}
                                    </button>
                                    <button className="btn-danger text-xs py-1.5 px-3"><RefreshCw size={11} /> Revoke</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Log Searcher */}
                <div className="card">
                    <h2 className="section-title">API Log Searcher</h2>
                    <div className="relative mb-4">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={logQuery} onChange={e => setLogQuery(e.target.value)} className="input-field pl-9" placeholder="Search logs (e.g., POST, 404, /schools)..." />
                    </div>
                    <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs space-y-1.5 max-h-56 overflow-y-auto">
                        {filteredLogs.length ? filteredLogs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-gray-500 flex-shrink-0">09:5{i}:{String(i * 7).padStart(2, '0')}</span>
                                <span className={`text-sm ${log.includes('404') ? 'text-red-400' : log.includes('POST') ? 'text-amber-300' : 'text-emerald-300'}`}>{log}</span>
                            </div>
                        )) : <p className="text-gray-500">No logs match your query.</p>}
                    </div>
                </div>

                {/* Testing Sandbox */}
                <div className="card">
                    <h2 className="section-title flex items-center gap-2"><Terminal size={18} /> API Testing Sandbox</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                            <select className="select-field"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                            <input className="input-field" defaultValue="/api/v1/schools" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Request Body (JSON)</label>
                        <textarea className="input-field font-mono text-xs resize-none" rows={4} placeholder={'{\n  "name": "Test School"\n}'} />
                    </div>
                    <button className="btn-primary mt-4"><Terminal size={14} /> Send Request</button>
                    <div className="mt-4 bg-gray-950 rounded-xl p-4 text-xs font-mono text-emerald-400">
                        <p className="text-gray-500 mb-1">// Response</p>
                        <p>{`{ "status": 200, "data": { "_id": "...", "name": "Greenhill Academy", "subdomain": "greenhill" } }`}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
