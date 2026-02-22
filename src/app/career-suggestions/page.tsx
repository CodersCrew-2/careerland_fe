'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoadmapGraph from '@/components/roadmap/RoadmapGraph';
import type { RoadmapGraph as RoadmapGraphType, RoadmapNode } from '@/components/roadmap/types';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sparkles, ArrowRight, IndianRupee, TrendingUp, Clock,
    Map, Maximize2, Minimize2, X, ExternalLink, BookOpen, Lock,
    Zap, Brain, Palette, Target, Trophy, FlaskConical, Briefcase,
    Eye as EyeIcon, Play, ChevronRight, ArrowLeft, Loader2,
} from 'lucide-react';

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

const CAREER_ACCENTS = [
    { gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)', glow: 'rgba(59,130,246,0.2)' },
    { gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)', glow: 'rgba(139,92,246,0.2)' },
    { gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', glow: 'rgba(6,182,212,0.2)' },
    { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.2)' },
    { gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.2)' },
];

// ─── Node Detail Panel ──────────────────────────────────────
function NodeDetail({ node, onClose }: { node: RoadmapNode; onClose: () => void }) {
    const meta = CATEGORY_META[node.category] ?? CATEGORY_META.technical;
    const diff = DIFF_META[node.difficulty] ?? DIFF_META.beginner;
    const CatIcon = meta.icon;

    return (
        <motion.div
            key={node.id}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{
                position: 'absolute', top: 0, right: 0, bottom: 0,
                width: 280, zIndex: 20,
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(16px)',
                borderLeft: `2px solid ${meta.color}30`,
                boxShadow: `-6px 0 32px rgba(0,0,0,0.08)`,
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto',
            }}
        >
            {/* Header */}
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

// ─── Career Option Card ─────────────────────────────────────
function CareerCard({ career, index, onExplore }: {
    career: CareerOption; index: number; onExplore: () => void;
}) {
    const accent = CAREER_ACCENTS[index % CAREER_ACCENTS.length];

    // Extract YouTube video ID from URL
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/);
        return match?.[1] ?? null;
    };
    const ytId = getYouTubeId(career.youtube);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#ffffff',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: `0 4px 24px ${accent.glow}, 0 2px 8px rgba(0,0,0,0.04)`,
            }}
        >
            {/* Accent bar */}
            <div style={{ height: 4, background: accent.gradient }} />

            <div className="p-5 space-y-4">
                {/* Title */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-[14px] font-bold"
                        style={{ background: accent.gradient }}>
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-bold text-slate-800 leading-snug">{career.name}</h3>
                        <p className="text-[12px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{career.description}</p>
                    </div>
                </div>

                {/* Overview stats */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { icon: IndianRupee, label: 'Income', val: career.overview.annual_income, color: '#10b981', bg: '#f0fdf4' },
                        { icon: TrendingUp, label: 'Growth', val: career.overview.job_growth, color: '#3b82f6', bg: '#eff6ff' },
                        { icon: Clock, label: 'Timeline', val: career.overview.time_to_proficiency, color: '#f59e0b', bg: '#fffbeb' },
                    ].map(({ icon: Icon, label, val, color, bg }) => (
                        <div key={label} className="p-2.5 rounded-xl text-center" style={{ background: bg }}>
                            <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                            <p className="text-[11px] font-semibold text-slate-700 mt-0.5 leading-snug line-clamp-2">{val}</p>
                        </div>
                    ))}
                </div>

                {/* Requirements */}
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Requirements</p>
                    <div className="space-y-1">
                        {career.requirements.slice(0, 3).map((r, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                                <span className="w-4 h-4 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-slate-400">{i + 1}</span>
                                <span className="leading-relaxed">{r}</span>
                            </div>
                        ))}
                        {career.requirements.length > 3 && (
                            <p className="text-[10px] text-slate-300 ml-6">+{career.requirements.length - 3} more</p>
                        )}
                    </div>
                </div>

                {/* YouTube embed or link */}
                {ytId ? (
                    <div className="rounded-xl overflow-hidden aspect-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={`${career.name} day in the life`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : career.youtube ? (
                    <a href={career.youtube} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all">
                        <Play className="w-3.5 h-3.5 text-red-400" />
                        Watch: Day in the Life
                        <ExternalLink className="w-3 h-3 ml-auto text-slate-300" />
                    </a>
                ) : null}

                {/* Explore button */}
                <button
                    onClick={onExplore}
                    className="w-full py-3 rounded-xl text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{ background: accent.gradient, boxShadow: `0 4px 16px ${accent.glow}` }}
                >
                    Explore Career <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

// ─── Roadmap Section ────────────────────────────────────────
function RoadmapSection({ graph }: { graph: RoadmapGraphType }) {
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
        } else {
            await document.exitFullscreen();
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="rounded-2xl overflow-hidden relative"
            style={{
                background: 'rgba(255,255,255,0.75)',
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
                        <p className="text-[12px] font-bold text-slate-700">{graph.title || 'Your AI Roadmap'}</p>
                        <p className="text-[10px] text-slate-400">{graph.nodes.length} milestones · click any node</p>
                    </div>
                </div>
                <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-lg transition-all"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                </button>
            </div>

            {/* Legend */}
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

            {/* Canvas + Node detail */}
            <div style={{ position: 'relative', height: isFullscreen ? 'calc(100vh - 100px)' : 500, background: '#f5f7ff' }}>
                <RoadmapGraph
                    graph={graph}
                    onNodeClick={setSelectedNode}
                    selectedNodeId={selectedNode?.id}
                />
                <AnimatePresence>
                    {selectedNode && (
                        <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────
export default function CareerSuggestionsPage() {
    return (
        <ProtectedRoute>
            <CareerSuggestionsContent />
        </ProtectedRoute>
    );
}

function CareerSuggestionsContent() {
    const router = useRouter();
    const [careers, setCareers] = useState<CareerOption[]>([]);
    const [graph, setGraph] = useState<RoadmapGraphType | null>(null);
    const [hasData, setHasData] = useState(false);
    const [activeTab, setActiveTab] = useState<'careers' | 'roadmap'>('careers');

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const careersRaw = localStorage.getItem('onboarding_careers');
            const roadmapRaw = localStorage.getItem('onboarding_roadmap');

            if (careersRaw) {
                const parsed = JSON.parse(careersRaw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCareers(parsed);
                    setHasData(true);
                }
            }

            if (roadmapRaw) {
                const parsed = JSON.parse(roadmapRaw);
                if (parsed && parsed.nodes && parsed.edges) {
                    setGraph(parsed);
                    setHasData(true);
                }
            }
        } catch (e) {
            console.error('Failed to load onboarding results:', e);
        }
    }, []);

    if (!hasData) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25"
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-[22px] font-bold text-slate-800">No results yet</h2>
                        <p className="text-[13px] text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                            Complete the onboarding questionnaire first so we can generate personalised career suggestions &amp; a roadmap for you.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[13px] font-bold flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/25"
                    >
                        <Sparkles className="w-4 h-4" />
                        Start Onboarding
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl space-y-6 pb-8">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">AI-Powered</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 leading-tight">Your Career Matches</h1>
                        <p className="text-[13px] text-slate-400 mt-1">Personalised suggestions based on your onboarding answers.</p>
                    </div>

                    {/* Tab toggle (only show if both tabs have data) */}
                    {careers.length > 0 && graph && (
                        <div className="flex gap-0.5 p-1 rounded-xl shrink-0"
                            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)' }}>
                            {([
                                { key: 'careers' as const, label: `Careers (${careers.length})` },
                                { key: 'roadmap' as const, label: 'Roadmap' },
                            ]).map(t => (
                                <button key={t.key} onClick={() => setActiveTab(t.key)}
                                    className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                    style={activeTab === t.key ? { background: '#1e293b', color: '#fff' } : { color: '#94a3b8' }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {/* ── Careers tab ── */}
                    {activeTab === 'careers' && careers.length > 0 && (
                        <motion.div
                            key="careers"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                        >
                            {careers.map((career, i) => (
                                <CareerCard
                                    key={career.name}
                                    career={career}
                                    index={i}
                                    onExplore={() => {
                                        // Search for a matching career in static data, or just go to careers page
                                        router.push('/careers');
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* ── Roadmap tab ── */}
                    {activeTab === 'roadmap' && graph && (
                        <motion.div
                            key="roadmap"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                        >
                            <RoadmapSection graph={graph} />
                        </motion.div>
                    )}

                    {/* If only roadmap data but no careers */}
                    {activeTab === 'careers' && careers.length === 0 && graph && (
                        <motion.div
                            key="no-careers"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 rounded-2xl border border-dashed border-slate-200"
                        >
                            <p className="text-[13px] text-slate-400 font-medium">No career suggestions available.</p>
                            <button onClick={() => setActiveTab('roadmap')}
                                className="mt-3 text-[12px] text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 mx-auto">
                                View your roadmap instead <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Show roadmap below careers if not using tabs (only careers exist) */}
                {graph && careers.length > 0 && activeTab === 'careers' && (
                    <div className="mt-6">
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className="w-full py-4 rounded-2xl border border-blue-100 bg-blue-50/50 text-[13px] font-bold text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                        >
                            <Map className="w-4 h-4" />
                            View Your Personalised Roadmap
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Back action */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="text-[12px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Redo Onboarding
                    </button>
                    <span className="text-slate-200">·</span>
                    <button
                        onClick={() => router.push('/careers')}
                        className="text-[12px] text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                    >
                        Browse All Careers <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </Layout>
    );
}
