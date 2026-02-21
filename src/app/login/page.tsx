'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LOGO_URL = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7bVtR0AczHfCIdxXY6iah1sFOJokVv4nc2Tp9';

function Field({
    label, type, value, onChange, placeholder, icon: Icon,
}: {
    label: string; type: string; value: string;
    onChange: (v: string) => void; placeholder: string;
    icon: React.ElementType;
}) {
    const [show, setShow] = useState(false);
    const isPass = type === 'password';
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <input
                    type={isPass && show ? 'text' : type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-slate-200 text-[14px] text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
                {isPass && (
                    <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
        router.push('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden p-4"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="w-full max-w-sm z-10">
                <div className="rounded-3xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 24px 64px rgba(0,0,0,0.1)' }}>

                    <div className="px-8 pt-8 pb-7 space-y-6">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/15 ring-2 ring-white/60">
                                <img src={LOGO_URL} alt="CareerLand" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="text-center space-y-1">
                            <h1 className="text-[26px] font-bold text-slate-800">Welcome back</h1>
                            <p className="text-[13px] text-slate-400">Sign in to continue your career journey</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field label="Email" type="email" value={email} onChange={setEmail}
                                placeholder="you@example.com" icon={Mail} />
                            <Field label="Password" type="password" value={password} onChange={setPassword}
                                placeholder="Enter your password" icon={Lock} />

                            <button type="submit"
                                className="w-full h-12 rounded-2xl font-semibold text-white text-[14px] transition-all hover:scale-[1.01] active:scale-[0.98] mt-2"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 6px 24px rgba(99,102,241,0.35)' }}>
                                Sign In
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-[13px] text-slate-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
