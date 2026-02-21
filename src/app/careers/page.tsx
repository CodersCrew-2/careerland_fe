'use client';

import React, { useState } from 'react';
import { Bookmark, ArrowRight, Map, TrendingUp, Clock, IndianRupee, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import { CAREERS } from '@/lib/careers-data';
import Link from 'next/link';

type Career = typeof CAREERS[0];

function CareerCard({ career, saved, onSave }: {
    career: Career; saved: boolean; onSave: () => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(59,130,246,0.10)' }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl flex flex-col"
            style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
        >
            <div className="p-5 flex-1 space-y-3.5">
                {/* Header row */}
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0 select-none">
                        {career.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-[15px] leading-snug truncate">{career.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{career.type}</p>
                    </div>
                    <button
                        onClick={onSave}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0"
                        title={saved ? 'Unsave' : 'Save'}
                    >
                        <Bookmark
                            className="w-4 h-4"
                            style={{ color: saved ? '#3b82f6' : '#cbd5e1', fill: saved ? '#3b82f6' : 'none' }}
                        />
                    </button>
                </div>

                {/* Description */}
                <p className="text-[13px] text-slate-500 leading-relaxed">{career.desc}</p>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5">
                    {career.tags.map(t => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {t}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1 text-[12px] text-slate-500">
                        <IndianRupee className="w-3 h-3" />{career.salary}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="flex items-center gap-1 text-[12px] text-slate-500">
                        <TrendingUp className="w-3 h-3" />{career.growth}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="flex items-center gap-1 text-[12px] text-slate-500">
                        <Clock className="w-3 h-3" />{career.time}
                    </span>
                </div>
            </div>

            {/* Footer actions */}
            <div className="px-5 pb-5 flex gap-2">
                <button
                    onClick={onSave}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
                >
                    <Bookmark className="w-3.5 h-3.5" style={{ fill: saved ? 'currentColor' : 'none' }} />
                    {saved ? 'Saved' : 'Save'}
                </button>
                <Link
                    href={`/career/${career.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors"
                >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}

export default function CareersPage() {
    return <ProtectedRoute><CareersContent /></ProtectedRoute>;
}

function CareersContent() {
    const [tab, setTab] = useState<'all' | 'saved'>('all');
    const [saved, setSaved] = useState<number[]>([]);

    const displayed = tab === 'saved' ? CAREERS.filter(c => saved.includes(c.id)) : CAREERS;
    const toggleSave = (id: number) =>
        setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    return (
        <Layout>
            <div className="max-w-5xl space-y-7">

                {/* ── Page Header ── */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Map className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Explore</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 font-display leading-tight">Careers</h1>
                        <p className="text-[13px] text-slate-400 mt-1">
                            Browse paths &amp; generate a personalised roadmap for any career.
                        </p>
                    </div>

                    {/* Tab toggle */}
                    <div className="flex gap-0.5 p-1 rounded-xl shrink-0" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)' }}>
                        {(['all', 'saved'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                style={tab === t
                                    ? { background: '#1e293b', color: '#fff' }
                                    : { color: '#94a3b8' }}
                            >
                                {t === 'all' ? 'All' : `Saved${saved.length ? ` (${saved.length})` : ''}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Grid ── */}
                <AnimatePresence mode="popLayout">
                    {displayed.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-24 rounded-2xl border border-dashed border-slate-200"
                        >
                            <Bookmark className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                            <p className="text-[13px] text-slate-400 font-medium">No saved careers yet.</p>
                            <p className="text-[12px] text-slate-300 mt-1">Hit Save on any career card.</p>
                        </motion.div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {displayed.map((career, i) => (
                                <motion.div
                                    key={career.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <CareerCard
                                        career={career}
                                        saved={saved.includes(career.id)}
                                        onSave={() => toggleSave(career.id)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
