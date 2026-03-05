import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GraduationCap, Mail, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const returnTo = searchParams.get('from') || '/'

    const [step, setStep] = useState(1) // 1=email, 2=code, 3=new password, 4=done
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSendCode = (e) => {
        e.preventDefault()
        if (!email.trim()) return setError('Please enter your email address.')
        setError('')
        // Simulate sending verification code to school email
        setStep(2)
    }

    const handleVerifyCode = (e) => {
        e.preventDefault()
        if (code.length < 6) return setError('Please enter the 6-digit verification code.')
        setError('')
        setStep(3)
    }

    const handleResetPassword = (e) => {
        e.preventDefault()
        if (newPassword.length < 6) return setError('Password must be at least 6 characters.')
        if (newPassword !== confirmPassword) return setError('Passwords do not match.')
        setError('')
        setStep(4)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-200 mb-4">
                        <GraduationCap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Reset Your Password</h1>
                    <p className="text-sm text-slate-500 mt-1">EduManage secure password recovery</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Step indicators */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > s ? 'bg-emerald-100 text-emerald-700' : step === s ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                                    }`}>{step > s ? '✓' : s}</div>
                                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Enter email */}
                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Enter your email</h2>
                                <p className="text-sm text-gray-500 mb-4">We'll send a 6-digit verification code to the email registered with your school account.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-sm transition-shadow"
                                        placeholder="yourname@school.edu.ug"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                                <Mail size={16} /> Send Verification Code
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter code */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Enter verification code</h2>
                                <p className="text-sm text-gray-500 mb-4">A 6-digit code has been sent to <strong className="text-gray-700">{email}</strong>. Check your inbox and spam folder.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-center text-2xl font-mono tracking-[0.5em] transition-shadow"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                                <ShieldCheck size={16} /> Verify Code
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                ← Didn't receive it? Try again
                            </button>
                        </form>
                    )}

                    {/* Step 3: New password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Set new password</h2>
                                <p className="text-sm text-gray-500 mb-4">Choose a strong password you haven't used before.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-sm transition-shadow"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-sm transition-shadow"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                                <KeyRound size={16} /> Reset Password
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-4 space-y-5">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                <CheckCircle2 size={32} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Password Reset Successfully!</h2>
                                <p className="text-sm text-gray-500">Your password has been updated. You can now log in with your new credentials.</p>
                            </div>
                            <button
                                onClick={() => navigate(returnTo)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Back link */}
                {step < 4 && (
                    <div className="text-center mt-6">
                        <button onClick={() => navigate(returnTo)} className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 mx-auto">
                            <ArrowLeft size={14} /> Back to login
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
