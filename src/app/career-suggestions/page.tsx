'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoadmapGraph from '@/components/roadmap/RoadmapGraph';
import ProgressBar from '@/components/roadmap/ProgressBar';
import ConfirmCompleteModal from '@/components/roadmap/ConfirmCompleteModal';
import { useProgress } from '@/components/roadmap/useProgress';
import type { RoadmapGraph as RoadmapGraphType, RoadmapNode } from '@/components/roadmap/types';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sparkles, ArrowRight, IndianRupee, TrendingUp, Clock,
    Map, Maximize2, Minimize2, X, ExternalLink, BookOpen, Lock,
    Zap, Brain, Palette, Target, Trophy, FlaskConical, Briefcase,
    Eye as EyeIcon, Play, ChevronRight, ArrowLeft, Loader2, Plus, CheckCircle2, Check,
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

// Curated Unsplash images for AI-suggested careers (fallback by index)
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

// ─── Node Detail Panel ──────────────────────────────────────
function NodeDetail({
    node, onClose, isResourceDone, onToggleResource, nodeCompleted,
}: {
    node: RoadmapNode; onClose: () => void;
    isResourceDone?: (nodeId: string, idx: number) => boolean;
    onToggleResource?: (nodeId: string, idx: number) => void;
    nodeCompleted?: (nodeId: string) => number;
}) {
    const meta = CATEGORY_META[node.category] ?? CATEGORY_META.technical;
    const diff = DIFF_META[node.difficulty] ?? DIFF_META.beginner;
    const CatIcon = meta.icon;
    const [confirmInfo, setConfirmInfo] = useState<{ index: number; title: string; done: boolean } | null>(null);

    const totalRes = node.resources?.length || 0;
    const completedRes = nodeCompleted ? nodeCompleted(node.id) : 0;
    const percent = totalRes > 0 ? (completedRes / totalRes) * 100 : 0;

    const handleToggle = (i: number) => {
        const done = isResourceDone ? isResourceDone(node.id, i) : false;
        setConfirmInfo({ index: i, title: node.resources[i].title, done });
    };

    return (
        <>
            <motion.div
                key={node.id}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0,
                    width: 300, zIndex: 20,
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(16px)',
                    borderLeft: `2px solid ${meta.color}30`,
                    boxShadow: `-6px 0 32px rgba(0,0,0,0.08)`,
                    display: 'flex', flexDirection: 'column', overflowY: 'auto',
                }}
            >
                <div className="flex items-start gap-2.5 p-4 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                        <CatIcon style={{ color: meta.color, width: 16, height: 16 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-[13px] leading-snug">{node.label}</p>
                        {totalRes > 0 && (
                            <div className="mt-1.5 mb-1">
                                <ProgressBar percent={percent} variant="light" height={4} />
                            </div>
                        )}
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
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resources</p>
                                <span className="text-[10px] text-slate-400" style={{ fontVariantNumeric: 'tabular-nums' }}>{completedRes}/{totalRes}</span>
                            </div>
                            <div className="space-y-1.5">
                                {node.resources.map((r, i) => {
                                    const tc = TYPE_COLORS[r.type] || '#64748b';
                                    const done = isResourceDone ? isResourceDone(node.id, i) : false;
                                    return (
                                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl border transition-all"
                                            style={{ borderColor: done ? '#bbf7d0' : '#f1f5f9', background: done ? '#f0fdf4' : '#f8fafc' }}
                                        >
                                            <button
                                                onClick={() => handleToggle(i)}
                                                className="shrink-0 flex items-center justify-center transition-all"
                                                style={{
                                                    width: 20, height: 20, borderRadius: 6, padding: 0, cursor: 'pointer',
                                                    border: `1.5px solid ${done ? '#10b981' : '#e2e8f0'}`,
                                                    background: done ? '#d1fae5' : 'transparent',
                                                }}
                                            >
                                                {done && <Check className="w-3 h-3 text-emerald-600" />}
                                            </button>
                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 flex items-center gap-2 no-underline">
                                                <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: tc, opacity: done ? 0.5 : 1 }} />
                                                <span className="flex-1 text-[11px] font-medium truncate" style={{ color: done ? '#94a3b8' : '#334155', textDecoration: done ? 'line-through' : 'none' }}>{r.title}</span>
                                            </a>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: `${tc}18`, color: tc }}>{r.type}</span>
                                                {r.free && <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded">FREE</span>}
                                                <ExternalLink className="w-2.5 h-2.5 text-slate-300" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {confirmInfo && (
                <ConfirmCompleteModal
                    resourceTitle={confirmInfo.title}
                    isCompleted={confirmInfo.done}
                    onConfirm={() => { onToggleResource?.(node.id, confirmInfo!.index); setConfirmInfo(null); }}
                    onCancel={() => setConfirmInfo(null)}
                    variant="light"
                />
            )}
        </>
    );
}

// helper: check if a career is already added to "My Careers"
function isInMyCareers(name: string): boolean {
    try {
        const raw = localStorage.getItem('user_added_careers');
        const existing: CareerOption[] = raw ? JSON.parse(raw) : [];
        return existing.some(c => c.name === name);
    } catch { return false; }
}

// helper: add a career to the user's "My Careers" list
function addToMyCareers(career: CareerOption): boolean {
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

// ─── Career Option Card (matches /careers page tile aesthetic) ───
function CareerCard({ career, index, onExplore }: {
    career: CareerOption; index: number; onExplore: () => void;
}) {
    const [added, setAdded] = useState(() => isInMyCareers(career.name));
    const img = SUGGESTION_IMAGES[index % SUGGESTION_IMAGES.length];

    // Compute a pseudo match percentage from the index
    const matchPct = Math.floor(78 + ((index * 7) % 18));

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (addToMyCareers(career)) setAdded(true);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.22, delay: index * 0.05 }}
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{
                background: '#ffffff',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
            }}
        >
            {/* Image area */}
            <div className="relative h-44 overflow-hidden shrink-0">
                <img
                    src={img}
                    alt={career.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)' }} />

                {/* Match badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.95)', color: '#10b981', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    ✦ {matchPct}% Match
                </div>

                {/* Type pill on image */}
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                    AI Suggested
                </div>
            </div>

            {/* Card body */}
            <div className="p-4 flex-1 flex flex-col gap-2.5">
                <div>
                    <h3 className="font-bold text-slate-800 text-[15px] leading-snug">{career.name}</h3>
                    <p className="text-[12px] text-slate-400 leading-snug mt-0.5 line-clamp-2">{career.description}</p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{career.overview.annual_income}</span>
                    <span className="w-0.5 h-3 rounded-full bg-slate-100" />
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400" />{career.overview.job_growth}</span>
                    <span className="w-0.5 h-3 rounded-full bg-slate-100" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{career.overview.time_to_proficiency}</span>
                </div>

                {/* Tags (from requirements) */}
                <div className="flex flex-wrap gap-1">
                    {career.requirements.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 font-medium border border-slate-100">{t}</span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 flex gap-2">
                <button onClick={handleAdd}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-semibold transition-all shrink-0"
                    style={added
                        ? { borderColor: '#bbf7d0', color: '#16a34a', background: '#f0fdf4' }
                        : { borderColor: '#bfdbfe', color: '#3b82f6', background: '#eff6ff' }}>
                    {added
                        ? <><CheckCircle2 className="w-3.5 h-3.5" /> Added</>
                        : <><Plus className="w-3.5 h-3.5" /> Add To Career</>}
                </button>
                <button
                    onClick={onExplore}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
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
    const { toggleResource, nodeCompleted, isResourceDone } = useProgress(graph.title ?? 'onboarding_roadmap');

    const totalResources = graph.nodes.reduce((s, n) => s + (n.resources?.length || 0), 0);
    const totalCompleted = graph.nodes.reduce((s, n) => s + nodeCompleted(n.id), 0);
    const overallPercent = totalResources > 0 ? (totalCompleted / totalResources) * 100 : 0;
    const completedNodeIds = new Set(
        graph.nodes.filter(n => { const t = n.resources?.length || 0; return t > 0 && nodeCompleted(n.id) >= t; }).map(n => n.id)
    );

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
                        {totalResources > 0 && (
                            <div style={{ marginTop: 4, width: 180 }}>
                                <ProgressBar percent={overallPercent} variant="light" height={4} />
                            </div>
                        )}
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
                    completedNodeIds={completedNodeIds}
                />
                <AnimatePresence>
                    {selectedNode && (
                        <NodeDetail
                            node={selectedNode}
                            onClose={() => setSelectedNode(null)}
                            isResourceDone={isResourceDone}
                            onToggleResource={toggleResource}
                            nodeCompleted={nodeCompleted}
                        />
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
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                        >
                            {careers.map((career, i) => (
                                <CareerCard
                                    key={career.name}
                                    career={career}
                                    index={i}
                                    onExplore={() => {
                                        router.push(`/career-suggestions/${i}`);
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
