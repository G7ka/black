import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, MapPin, FileText, Globe, CheckCircle2, AlertCircle,
    ArrowRight, ArrowLeft, User, Phone, Mail, Lock, Eye, EyeOff,
    GraduationCap, Users, KeyRound, ShieldCheck, PersonStanding, MailIcon
} from 'lucide-react';

const TOTAL_STEPS = 5;

function StepBar({ step }) {
    const labels = ['School Info', 'Contact', 'Portal URL', 'Credentials', 'Done'];
    return (
        <div className="flex items-center gap-1 mb-8">
            {labels.map((label, i) => {
                const idx = i + 1;
                const done = step > idx;
                const active = step === idx;
                return (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                ${done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 'bg-slate-200 text-slate-400'}`}>
                                {done ? <CheckCircle2 size={14} /> : idx}
                            </div>
                            <span className={`text-[10px] font-semibold hidden sm:block ${active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
                        </div>
                        {i < labels.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded-full transition-all ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div >
    );
}

function InputField({ label, icon, hint, error, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    className={`block w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl text-sm transition-shadow bg-slate-50 focus:bg-white focus:outline-none focus:ring-2
                        ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-400 focus:border-blue-400'}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        </div>
    );
}

export default function SchoolRegistration() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Step 1 — School Info
    const [schoolName, setSchoolName] = useState('');
    const [schoolLevel, setSchoolLevel] = useState('Primary');
    const [physicalAddress, setPhysicalAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [numStudents, setNumStudents] = useState('');

    // Step 2 — Contact
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [licenseFile, setLicenseFile] = useState(null);

    // Step 3 — Subdomain
    const [subdomain, setSubdomain] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [level, setLevel] = useState('primary');

    // Step 4 — Credentials
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});

    const checkSubdomain = (val) => {
        const clean = val.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        setSubdomain(clean);
        setIsAvailable(null);
        if (clean.length < 3) return;
        setIsChecking(true);
        setTimeout(() => {
            const taken = ['kampala', 'admin', 'test', 'demo'];
            setIsAvailable(!taken.includes(clean));
            setIsChecking(false);
        }, 600);
    };

    const suggestUsername = (name) => {
        return name.trim().toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '') + '.admin';
    };

    const passwordStrength = (p) => {
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    };

    const pwStrength = passwordStrength(adminPassword);
    const pwColor = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'][Math.max(0, pwStrength - 1)] || 'bg-slate-200';
    const pwLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];

    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!schoolName.trim()) e.schoolName = 'School name is required';
            if (!physicalAddress.trim()) e.physicalAddress = 'Address is required';
            if (!district.trim()) e.district = 'District is required';
            if (!numStudents || isNaN(numStudents) || +numStudents < 1) e.numStudents = 'Enter a valid number';
        }
        if (s === 2) {
            if (!contactName.trim()) e.contactName = 'Name is required';
            if (!contactPhone.trim()) e.contactPhone = 'Phone is required';
            if (!contactEmail.trim() || !contactEmail.includes('@')) e.contactEmail = 'Valid email required';
        }
        if (s === 4) {
            if (!adminUsername.trim()) e.adminUsername = 'Username is required';
            if (adminPassword.length < 8) e.adminPassword = 'At least 8 characters';
            if (adminPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match';
            if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) e.recoveryEmail = 'Valid recovery email required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) setStep(step + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 py-10 px-4">

            {/* Logo / Back */}
            <div className="max-w-lg mx-auto mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <GraduationCap size={16} className="text-white" />
                    </div>
                    <span className="font-extrabold text-slate-800">EduManage</span>
                </div>
            </div>

            <div className="max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900">Register Your School</h1>
                    <p className="mt-1 text-sm text-slate-500">Join Uganda's fastest-growing school network</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
                    <StepBar step={step} />

                    {/* ── STEP 1: School Info ── */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Building2 size={18} className="text-blue-500" /> School Information
                            </h2>

                            <InputField
                                label="School Name"
                                icon={<Building2 size={16} />}
                                placeholder="e.g. Sunrise High School"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                error={errors.schoolName}
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-700">School Level</label>
                                <div className="mt-3 grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        type="button"
                                        aria-pressed={level === 'primary'}
                                        onClick={() => setLevel('primary')}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/40
                                            ${level === 'primary'
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                                    >
                                        Primary
                                    </button>
                                    <button
                                        type="button"
                                        aria-pressed={level === 'secondary'}
                                        onClick={() => setLevel('secondary')}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/40
                                            ${level === 'secondary'
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                                    >
                                        Secondary
                                    </button>
                                </div>
                            </div>

                            <InputField
                                label="Registrar Name"
                                icon={<User size={16} />}
                                placeholder="e.g. John Doe"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />

                            <InputField
                                label="Registrar Email"
                                icon={<MailIcon size={16} />}
                                type="email"
                                placeholder="e.g. john.doe@example.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                            />

                            <InputField
                                label="Registrar Contact"
                                icon={<Phone size={16} />}
                                type="tel"
                                placeholder="e.g. +256 700 000000"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                            />

                            <InputField
                                label="Physical Address"
                                icon={<MapPin size={16} />}
                                placeholder="e.g. Plot 5, Kampala Road"
                                value={physicalAddress}
                                onChange={(e) => setPhysicalAddress(e.target.value)}
                                error={errors.physicalAddress}
                            />

                            <InputField
                                label="District / Location"
                                icon={<MapPin size={16} />}
                                placeholder="e.g. Kampala"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                error={errors.district}
                            />

                            <InputField
                                label="Approximate Number of Students"
                                icon={<Users size={16} />}
                                type="number"
                                placeholder="e.g. 450"
                                value={numStudents}
                                onChange={(e) => setNumStudents(e.target.value)}
                                error={errors.numStudents}
                            />

                            <button onClick={nextStep} className="w-full flex justify-center items-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>

                    )}

                    {/* ── STEP 2: Contact ── */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">School Name</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        < Building2 className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="text" className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white text-sm"
                                        placeholder={level === 'primary' ? 'e.g. John Doe Primary School' : 'e.g. John Doe Secondary School'} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">School Address</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        < MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="text" className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white text-sm" placeholder="e.g. Kampala" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Students range</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        < PersonStanding className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="number" className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white text-sm" placeholder="e.g. 100-200" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">School website (optional)</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        < Globe className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="url" className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white text-sm" placeholder="e.g. https://www.john-doe.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Official License / MoES Document</label>
                                <p className="text-xs text-slate-500 mb-2">Upload your school's operating license issued by MoES.</p>
                                <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                                    <FileText size={32} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-sm font-medium text-slate-500 group-hover:text-blue-600">{licenseFile ? licenseFile.name : 'Click to upload or drag & drop'}</span>
                                    <span className="text-xs text-slate-400">PDF, PNG, JPG — max 10MB</span>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setLicenseFile(e.target.files[0])} />
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
                                <button onClick={nextStep} className="flex-[2] flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Portal / Subdomain ── */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Globe size={18} className="text-emerald-500" /> Your School's Portal URL
                            </h2>
                            <p className="text-sm text-slate-500">Choose a short, memorable name for your school's unique login link.</p>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
                                <div className="flex rounded-xl shadow-sm overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all">
                                    <input
                                        type="text"
                                        value={subdomain}
                                        onChange={(e) => checkSubdomain(e.target.value)}
                                        placeholder="myschool"
                                        className="flex-1 px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                                    />
                                    <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 text-sm font-medium whitespace-nowrap">.lvh.me:5173</span>
                                </div>
                                <div className="mt-2 h-5">
                                    {isChecking && <p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin inline-block" /> Checking…</p>}
                                    {isAvailable === true && !isChecking && <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium"><CheckCircle2 size={13} /> Available!</p>}
                                    {isAvailable === false && !isChecking && <p className="text-xs text-red-600 flex items-center gap-1 font-medium"><AlertCircle size={13} /> Already taken — try another name.</p>}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                                <p className="font-semibold mb-1">Your portal will be:</p>
                                <code className="text-blue-800 font-mono bg-blue-100 px-2 py-0.5 rounded">
                                    http://{subdomain || 'yourschool'}.lvh.me:5173
                                </code>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
                                <button
                                    onClick={() => {
                                        if (isAvailable) {
                                            setAdminUsername(suggestUsername(schoolName));
                                            setRecoveryEmail(contactEmail);
                                            setStep(4);
                                        }
                                    }}
                                    disabled={!isAvailable}
                                    className={`flex-[2] flex justify-center items-center gap-2 py-3 font-bold rounded-xl text-sm text-white transition-colors
                                        ${isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Credentials ── */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <KeyRound size={18} className="text-amber-500" /> Admin Credentials
                            </h2>
                            <p className="text-sm text-slate-500">Create the login for the school's admin account. Keep these credentials safe.</p>

                            <InputField
                                label="Admin Username"
                                icon={<User size={16} />}
                                placeholder="admin username"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                error={errors.adminUsername}
                            />

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={16} /></div>
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2
                                            ${errors.adminPassword ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-400'}`}
                                    />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {adminPassword && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((n) => (
                                                <div key={n} className={`flex-1 h-1.5 rounded-full transition-all ${n <= pwStrength ? pwColor : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                        <p className={`text-xs font-medium ${pwStrength >= 3 ? 'text-emerald-600' : pwStrength === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{pwLabel}</p>
                                    </div>
                                )}
                                {errors.adminPassword && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.adminPassword}</p>}
                            </div>

                            {/* Confirm */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={16} /></div>
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2
                                            ${errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-400'}`}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.confirmPassword}</p>}
                            </div>

                            <div>
                                <InputField
                                    label="Recovery Email"
                                    icon={<Mail size={16} />}
                                    hint="Used to reset your password if you lose access."
                                    type="email"
                                    placeholder="e.g. principal@school.ug"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    error={errors.recoveryEmail}
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex gap-3 items-start">
                                <ShieldCheck size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <p>Store your credentials in a safe place. The recovery email is the only way to regain access if you forget your password.</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
                                <button onClick={nextStep} className="flex-[2] flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
                                    Submit Registration <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 5: Success ── */}
                    {step === 5 && (
                        <div className="text-center space-y-4 py-6">
                            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900">Application Received!</h2>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                                Thank you, <span className="font-semibold text-slate-700">{contactName || 'there'}</span>! Our team will verify your documents and approve <span className="font-semibold text-slate-700">{schoolName}</span> within <strong>24 hours</strong>.
                            </p>

                            {/* Portal & credentials summary */}
                            <div className="bg-slate-50 rounded-xl p-5 text-left border border-slate-200 space-y-3 mt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your reserved portal</p>
                                <div className="flex items-center gap-2 text-blue-700 font-mono font-medium text-sm">
                                    <Globe size={14} />
                                    <span>http://{subdomain}.lvh.me:5173</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Admin Username</p>
                                    <p className="text-sm font-mono text-slate-700">{adminUsername}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recovery Email</p>
                                    <p className="text-sm text-slate-700">{recoveryEmail}</p>
                                </div>
                            </div>

                            {/* Subscription / Pricing summary */}
                            {numStudents && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left space-y-2">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Your Estimated Monthly Subscription</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Students registered</span>
                                        <span className="font-semibold">{Number(numStudents).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Rate per student / month</span>
                                        <span className="font-semibold">UGX 2,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t border-blue-200 pt-2 mt-1">
                                        <span className="text-slate-800">Estimated monthly bill</span>
                                        <span className="text-blue-700 text-base">UGX {(Number(numStudents) * 2000).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[11px] text-blue-500 mt-2">
                                        * Final pricing will be confirmed and billing details sent to <span className="font-medium">{contactEmail}</span> after approval.
                                    </p>
                                </div>
                            )}

                            <p className="text-xs text-slate-400 mt-2">
                                You will be contacted at <span className="text-slate-600 font-medium">{contactEmail}</span> once your school is approved.
                            </p>

                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 w-full py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm text-slate-500">Already have an account? <a href="/TenantLogin" className="text-primary-600 hover:text-primary-500 transition-colors">Login</a></p>
                </div>
            </div>

        </div>
    );
}
