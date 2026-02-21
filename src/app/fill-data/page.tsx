'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import ProtectedRoute from '@/components/ProtectedRoute';

const RIASEC_META = [
    { key: 'R', label: 'Realistic', desc: 'Practical, hands-on, tools & machines', color: '#f59e0b' },
    { key: 'I', label: 'Investigative', desc: 'Analytical, research, problem-solving', color: '#3b82f6' },
    { key: 'A', label: 'Artistic', desc: 'Creative, expressive, design & arts', color: '#a855f7' },
    { key: 'S', label: 'Social', desc: 'Helping, teaching, supporting others', color: '#10b981' },
    { key: 'E', label: 'Enterprising', desc: 'Leadership, persuasion, business', color: '#ef4444' },
    { key: 'C', label: 'Conventional', desc: 'Organising, data, systems & structure', color: '#64748b' },
];

const INPUT = 'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all';
const LABEL = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1';

export default function FillDataPage() {
    return <ProtectedRoute><FillDataContent /></ProtectedRoute>;
}

function FillDataContent() {
    const router = useRouter();
    const [scores, setScores] = useState<Record<string, string>>({ R: '', I: '', A: '', S: '', E: '', C: '' });

    const handleChange = (key: string, val: string) => {
        const n = parseInt(val);
        if (val === '' || (!isNaN(n) && n >= 0 && n <= 25)) {
            setScores(prev => ({ ...prev, [key]: val }));
        }
    };

    const handleSave = () => {
        const numeric: Record<string, number> = {};
        RIASEC_META.forEach(({ key }) => {
            numeric[key] = parseInt(scores[key]) || 0;
        });
        localStorage.setItem('riasec_scores', JSON.stringify(numeric));
        localStorage.setItem('riasec_completed', 'true');
        router.push('/interests-summary');
    };

    const allFilled = RIASEC_META.every(({ key }) => scores[key] !== '');

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Soft blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="w-full max-w-md rounded-3xl overflow-hidden relative z-10"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 24px 64px rgba(0,0,0,0.1)' }}>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <button onClick={() => router.push('/know-you-better')}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:text-blue-700 mb-4 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">Enter RIASEC Scores</h1>
                    <p className="text-[12px] text-slate-400 mt-0.5">Enter your Holland Code scores (0 – 25 per type). If you have scores from an external test, enter them below.</p>
                </div>

                {/* Score grid */}
                <div className="p-6 space-y-3">
                    {RIASEC_META.map(({ key, label, desc, color }, i) => (
                        <motion.div key={key}
                            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                            <div className="shrink-0 text-center">
                                <span className="text-[18px] font-black block" style={{ color }}>{key}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-slate-700">{label}</p>
                                <p className="text-[10px] text-slate-400 leading-snug">{desc}</p>
                            </div>
                            <div className="shrink-0 w-20">
                                <input
                                    type="number"
                                    min={0} max={25}
                                    value={scores[key]}
                                    onChange={e => handleChange(key, e.target.value)}
                                    className="w-full text-center bg-white border-2 rounded-xl px-2 py-2 text-[15px] font-bold outline-none transition-all"
                                    style={{
                                        borderColor: scores[key] !== '' ? color : '#e2e8f0',
                                        color: scores[key] !== '' ? color : '#94a3b8',
                                    }}
                                    placeholder="0"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Visual preview bar */}
                {RIASEC_META.some(({ key }) => scores[key] !== '') && (
                    <div className="px-6 pb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Score Preview</p>
                        <div className="space-y-1.5">
                            {RIASEC_META.map(({ key, label, color }) => {
                                const val = parseInt(scores[key]) || 0;
                                const pct = (val / 25) * 100;
                                return (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="text-[10px] font-black w-4" style={{ color }}>{key}</span>
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-300"
                                                style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-400 w-5 text-right">{val}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleSave}
                        disabled={!allFilled}
                        className="w-full py-3.5 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
                        style={{
                            background: allFilled ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#f1f5f9',
                            color: allFilled ? '#fff' : '#94a3b8',
                            boxShadow: allFilled ? '0 8px 24px rgba(99,102,241,0.3)' : 'none',
                            cursor: allFilled ? 'pointer' : 'not-allowed',
                        }}>
                        <ArrowRight className="w-4 h-4" />
                        Save & See Results
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
