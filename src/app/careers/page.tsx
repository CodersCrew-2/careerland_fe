'use client';

import React, { useState } from 'react';
import { Bookmark, TrendingUp, Clock, IndianRupee, Map, Search } from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import { CAREERS } from '@/lib/careers-data';
import Link from 'next/link';
import type { Career } from '@/lib/careers-data';

// Curated Unsplash images per career id
const CAREER_IMAGES: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&q=80',  // UX
    2: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',  // Data Sci
    3: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80', // PM
    4: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80', // Frontend
    5: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&q=80', // ML
    6: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&q=80', // Content
};

function CareerCard({ career, saved, onSave }: {
    career: Career; saved: boolean; onSave: () => void;
}) {
    const img = CAREER_IMAGES[career.id] ?? `https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=80`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.22 }}
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
                    alt={career.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)' }} />

                {/* Match badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.95)', color: '#10b981', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    ✦ {Math.floor(72 + career.id * 5)}% Match
                </div>

                {/* Save button */}
                <button onClick={e => { e.preventDefault(); onSave(); }}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ background: saved ? '#3b82f6' : 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    <Bookmark className="w-3.5 h-3.5" style={{ color: saved ? '#fff' : '#94a3b8', fill: saved ? '#fff' : 'none' }} />
                </button>

                {/* Type pill on image */}
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                    {career.type}
                </div>
            </div>

            {/* Card body */}
            <div className="p-4 flex-1 flex flex-col gap-2.5">
                <div>
                    <h3 className="font-bold text-slate-800 text-[15px] leading-snug">{career.title}</h3>
                    <p className="text-[12px] text-slate-400 leading-snug mt-0.5 line-clamp-2">{career.desc}</p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{career.salary.split('–')[0]}</span>
                    <span className="w-0.5 h-3 rounded-full bg-slate-100" />
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400" />{career.growth}</span>
                    <span className="w-0.5 h-3 rounded-full bg-slate-100" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{career.time}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {career.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 font-medium border border-slate-100">{t}</span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 flex gap-2">
                <button onClick={e => { e.preventDefault(); onSave(); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-semibold transition-all shrink-0"
                    style={saved
                        ? { borderColor: '#bfdbfe', color: '#3b82f6', background: '#eff6ff' }
                        : { borderColor: '#e2e8f0', color: '#94a3b8', background: '#f8fafc' }}>
                    <Bookmark className="w-3.5 h-3.5" style={{ fill: saved ? 'currentColor' : 'none' }} />
                    {saved ? 'Saved' : 'Save'}
                </button>
                <Link href={`/career/${career.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors">
                    Explore
                    <Search className="w-3.5 h-3.5" />
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
    const [search, setSearch] = useState('');

    const toggleSave = (id: number) =>
        setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    const base = tab === 'saved' ? CAREERS.filter(c => saved.includes(c.id)) : CAREERS;
    const displayed = base.filter(c =>
        !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-5xl space-y-6">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Map className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Explore</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 leading-tight">Careers</h1>
                        <p className="text-[13px] text-slate-400 mt-1">Browse paths & generate a personalised roadmap for any career.</p>
                    </div>

                    {/* Tab toggle */}
                    <div className="flex gap-0.5 p-1 rounded-xl shrink-0"
                        style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)' }}>
                        {(['all', 'saved'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                style={tab === t ? { background: '#1e293b', color: '#fff' } : { color: '#94a3b8' }}>
                                {t === 'all' ? 'All' : `Saved${saved.length ? ` (${saved.length})` : ''}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search careers…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.8)',
                            border: '1px solid rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    />
                </div>

                {/* Grid */}
                <AnimatePresence mode="popLayout">
                    {displayed.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-24 rounded-2xl border border-dashed border-slate-200">
                            <Bookmark className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                            <p className="text-[13px] text-slate-400 font-medium">{tab === 'saved' ? 'No saved careers yet.' : 'No careers found.'}</p>
                            <p className="text-[12px] text-slate-300 mt-1">{tab === 'saved' ? 'Hit Save on any career card.' : 'Try a different search.'}</p>
                        </motion.div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {displayed.map((career, i) => (
                                <motion.div key={career.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}>
                                    <CareerCard career={career} saved={saved.includes(career.id)} onSave={() => toggleSave(career.id)} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
