'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FileText, UserCheck, PenTool, SkipForward } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/components/context/AuthContext';

const BUDDY_GIF = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7IPghd4VQP2S9oVhF75KXjdRvasrzcAyi1uwt';

const CHOICES = [
    { label: 'Questionnaire', sub: '30 interest questions', icon: FileText, accent: '#3b82f6', path: '/questionnaire' },
    { label: 'Counsellor', sub: 'Chat with an expert', icon: UserCheck, accent: '#6366f1', path: '/counsellor' },
    { label: 'Fill Data', sub: 'Enter RIASEC scores', icon: PenTool, accent: '#10b981', path: '/fill-data' },
];

export default function KnowYouBetterPage() {
    return <ProtectedRoute><KnowYouBetter /></ProtectedRoute>;
}

function KnowYouBetter() {
    const router = useRouter();
    const { setOnboardingStep } = useAuth();

    const handleChoice = (path: string) => {
        setOnboardingStep(3);
        router.push(path);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center w-full max-w-lg">

                {/* GIF */}
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="w-40 h-40 mb-7">
                    <video autoPlay loop muted playsInline className="w-full h-full object-contain">
                        <source src={BUDDY_GIF} />
                    </video>
                </motion.div>

                {/* Heading */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-center mb-9 space-y-1.5">
                    <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">One last thing</p>
                    <h1 className="text-[24px] font-bold text-slate-800 leading-snug">
                        First, let me get to know<br />you a little better.
                    </h1>
                    <p className="text-[13px] text-slate-400">Pick how you&apos;d like to continue.</p>
                </motion.div>

                {/* 3 buttons — horizontal row */}
                <div className="flex gap-3 w-full">
                    {CHOICES.map(({ label, sub, icon: Icon, accent, path }, i) => (
                        <motion.button key={label}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.28 + i * 0.09, type: 'spring', stiffness: 260, damping: 22 }}
                            whileHover={{ y: -6, scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChoice(path)}
                            className="flex-1 flex flex-col items-center gap-2.5 pt-6 pb-5 px-3 rounded-3xl outline-none group cursor-pointer"
                            style={{
                                background: 'rgba(255,255,255,0.93)',
                                border: `1.5px solid ${accent}30`,
                                boxShadow: `0 3px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
                                backdropFilter: 'blur(16px)',
                                transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
                            }}>
                            {/* Icon bubble */}
                            <div className="rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                style={{
                                    width: 52, height: 52,
                                    background: `linear-gradient(135deg, ${accent}1a, ${accent}08)`,
                                    border: `2px solid ${accent}35`,
                                }}>
                                <Icon style={{ color: accent, width: 24, height: 24 }} />
                            </div>
                            {/* Label */}
                            <p className="text-[13px] font-bold text-slate-700 leading-tight text-center">{label}</p>
                            {/* Sub */}
                            <p className="text-[10px] text-slate-400 leading-tight text-center px-1">{sub}</p>
                            {/* Accent pip — widens on hover */}
                            <div className="mt-0.5 h-[3px] w-6 rounded-full transition-all duration-300 group-hover:w-10"
                                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}50)` }} />
                        </motion.button>
                    ))}
                </div>

                {/* Skip */}
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                    onClick={() => { setOnboardingStep(3); router.push('/careers'); }}
                    className="mt-6 text-[12px] text-slate-400 hover:text-slate-600 transition-colors font-medium flex items-center gap-1.5">
                    <SkipForward className="w-3.5 h-3.5" /> Skip for now
                </motion.button>
            </motion.div>
        </div>
    );
}
