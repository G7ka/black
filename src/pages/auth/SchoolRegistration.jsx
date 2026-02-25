import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, FileText, Globe, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SchoolRegistration() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [subdomain, setSubdomain] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);

    const checkSubdomain = (val) => {
        setSubdomain(val);
        if (val.length < 3) {
            setIsAvailable(null);
            return;
        }
        setIsChecking(true);
        // Simulate API check
        setTimeout(() => {
            // Let's pretend 'kampala' and 'admin' are taken
            const taken = ['kampala', 'admin', 'test'];
            setIsAvailable(!taken.includes(val.toLowerCase()));
            setIsChecking(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    <span className="text-sm font-medium">Back to Home</span>
                </button>

                <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Building2 size={24} className="text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Register Your School
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Join Uganda's fastest-growing school network
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">School Level</label>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-500 bg-primary-50 rounded-xl text-primary-700 font-semibold transition-all">
                                        Primary
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 font-semibold transition-all">
                                        Secondary
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">School Name</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="text" className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white text-sm" placeholder="e.g. Sunrise High School" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Location / District</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input type="text" className="block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-slate-50 focus:bg-white text-sm" placeholder="e.g. Kampala" />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Choose your subdomain</label>
                                <p className="text-xs text-slate-500 mt-1 mb-3">This will be your school's unique login portal link.</p>

                                <div className="mt-1 flex rounded-xl shadow-sm">
                                    <input
                                        type="text"
                                        value={subdomain}
                                        onChange={(e) => checkSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                                        className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-l-xl sm:text-sm border-r-0 transition-colors bg-slate-50 focus:bg-white
                                            ${isAvailable === true ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500' :
                                                isAvailable === false ? 'border-red-300 focus:border-red-500 focus:ring-red-500' :
                                                    'border-slate-200 focus:ring-primary-500 focus:border-primary-500'}`}
                                        placeholder="myschool"
                                    />
                                    <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 text-slate-500 sm:text-sm font-medium">
                                        .edumanage.com
                                    </span>
                                </div>

                                <div className="mt-2 h-5">
                                    {isChecking && <p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-primary-600 animate-spin"></span> Checking availability...</p>}
                                    {isAvailable === true && !isChecking && <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium"><CheckCircle2 size={14} /> Available!</p>}
                                    {isAvailable === false && !isChecking && <p className="text-xs text-red-600 flex items-center gap-1 font-medium"><AlertCircle size={14} /> This subdomain is already taken.</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Official License Document</label>
                                <p className="text-xs text-slate-500 mt-1 mb-2">Upload MoES registration or operating license.</p>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary-400 hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="space-y-1 text-center">
                                        <FileText className="mx-auto h-10 w-10 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <span className="relative rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                <span>Upload a file</span>
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!isAvailable}
                                    className={`flex-[2] flex justify-center items-center py-3 px-4 border border-transparent rounded-xl flex-1 shadow-sm text-sm font-bold text-white transition-colors
                                        ${isAvailable ? 'bg-primary-600 hover:bg-primary-700' : 'bg-slate-300 cursor-not-allowed'}`}
                                >
                                    Submit Registration
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 py-6">
                            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Application Received!</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                                Thank you for registering. Our team will verify your license document and approve your account within 24 hours.
                            </p>
                            <div className="bg-slate-50 rounded-xl p-4 mt-6 text-left border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your reserved portal</p>
                                <div className="flex items-center gap-2 text-primary-700 font-medium">
                                    <Globe size={16} />
                                    <span>{subdomain}.edumanage.com</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-8 w-full flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
