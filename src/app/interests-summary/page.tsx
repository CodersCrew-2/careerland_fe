'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, LayoutDashboard, RefreshCw } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

const RIASEC_META: Record<string, { label: string; meaning: string; careers: string[]; color: string; bg: string }> = {
    R: { label: 'Realistic', meaning: 'Hands-on, practical, tools & machines', careers: ['Mechanic', 'Civil Engineer', 'Electrician'], color: '#f59e0b', bg: '#fffbeb' },
    I: { label: 'Investigative', meaning: 'Analytical, research & problem-solving', careers: ['Researcher', 'Data Scientist', 'Doctor'], color: '#3b82f6', bg: '#eff6ff' },
    A: { label: 'Artistic', meaning: 'Creative, expressive, design & arts', careers: ['UX Designer', 'Writer', 'Filmmaker'], color: '#a855f7', bg: '#faf5ff' },
    S: { label: 'Social', meaning: 'Helping, teaching & supporting others', careers: ['Teacher', 'Counsellor', 'HR Manager'], color: '#10b981', bg: '#f0fdf4' },
    E: { label: 'Enterprising', meaning: 'Leadership, persuasion & business', careers: ['Entrepreneur', 'Product Manager', 'Sales Lead'], color: '#ef4444', bg: '#fef2f2' },
    C: { label: 'Conventional', meaning: 'Organising, data, systems & structure', careers: ['Accountant', 'Data Analyst', 'Administrator'], color: '#64748b', bg: '#f8fafc' },
};

const MAX_SCORE = 25;

export default function InterestsSummaryPage() {
    return <ProtectedRoute><ResultsContent /></ProtectedRoute>;
}

function ResultsContent() {
    const router = useRouter();
    const [scores, setScores] = useState<Record<string, number> | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem('riasec_scores');
        if (raw) setScores(JSON.parse(raw));
    }, []);

    if (!scores) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[40vh]">
                    <p className="text-slate-400 text-sm">Loading your results…</p>
                </div>
            </Layout>
        );
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);

    return (
        <Layout>
            <div className="max-w-3xl mx-auto pb-12 space-y-6">

                {/* ── Hero header ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl overflow-hidden relative"
                    style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 8px 40px rgba(37,99,235,0.3)',
                    }}>
                    {/* Decorative circle blobs */}
                    <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="absolute bottom-[-30px] left-[20%] w-32 h-32 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)' }} />

                    <div className="relative z-10 px-6 py-8 text-white">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Assessment Complete</p>
                        <h1 className="text-2xl lg:text-3xl font-bold leading-tight">Your Holland Code</h1>

                        {/* Top 3 letters */}
                        <div className="flex items-center gap-3 mt-4">
                            {top3.map(([type], i) => {
                                const meta = RIASEC_META[type];
                                return (
                                    <motion.div key={type}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
                                        className="flex flex-col items-center gap-1">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[22px] font-black"
                                            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}>
                                            {type}
                                        </div>
                                        <span className="text-[10px] font-semibold text-white/70">{meta.label}</span>
                                    </motion.div>
                                );
                            })}
                            <div className="ml-2 flex-1">
                                <p className="text-[13px] text-white/80 leading-snug">
                                    Your strongest interest areas are{' '}
                                    <span className="font-bold text-white">{top3.map(([k]) => RIASEC_META[k].label).join(', ')}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Score bars ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(255,255,255,0.9)' }}>
                    <div className="px-5 py-3.5 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Breakdown</p>
                    </div>
                    <div className="p-5 space-y-4">
                        {sorted.map(([type, score], i) => {
                            const meta = RIASEC_META[type];
                            const pct = Math.round((score / MAX_SCORE) * 100);
                            return (
                                <motion.div key={type}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 + i * 0.07 }}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-black w-5 text-center" style={{ color: meta.color }}>{type}</span>
                                            <span className="text-[12px] font-semibold text-slate-700">{meta.label}</span>
                                            {i < 3 && (
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                                    style={{ background: meta.bg, color: meta.color }}>
                                                    {i === 0 ? '🥇 Top' : i === 1 ? '🥈 2nd' : '🥉 3rd'}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[12px] font-bold text-slate-600">{score}<span className="text-slate-300 font-normal">/{MAX_SCORE}</span></span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                        <motion.div className="h-full rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ delay: 0.4 + i * 0.07, duration: 0.55, ease: 'easeOut' }}
                                            style={{ background: `linear-gradient(90deg, ${meta.color}aa, ${meta.color})` }} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ── Top 3 type cards ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Top Personality Types</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {top3.map(([type, score], i) => {
                            const meta = RIASEC_META[type];
                            return (
                                <motion.div key={type}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 + i * 0.08 }}
                                    className="rounded-2xl p-4 space-y-3"
                                    style={{ background: meta.bg, border: `1.5px solid ${meta.color}25` }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[22px] font-black" style={{ color: meta.color }}>{type}</span>
                                        {i === 0 && (
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                                style={{ background: meta.color, color: '#fff' }}>TOP</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-700">{meta.label}</p>
                                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{meta.meaning}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Careers</p>
                                        <div className="flex flex-wrap gap-1">
                                            {meta.careers.map(c => (
                                                <span key={c} className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                                                    style={{ background: `${meta.color}18`, color: meta.color }}>{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ── CTA buttons ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                    className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => router.push('/careers')}
                        className="flex-1 py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                        style={{ background: '#2563eb', color: '#fff', boxShadow: '0 6px 24px rgba(37,99,235,0.35)' }}>
                        <ArrowRight className="w-4 h-4" />
                        Explore Careers for You
                    </button>
                    <button onClick={() => router.push('/dashboard')}
                        className="flex-1 py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all border border-slate-200 hover:bg-slate-50"
                        style={{ background: '#fff', color: '#475569' }}>
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                    </button>
                </motion.div>

                {/* Retake */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                    className="text-center">
                    <button onClick={() => router.push('/questionnaire')}
                        className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-500 transition-colors font-medium">
                        <RefreshCw className="w-3.5 h-3.5" /> Retake questionnaire
                    </button>
                </motion.div>
            </div>
        </Layout>
    );
}
