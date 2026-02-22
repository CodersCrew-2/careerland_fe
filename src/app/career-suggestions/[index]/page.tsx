'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, IndianRupee, TrendingUp, Clock,
    Sparkles, Play, Plus, CheckCircle2, Map,
    Loader2, AlertCircle, X, Maximize2, Minimize2,
    ExternalLink, BookOpen, Lock, Search,
    Zap, Brain, Palette, Target, Trophy, FlaskConical, Briefcase,
    Eye as EyeIcon,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import RoadmapGraph from '@/components/roadmap/RoadmapGraph';
import type { RoadmapGraph as RoadmapGraphType, RoadmapNode, ApiResponse } from '@/components/roadmap/types';

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
const INPUT = 'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all';
const LABEL = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1';

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

const DOMAIN_OPTIONS = ['tech', 'business', 'creative', 'academics', 'sports', 'research'];

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    technical: { icon: Zap, color: '#3b82f6', bg: '#eff6ff' },
    physical: { icon: Trophy, color: '#10b981', bg: '#f0fdf4' },
    creative: { icon: Palette, color: '#8b5cf6', bg: '#f5f3ff' },
    strategic: { icon: Target, color: '#f59e0b', bg: '#fffbeb' },
    competition: { icon: Trophy, color: '#ef4444', bg: '#fef2f2' },
    research: { icon: FlaskConical, color: '#06b6d4', bg: '#ecfeff' },
    portfolio: { icon: Briefcase, color: '#6366f1', bg: '#eef2ff' },
    exposure: { icon: EyeIcon, color: '#d946ef', bg: '#fdf4ff' },
    mental: { icon: Brain, color: '#14b8a6', bg: '#f0fdfa' },
    business: { icon: Briefcase, color: '#f97316', bg: '#fff7ed' },
};

const DIFF_META: Record<string, { label: string; color: string; bg: string }> = {
    beginner: { label: 'Beginner', color: '#10b981', bg: '#d1fae5' },
    intermediate: { label: 'Intermediate', color: '#f59e0b', bg: '#fef3c7' },
    advanced: { label: 'Advanced', color: '#ef4444', bg: '#fee2e2' },
};

const TYPE_COLORS: Record<string, string> = {
    article: '#60a5fa', video: '#f87171', course: '#a78bfa',
    documentation: '#38bdf8', book: '#fbbf24', tool: '#4ade80',
    podcast: '#fb923c', community: '#e879f9',
};

// ─── Helpers ────────────────────────────────────────────────
function addToMyCareers(career: CareerOption) {
    try {
        const raw = localStorage.getItem('user_added_careers');
        const existing: CareerOption[] = raw ? JSON.parse(raw) : [];
        if (!existing.some(c => c.name === career.name)) {
            existing.push(career);
            localStorage.setItem('user_added_careers', JSON.stringify(existing));
        }
        return true;
    } catch { return false; }
}

function isInMyCareers(name: string): boolean {
    try {
        const raw = localStorage.getItem('user_added_careers');
        const existing: CareerOption[] = raw ? JSON.parse(raw) : [];
        return existing.some(c => c.name === name);
    } catch { return false; }
}

// ─── Roadmap Profile ────────────────────────────────────────
interface RoadmapProfile {
    domain: string; goal: string; current_level: string;
    skills: string[];
    experience_years: number; timeline_months: number; daily_hours: number;
    age: number; constraints: string; resources_access: string;
}

// ─── Skills Pill Input ────────────────────────────────────────
function SkillsPillInput({ skills, onChange, suggestedSkills }: {
    skills: string[]; onChange: (s: string[]) => void; suggestedSkills: string[];
}) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = query.trim()
        ? suggestedSkills.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !skills.includes(s))
        : suggestedSkills.filter(s => !skills.includes(s)).slice(0, 8);

    const addSkill = (skill: string) => {
        const s = skill.trim();
        if (s && !skills.includes(s)) onChange([...skills, s]);
        setQuery('');
        inputRef.current?.focus();
    };

    const removeSkill = (s: string) => onChange(skills.filter(x => x !== s));

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && query.trim()) {
            e.preventDefault();
            addSkill(query.trim().replace(/,$/, ''));
        } else if (e.key === 'Backspace' && !query && skills.length > 0) {
            removeSkill(skills[skills.length - 1]);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-1.5 min-h-[44px] p-2 bg-white border border-slate-200 rounded-xl cursor-text"
                onClick={() => inputRef.current?.focus()}>
                {skills.map(s => (
                    <span key={s} className="flex items-center gap-1 text-[12px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-medium select-none">
                        {s}
                        <button type="button" onClick={e => { e.stopPropagation(); removeSkill(s); }} className="text-blue-400 hover:text-red-500 transition-colors ml-0.5">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                    <Search className="w-3 h-3 text-slate-300 shrink-0" />
                    <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
                        placeholder={skills.length === 0 ? 'e.g. Python, Figma…' : 'Add more…'}
                        className="flex-1 outline-none text-[12px] text-slate-700 placeholder-slate-300 bg-transparent" />
                    {query.trim() && (
                        <button type="button" onClick={() => addSkill(query)} className="shrink-0 w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                            <Plus className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
            {filtered.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {filtered.map(s => (
                        <button key={s} type="button" onClick={() => addSkill(s)}
                            className="text-[11px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all font-medium">
                            + {s}
                        </button>
                    ))}
                </div>
            )}
            <p className="text-[10px] text-slate-300 mt-1.5">Press Enter or &apos;,&apos; to add a custom skill</p>
        </div>
    );
}

// ─── Node Detail Panel ──────────────────────────────────────
function NodeDetail({ node, onClose }: { node: RoadmapNode; onClose: () => void }) {
    const meta = CATEGORY_META[node.category] ?? CATEGORY_META.technical;
    const diff = DIFF_META[node.difficulty] ?? DIFF_META.beginner;
    const CatIcon = meta.icon;

    return (
        <motion.div key={node.id}
            initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: 280, zIndex: 20,
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
                borderLeft: `2px solid ${meta.color}30`, boxShadow: `-6px 0 32px rgba(0,0,0,0.08)`,
                display: 'flex', flexDirection: 'column', overflowY: 'auto',
            }}
        >
            <div className="flex items-start gap-2.5 p-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                    <CatIcon style={{ color: meta.color, width: 16, height: 16 }} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-[13px] leading-snug">{node.label}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: diff.bg, color: diff.color }}>{diff.label}</span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>{node.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock style={{ width: 9, height: 9 }} />{node.estimated_time}
                    </p>
                </div>
                <button onClick={onClose} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors shrink-0">
                    <X className="w-3 h-3" />
                </button>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <p className="text-[12px] text-slate-600 leading-relaxed">{node.description}</p>
                {node.prerequisites.length > 0 && (
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prerequisites</p>
                        <div className="flex flex-wrap gap-1.5">
                            {node.prerequisites.map(p => (
                                <span key={p} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-medium">
                                    <Lock className="w-2 h-2 text-slate-400" />{p}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {node.resources.length > 0 && (
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Resources</p>
                        <div className="space-y-1.5">
                            {node.resources.map((r, i) => {
                                const tc = TYPE_COLORS[r.type] || '#64748b';
                                return (
                                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                        className="group flex items-center gap-2 p-2.5 rounded-xl border transition-all"
                                        style={{ borderColor: '#f1f5f9', background: '#f8fafc' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = tc + '55')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#f1f5f9')}
                                    >
                                        <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: tc }} />
                                        <span className="flex-1 text-[11px] text-slate-700 font-medium truncate">{r.title}</span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: `${tc}18`, color: tc }}>{r.type}</span>
                                            {r.free && <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded">FREE</span>}
                                            <ExternalLink className="w-2.5 h-2.5 text-slate-300" />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Roadmap Form Modal ───────────────────────────────────────
function RoadmapFormModal({ careerName, skills, onClose, onGenerate, loading }: {
    careerName: string; skills: string[];
    onClose: () => void; onGenerate: (p: RoadmapProfile) => void; loading: boolean;
}) {
    const [p, setP] = useState<RoadmapProfile>({
        domain: 'tech',
        goal: `Become a professional ${careerName}`,
        current_level: 'beginner',
        skills: skills.slice(0, 2),
        experience_years: 0, timeline_months: 6, daily_hours: 2,
        age: 22, constraints: '', resources_access: 'laptop, internet',
    });
    const s = (k: keyof RoadmapProfile, v: string | number | string[]) => setP(prev => ({ ...prev, [k]: v }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(10px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg rounded-2xl overflow-hidden"
                style={{ background: '#ffffff', boxShadow: '0 32px 80px rgba(0,0,0,0.22)' }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div>
                        <p className="text-[15px] font-bold text-slate-800 tracking-tight">Generate Roadmap</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{careerName} &middot; personalised just for you</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto">
                    <div>
                        <label className={LABEL}>Goal</label>
                        <textarea className={`${INPUT} resize-none`} rows={2} value={p.goal}
                            onChange={e => s('goal', e.target.value)} placeholder="e.g. Land a senior role at a top company" />
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div>
                        <label className={LABEL}>Roadmap Type</label>
                        <select className={INPUT} value={p.current_level} onChange={e => s('current_level', e.target.value)}>
                            <option value="beginner">Beginner — Just starting out</option>
                            <option value="intermediate">Intermediate — Some experience</option>
                            <option value="advanced">Advanced — Level up skills</option>
                        </select>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div>
                        <label className={LABEL}>Domain</label>
                        <select className={INPUT} value={p.domain} onChange={e => s('domain', e.target.value)}>
                            {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>)}
                        </select>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div>
                        <label className={LABEL}>Current Skills</label>
                        <SkillsPillInput
                            skills={p.skills}
                            onChange={v => s('skills', v)}
                            suggestedSkills={[...new Set([...skills, 'Python', 'JavaScript', 'Figma', 'SQL', 'React', 'Node.js', 'Git', 'Docker', 'Excel', 'Canva', 'Photoshop', 'English'])]}
                        />
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div>
                        <label className={LABEL}>Commitment</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {[
                                { key: 'age' as const, label: 'Age', unit: 'yrs', min: 14, max: 70, step: 1 },
                                { key: 'experience_years' as const, label: 'Experience', unit: 'yrs', min: 0, max: 30, step: 1 },
                                { key: 'daily_hours' as const, label: 'Daily hrs', unit: 'hrs', min: 0.5, max: 16, step: 0.5 },
                            ].map(({ key, label, unit, min, max, step }) => (
                                <div key={key} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-2">{label}</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => s(key, Math.max(min, (p[key] as number) - step))}
                                            className="w-5 h-5 rounded-md bg-white border border-slate-200 hover:border-blue-300 text-slate-500 text-[12px] font-bold flex items-center justify-center transition-all">−</button>
                                        <span className="text-[15px] font-bold text-slate-800 w-8 text-center tabular-nums">{p[key]}</span>
                                        <button type="button" onClick={() => s(key, Math.min(max, (p[key] as number) + step))}
                                            className="w-5 h-5 rounded-md bg-white border border-slate-200 hover:border-blue-300 text-slate-500 text-[12px] font-bold flex items-center justify-center transition-all">+</button>
                                    </div>
                                    <p className="text-[9px] text-slate-300 font-medium mt-1.5 uppercase tracking-wider">{unit}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Timeline</p>
                                <span className="text-[12px] font-bold text-slate-800">{p.timeline_months} months</span>
                            </div>
                            <input type="range" min={1} max={36} value={p.timeline_months}
                                onChange={e => s('timeline_months', +e.target.value)}
                                className="w-full accent-blue-600" style={{ height: 4 }} />
                            <div className="flex justify-between text-[9px] text-slate-300 mt-1 font-medium">
                                <span>1 month</span><span>36 months</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div>
                        <label className={LABEL}>Constraints <span className="normal-case font-normal text-slate-300">— optional</span></label>
                        <input type="text" className={INPUT} value={p.constraints}
                            onChange={e => s('constraints', e.target.value)} placeholder="e.g. no paid courses, part-time only" />
                    </div>
                    <button onClick={() => onGenerate(p)} disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all">
                        {loading
                            ? <><Loader2 className="w-4 h-4 animate-spin" />Building your roadmap&hellip;</>
                            : <><Sparkles className="w-4 h-4" />Generate Roadmap</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Roadmap Section ──────────────────────────────────────────
function RoadmapSection({ careerName, skills }: { careerName: string; skills: string[] }) {
    const [formOpen, setFormOpen] = useState(false);
    const [graph, setGraph] = useState<RoadmapGraphType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        if (!document.fullscreenElement && containerRef.current) {
            await containerRef.current.requestFullscreen();
        } else { await document.exitFullscreen(); }
    }, []);

    const handleGenerate = useCallback(async (profile: RoadmapProfile) => {
        setLoading(true); setError(null); setGraph(null); setSelectedNode(null);
        try {
            const res = await fetch('/api/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: {
                        domain: profile.domain, goal: profile.goal,
                        current_level: profile.current_level,
                        skills: profile.skills.filter(Boolean),
                        experience_years: profile.experience_years,
                        timeline_months: profile.timeline_months,
                        daily_hours: profile.daily_hours,
                        age: profile.age, location: 'remote',
                        constraints: profile.constraints.split(',').map(s => s.trim()).filter(Boolean),
                        resources_access: profile.resources_access.split(',').map(s => s.trim()).filter(Boolean),
                        preferences: {},
                    },
                }),
            });
            if (!res.ok) throw new Error((await res.text()) || `Error ${res.status}`);
            const data = await res.json() as ApiResponse;
            setGraph(data.graph);
            setFormOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally { setLoading(false); }
    }, []);

    return (
        <>
            <AnimatePresence>
                {formOpen && (
                    <RoadmapFormModal
                        careerName={careerName}
                        skills={skills}
                        onClose={() => setFormOpen(false)}
                        onGenerate={handleGenerate}
                        loading={loading}
                    />
                )}
            </AnimatePresence>

            <div ref={containerRef} className="rounded-2xl overflow-hidden relative"
                style={{
                    background: graph ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 32px rgba(59,130,246,0.08)',
                    ...(isFullscreen ? { borderRadius: 0 } : {}),
                }}
            >
                {/* Header bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white/50">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Map className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-slate-700">AI Roadmap</p>
                            {graph && <p className="text-[10px] text-slate-400">{graph.nodes.length} milestones · click any node</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {graph && (
                            <>
                                <button onClick={() => { setGraph(null); setSelectedNode(null); setFormOpen(true); }}
                                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-500 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-blue-50">
                                    <Sparkles className="w-3 h-3" /> Regenerate
                                </button>
                                <button onClick={toggleFullscreen}
                                    className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-lg transition-all"
                                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* CTA state */}
                {!graph && !loading && !error && (
                    <div className="p-10 flex flex-col items-center text-center gap-5">
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(48px)', transform: 'translate(25%,-25%)' }} />
                            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)', filter: 'blur(48px)', transform: 'translate(-25%,25%)' }} />
                        </div>
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25">
                            <Map className="w-8 h-8 text-white" />
                        </div>
                        <div className="relative">
                            <h3 className="text-[16px] font-bold text-slate-800">Your personalised roadmap</h3>
                            <p className="text-[12px] text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                                AI generates an interactive visual graph of milestones &amp; dependencies curated just for you.
                            </p>
                        </div>
                        <button onClick={() => setFormOpen(true)}
                            className="relative w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                            <Sparkles className="w-4 h-4" /> Generate Roadmap
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="p-12 flex flex-col items-center gap-5 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl select-none">✨</div>
                        <div>
                            <p className="text-[14px] font-bold text-slate-800">Building your roadmap…</p>
                            <p className="text-[12px] text-slate-400 mt-1">Analysing your profile &amp; crafting a personalised graph</p>
                        </div>
                        <div className="flex gap-2">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500"
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="p-6 space-y-3">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[12px] font-bold text-red-700">Generation failed</p>
                                <p className="text-[11px] text-red-500 mt-0.5">{error}</p>
                            </div>
                        </div>
                        <button onClick={() => { setError(null); setFormOpen(true); }}
                            className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold transition-colors">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Graph area */}
                {graph && !loading && (
                    <>
                        <div className="flex items-center gap-3 px-5 py-2 border-b border-slate-100 bg-slate-50/70 flex-wrap">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Difficulty:</span>
                            {[
                                { label: 'Beginner', color: '#10b981', bg: '#d1fae5' },
                                { label: 'Intermediate', color: '#f59e0b', bg: '#fef3c7' },
                                { label: 'Advanced', color: '#ef4444', bg: '#fee2e2' },
                            ].map(d => (
                                <span key={d.label} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: d.bg, color: d.color }}>{d.label}</span>
                            ))}
                            <span className="ml-auto text-[10px] text-slate-300 font-medium hidden sm:block">Click a node to explore</span>
                        </div>
                        <div style={{ position: 'relative', height: isFullscreen ? 'calc(100vh - 100px)' : 440, background: '#f5f7ff' }}>
                            <RoadmapGraph graph={graph} onNodeClick={setSelectedNode} selectedNodeId={selectedNode?.id} />
                            <AnimatePresence>
                                {selectedNode && <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>
        </>
    );
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

                    {/* ── LEFT (3/5): Title, About, Roadmap ── */}
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

                        {/* Roadmap section */}
                        <RoadmapSection careerName={career.name} skills={career.requirements.slice(0, 4)} />

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

                            {/* YouTube sidebar */}
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
