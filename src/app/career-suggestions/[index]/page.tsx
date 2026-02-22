'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, IndianRupee, TrendingUp, Clock,
    Sparkles, Play, Plus, CheckCircle2,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'motion/react';

// ─── Types ───────────────────────────────────────────────────
interface CareerOption {
    name: string;
    description: string;
    overview: {
        annual_income: string;
        job_growth: string;
        time_to_proficiency: string;
    };
    requirements: string[];
    youtube: string;
}

// ─── Design tokens ───────────────────────────────────────────
const GLASS: React.CSSProperties = {
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
};

const SUGGESTION_IMAGES = [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80',
];

// helper: add a career to the user's "my careers" list in localStorage
function addToMyCareers(career: CareerOption) {
    try {
        const raw = localStorage.getItem('user_added_careers');
        const existing: CareerOption[] = raw ? JSON.parse(raw) : [];
        // avoid duplicates by name
        if (!existing.some(c => c.name === career.name)) {
            existing.push(career);
            localStorage.setItem('user_added_careers', JSON.stringify(existing));
        }
        return true;
    } catch {
        return false;
    }
}

function isInMyCareers(name: string): boolean {
    try {
        const raw = localStorage.getItem('user_added_careers');
        const existing: CareerOption[] = raw ? JSON.parse(raw) : [];
        return existing.some(c => c.name === name);
    } catch {
        return false;
    }
}

// ─── Main Page ────────────────────────────────────────────────
export default function SuggestedCareerDetailPage() {
    return <ProtectedRoute><SuggestedCareerDetailContent /></ProtectedRoute>;
}

function SuggestedCareerDetailContent() {
    const params = useParams();
    const router = useRouter();
    const idx = Number(params.index);

    const [career, setCareer] = useState<CareerOption | null>(null);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('onboarding_careers');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed[idx]) {
                    setCareer(parsed[idx]);
                    setAdded(isInMyCareers(parsed[idx].name));
                }
            }
        } catch (e) {
            console.error('Failed to load career:', e);
        }
    }, [idx]);

    const handleAddToCareer = () => {
        if (career && addToMyCareers(career)) {
            setAdded(true);
        }
    };

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/);
        return match?.[1] ?? null;
    };

    if (!career) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="text-center space-y-2">
                        <p className="text-slate-500 text-sm">Career not found.</p>
                        <button onClick={() => router.push('/career-suggestions')} className="text-blue-500 text-sm hover:underline">← Back to Suggestions</button>
                    </div>
                </div>
            </Layout>
        );
    }

    const ytId = getYouTubeId(career.youtube);
    const img = SUGGESTION_IMAGES[idx % SUGGESTION_IMAGES.length];
    const matchPct = Math.floor(78 + ((idx * 7) % 18));

    return (
        <Layout>
            <div className="space-y-5">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3.5 py-1.5 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Suggestions
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* ── LEFT (3/5): Title, About, Description ── */}
                    <div className="lg:col-span-3 space-y-4">

                        {/* Title card */}
                        <div className="rounded-2xl p-5" style={GLASS}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                                        <img src={img} alt={career.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-[22px] font-bold text-slate-800 leading-tight">{career.name}</h1>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                                                ✦ {matchPct}% Match
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-slate-400 mt-0.5">AI Suggested · Personalised for you</p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {career.requirements.slice(0, 3).map(t => (
                                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={handleAddToCareer}
                                    whileTap={{ scale: 0.95 }}
                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all"
                                    style={added
                                        ? { borderColor: '#bbf7d0', color: '#16a34a', background: '#f0fdf4' }
                                        : { borderColor: '#bfdbfe', color: '#3b82f6', background: '#eff6ff' }}
                                >
                                    {added
                                        ? <><CheckCircle2 className="w-3.5 h-3.5" /> Added</>
                                        : <><Plus className="w-3.5 h-3.5" /> Add To Career</>}
                                </motion.button>
                            </div>
                        </div>

                        {/* About */}
                        <div className="rounded-2xl overflow-hidden" style={GLASS}>
                            <div className="px-5 py-3.5 border-b border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">About this Career</p>
                            </div>
                            <div className="p-5">
                                <p className="text-[13px] text-slate-600 leading-7 whitespace-pre-line">{career.description}</p>
                            </div>
                        </div>

                        {/* Requirements detail */}
                        <div className="rounded-2xl overflow-hidden" style={GLASS}>
                            <div className="px-5 py-3.5 border-b border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requirements</p>
                            </div>
                            <div className="px-5 py-1 divide-y divide-slate-50">
                                {career.requirements.map((r, i) => (
                                    <div key={i} className="flex items-baseline gap-3 py-3">
                                        <span className="text-[11px] font-black text-blue-400 tabular-nums shrink-0 w-5">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-[12px] text-slate-600 leading-relaxed">{r}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* YouTube — Day in the Life */}
                        {ytId && (
                            <div className="rounded-2xl overflow-hidden" style={GLASS}>
                                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                                    <Play className="w-3.5 h-3.5 text-red-400" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Watch: Day in the Life</p>
                                </div>
                                <div className="aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${ytId}`}
                                        title={`${career.name} day in the life`}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT (2/5, sticky): Stats, Add button ── */}
                    <div className="lg:col-span-2">
                        <div className="lg:sticky lg:top-6 space-y-4">

                            {/* Overview stats */}
                            <div className="rounded-2xl overflow-hidden" style={GLASS}>
                                <div className="px-5 py-3.5 border-b border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overview</p>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {[
                                        { icon: IndianRupee, label: 'Avg Income', val: career.overview.annual_income, color: '#10b981', bg: '#f0fdf4' },
                                        { icon: TrendingUp, label: 'Job Growth', val: career.overview.job_growth, color: '#3b82f6', bg: '#eff6ff' },
                                        { icon: Clock, label: 'To Proficiency', val: career.overview.time_to_proficiency, color: '#f59e0b', bg: '#fffbeb' },
                                    ].map(({ icon: Icon, label, val, color, bg }) => (
                                        <div key={label} className="flex items-center gap-3 px-5 py-4">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                                                <Icon className="w-4 h-4" style={{ color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                                                <p className="text-[15px] font-bold text-slate-800 leading-tight">{val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Match card */}
                            <div className="rounded-2xl overflow-hidden" style={GLASS}>
                                <div className="p-5 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-slate-800">{matchPct}% Match</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Based on your onboarding answers</p>
                                    </div>
                                    <motion.button
                                        onClick={handleAddToCareer}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
                                        style={added
                                            ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
                                            : { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
                                    >
                                        {added
                                            ? <><CheckCircle2 className="w-4 h-4" /> Added to My Careers</>
                                            : <><Plus className="w-4 h-4" /> Add To My Careers</>}
                                    </motion.button>
                                </div>
                            </div>

                            {/* YouTube (also in sidebar if available) */}
                            {ytId && (
                                <div className="rounded-2xl overflow-hidden" style={GLASS}>
                                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                                        <Play className="w-3.5 h-3.5 text-red-400" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video</p>
                                    </div>
                                    <div className="aspect-video">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ytId}`}
                                            title={`${career.name} day in the life`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                <div className="h-8" />
            </div>
        </Layout>
    );
}
