import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { GraduationCap, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { paymentsApi } from '../api/payments.api'

const STATUS_META = {
    COMPLETED: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Payment Successful' },
    FAILED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Payment Failed' },
    INVALID: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Payment Invalid' },
    REVERSED: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Payment Reversed' },
    PENDING: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Payment Pending' },
}

export default function PaymentCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const orderTrackingId = searchParams.get('OrderTrackingId')

    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!orderTrackingId) {
            setError('No payment reference found in the URL.')
            setLoading(false)
            return
        }
        // Per Pesapal's docs, neither the callback URL nor the IPN carry the
        // actual payment status — we fetch it explicitly here.
        paymentsApi.getPublicStatus(orderTrackingId)
            .then(setResult)
            .catch((err) => setError(err.message || 'Could not verify payment status'))
            .finally(() => setLoading(false))
    }, [orderTrackingId])

    const meta = result ? (STATUS_META[result.status] || STATUS_META.PENDING) : null
    const Icon = meta?.icon

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-200 mb-4">
                        <GraduationCap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900">EduManage Payments</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                    {loading && <p className="text-sm text-gray-500">Verifying your payment…</p>}

                    {!loading && error && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <XCircle size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Could Not Verify Payment</h2>
                            <p className="text-sm text-gray-500">{error}</p>
                        </>
                    )}

                    {!loading && !error && result && (
                        <>
                            <div className={`w-16 h-16 rounded-full ${meta.bg} flex items-center justify-center mx-auto mb-4`}>
                                <Icon size={32} className={meta.color} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">{meta.label}</h2>
                            <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">{result.currency} {result.amount?.toLocaleString()}</span></div>
                                {result.paymentMethod && <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-semibold">{result.paymentMethod}</span></div>}
                                {result.confirmationCode && <div className="flex justify-between"><span className="text-gray-500">Confirmation</span><span className="font-mono text-xs">{result.confirmationCode}</span></div>}
                            </div>
                            {result.status === 'PENDING' && (
                                <p className="text-xs text-gray-400 mt-4">If you just completed payment, this may take a moment to update. Refresh this page shortly.</p>
                            )}
                        </>
                    )}

                    <button onClick={() => navigate('/')} className="mt-6 w-full py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                        Return to EduManage
                    </button>
                </div>
            </div>
        </div>
    )
}
