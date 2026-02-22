'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { motion } from 'motion/react';
import { Loader2, Compass, Map, Star } from 'lucide-react';

const LOGO_URL = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7bVtR0AczHfCIdxXY6iah1sFOJokVv4nc2Tp9';

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.4-10.6 7.4-17.5z" fill="#4285F4" />
            <path d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.2 1.5-5 2.4-8.1 2.4-6.2 0-11.5-4.2-13.4-9.9H2.5v6.2C6.5 42.6 14.7 48 24 48z" fill="#34A853" />
            <path d="M10.6 28.7A14.3 14.3 0 0 1 10.6 19.3v-6.2H2.5a23.9 23.9 0 0 0 0 21.8l8.1-6.2z" fill="#FBBC05" />
            <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.7 0 6.5 5.4 2.5 13.1l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z" fill="#EA4335" />
        </svg>
    );
}

const features = [
    { icon: Compass, text: 'Discover careers matched to you' },
    { icon: Map, text: 'Get a personalised roadmap' },
    { icon: Star, text: 'Learn from real-world experts' },
];

export default function Signup() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <SignupContent />
        </Suspense>
    );
}

function SignupContent() {
    const [loading, setLoading] = useState(false);
    const params = useSearchParams();
    const error = params.get('error');
    const { login } = useAuth();
    const router = useRouter();
    const popupRef = useRef<Window | null>(null);

    // Listen for postMessage from the OAuth popup
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (e.origin !== window.location.origin) return;
            if (e.data?.type !== 'CAREERLAND_AUTH') return;

            const { token, email, name, isNew } = e.data;
            if (!token || !email) return;

            setLoading(false);
            const existingUser = localStorage.getItem('careerland_user');
            const existingParsed = existingUser ? JSON.parse(existingUser) : null;
            const isReturning = existingParsed?.email === email;

            login(email, token, name || undefined);

            if (isNew === '0' || isReturning) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []); // eslint-disable-line

    const handleGoogle = () => {
        setLoading(true);
        const width = 500, height = 640;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
            '/api/auth/google',
            'googleAuth',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
        popupRef.current = popup;

        if (!popup) {
            window.location.href = '/api/auth/google';
            return;
        }

        const pollClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(pollClosed);
                setLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{ background: '#ffffff' }}>

            {/* 4-corner blur blobs */}
            <div className="absolute top-[-8%] left-[-8%] w-[380px] h-[380px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(90px)' }} />
            <div className="absolute top-[-8%] right-[-8%] w-[380px] h-[380px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34,168,224,0.05) 0%, transparent 70%)', filter: 'blur(90px)' }} />
            <div className="absolute bottom-[-8%] left-[-8%] w-[380px] h-[380px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', filter: 'blur(90px)' }} />
            <div className="absolute bottom-[-8%] right-[-8%] w-[380px] h-[380px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(56,195,245,0.04) 0%, transparent 70%)', filter: 'blur(90px)' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="z-10 w-full max-w-sm flex flex-col items-center">

                {/* Logo — floats above card */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
                    className="relative z-10 mb-[-36px]">
                    <div className="w-[88px] h-[88px] rounded-[26px] overflow-hidden"
                        style={{
                            border: '2px solid #f1f5f9',
                            boxShadow: '0 8px 32px rgba(34,168,224,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                        }}>
                        <img src={LOGO_URL} alt="CareerLand" className="w-full h-full object-cover" />
                    </div>
                </motion.div>

                {/* Card */}
                <div className="w-full rounded-3xl pt-14 px-8 pb-8 flex flex-col gap-5"
                    style={{
                        border: '1.5px solid #e8edf3',
                        background: '#ffffff',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}>

                    <div className="space-y-1 text-center">
                        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Create your account</h1>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Your career journey starts here</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#c2410c', fontWeight: 500 }}>
                            {error === 'backend_offline'
                                ? '⚠️ Backend server is offline. Start career-land-api first.'
                                : error === 'auth_failed'
                                    ? '⚠️ Google sign-in failed. Please try again.'
                                    : `⚠️ Error: ${error}`}
                        </div>
                    )}

                    {/* Feature bullets */}
                    <div className="space-y-2.5">
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: '#f0f9ff', border: '1px solid #e0f2fe' }}>
                                    <Icon style={{ width: 13, height: 13, color: '#22a8e0' }} />
                                </div>
                                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{text}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ height: 1, background: '#f1f5f9' }} />

                    <motion.button
                        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }}
                        onClick={handleGoogle} disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-[14px] text-slate-700 transition-all disabled:opacity-60"
                        style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                        {loading
                            ? <><Loader2 className="w-4 h-4 animate-spin text-slate-400" /> Creating account…</>
                            : <><GoogleIcon /> Sign up with Google</>}
                    </motion.button>

                    <p style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
                        By continuing you agree to our Terms & Privacy Policy
                    </p>
                </div>

                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 20 }}>
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#22a8e0] font-semibold hover:underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}
