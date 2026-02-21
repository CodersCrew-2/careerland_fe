'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/context/AuthContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Plus, X, MapPin, Briefcase, Mail, ChevronRight, RefreshCw, Lock } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'motion/react';
import Link from 'next/link';

const RIASEC_META = [
    { code: 'R', type: 'Realistic', meaning: 'Practical, hands-on, tools, machines', color: '#f59e0b' },
    { code: 'I', type: 'Investigative', meaning: 'Analytical, research, problem-solving', color: '#3b82f6' },
    { code: 'A', type: 'Artistic', meaning: 'Creative, expressive, design', color: '#a855f7' },
    { code: 'S', type: 'Social', meaning: 'Helping, teaching, supporting', color: '#10b981' },
    { code: 'E', type: 'Enterprising', meaning: 'Leadership, persuasion, business', color: '#ef4444' },
    { code: 'C', type: 'Conventional', meaning: 'Organizing, data, structure', color: '#64748b' },
];

const GLASS: React.CSSProperties = {
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
};

export default function ProfilePage() {
    return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}

function ProfileContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [skills, setSkills] = useState(['JavaScript', 'React', 'Problem Solving']);
    const [newSkill, setNewSkill] = useState('');
    const [riasecScores, setRiasecScores] = useState<Record<string, number> | null>(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem('riasec_completed') === 'true';
        const raw = localStorage.getItem('riasec_scores');
        setCompleted(done);
        if (raw && done) setRiasecScores(JSON.parse(raw));
    }, []);

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) { setSkills([...skills, newSkill]); setNewSkill(''); }
    };
    const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

    // Radar data
    const radarData = RIASEC_META.map(({ type, code }) => ({
        subject: type,
        score: riasecScores?.[code] ?? 0,
        fullMark: 25,
    }));

    const sorted = riasecScores
        ? Object.entries(riasecScores).sort((a, b) => b[1] - a[1])
        : null;

    return (
        <Layout>
            <div className="space-y-6 pb-12 max-w-5xl mx-auto">

                {/* Notification banner — only when not completed */}
                {!completed && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-5 flex items-center justify-between gap-4"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
                        <div>
                            <h3 className="font-bold text-white text-[15px]">We want to know more about you!</h3>
                            <p className="text-white/70 text-[12px] mt-0.5">Complete interests assessment to unlock personalised career paths.</p>
                        </div>
                        <button onClick={() => router.push('/know-you-better')}
                            className="shrink-0 flex items-center gap-1.5 bg-white text-blue-600 font-bold text-[12px] px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all whitespace-nowrap">
                            Complete Profile <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── LEFT column: Profile card + Skills ── */}
                    <div className="space-y-5">
                        {/* Profile card */}
                        <div className="rounded-2xl overflow-hidden" style={GLASS}>
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg mb-4">
                                    <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <h1 className="text-[18px] font-bold text-slate-800">{user?.name || 'Your Name'}</h1>
                                <p className="text-[12px] text-slate-400 flex items-center gap-1.5 mt-1">
                                    <Briefcase className="w-3 h-3" /> Student / Explorer
                                </p>
                                <div className="w-full mt-5 space-y-2 text-left">
                                    <div className="flex items-center gap-2.5 text-[12px] text-slate-500 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span className="truncate">{user?.email || 'user@email.com'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[12px] text-slate-500 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>India</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="rounded-2xl overflow-hidden" style={GLASS}>
                            <div className="px-5 py-3.5 border-b border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skills</p>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-semibold flex items-center gap-1.5 border border-blue-100">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Add a skill…"
                                        value={newSkill}
                                        onChange={e => setNewSkill(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addSkill()}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[12px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                    />
                                    <button onClick={addSkill}
                                        className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shrink-0">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT column: RIASEC ── */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl overflow-hidden relative" style={GLASS}>
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Holland Code (RIASEC)</p>
                                    <p className="text-[12px] text-slate-500 mt-0.5">
                                        {completed ? 'Your personality type breakdown' : 'Complete the assessment to unlock'}
                                    </p>
                                </div>
                                {completed && (
                                    <button onClick={() => router.push('/know-you-better')}
                                        className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-all">
                                        <RefreshCw className="w-3 h-3" /> Retest
                                    </button>
                                )}
                            </div>

                            {/* Blurred overlay when not completed */}
                            {!completed && (
                                <div className="absolute inset-0 top-[57px] z-10 flex flex-col items-center justify-center gap-4 rounded-b-2xl"
                                    style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-slate-700 text-[14px]">Take the Interest Assessment</p>
                                        <p className="text-slate-400 text-[12px] mt-1">Unlock your personality type analysis</p>
                                    </div>
                                    <button onClick={() => router.push('/know-you-better')}
                                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors flex items-center gap-2">
                                        Start Assessment <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <div className="p-5 space-y-6">
                                {/* Radar chart */}
                                <div className="w-full h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                            <PolarGrid stroke="#e2e8f0" strokeOpacity={0.8} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 25]} tick={false} axisLine={false} />
                                            <Radar name="You" dataKey="score"
                                                stroke="#3b82f6" strokeWidth={2.5}
                                                fill="#3b82f6" fillOpacity={0.25} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Score table */}
                                <div className="overflow-hidden rounded-xl border border-slate-100">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="bg-slate-50">
                                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Meaning</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {RIASEC_META.map(({ code, type, meaning, color }) => {
                                                const score = riasecScores?.[code];
                                                const pct = score !== undefined ? Math.round((score / 25) * 100) : 0;
                                                return (
                                                    <tr key={code} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-3 font-black text-[14px]" style={{ color }}>{code}</td>
                                                        <td className="px-4 py-3 font-semibold text-[12px] text-slate-700">{type}</td>
                                                        <td className="px-4 py-3">
                                                            {score !== undefined ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden w-16">
                                                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                                                                    </div>
                                                                    <span className="text-[12px] font-bold text-slate-600">{score}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[12px] text-slate-300">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-[11px] text-slate-400 hidden sm:table-cell">{meaning}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Top Holland Code + Explore CTA (when completed) */}
                                {completed && sorted && (
                                    <div className="flex items-center justify-between p-4 rounded-xl"
                                        style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1px solid #dbeafe' }}>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Holland Code</p>
                                            <div className="flex gap-1.5">
                                                {sorted.slice(0, 3).map(([k]) => (
                                                    <span key={k} className="text-[15px] font-black px-2 py-0.5 rounded-lg"
                                                        style={{ color: RIASEC_META.find(m => m.code === k)?.color, background: `${RIASEC_META.find(m => m.code === k)?.color}18` }}>{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <Link href="/careers"
                                            className="flex items-center gap-1.5 text-[12px] font-bold text-blue-600 bg-blue-600 px-4 py-2 rounded-xl text-white hover:bg-blue-700 transition-colors">
                                            Explore Careers <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
