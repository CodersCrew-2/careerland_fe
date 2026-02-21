'use client';

import React from 'react';
import { RoadmapNode } from './types';

const DIFFICULTY_COLORS: Record<string, { bg: string; color: string }> = {
    beginner: { bg: 'rgba(22,163,106,0.13)', color: '#4ade80' },
    intermediate: { bg: 'rgba(234,179,8,0.13)', color: '#fbbf24' },
    advanced: { bg: 'rgba(239,68,68,0.13)', color: '#f87171' },
};

const CATEGORY_ICONS: Record<string, string> = {
    technical: '⚙️',
    physical: '💪',
    creative: '🎨',
    strategic: '♟️',
    competition: '🏆',
    research: '🔬',
    portfolio: '📂',
    exposure: '🌐',
    mental: '🧠',
    business: '💼',
};

const TYPE_COLORS: Record<string, string> = {
    article: '#60a5fa',
    video: '#f87171',
    course: '#a78bfa',
    documentation: '#38bdf8',
    book: '#fbbf24',
    tool: '#4ade80',
    podcast: '#fb923c',
    community: '#e879f9',
};

function ResourceCard({ resource }: { resource: RoadmapNode['resources'][0] }) {
    const typeColor = TYPE_COLORS[resource.type] || '#64748b';
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'block',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '12px 14px',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#6c63ff')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
            <div style={{ fontSize: 14, color: '#e1e4ed', fontWeight: 500, marginBottom: 6 }}>
                {resource.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span style={{
                    padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                    textTransform: 'uppercase', background: `${typeColor}22`, color: typeColor,
                }}>
                    {resource.type}
                </span>
                <span style={{ color: resource.free ? '#4ade80' : '#fbbf24' }}>
                    {resource.free ? 'Free' : 'Paid'}
                </span>
            </div>
        </a>
    );
}

export default function NodeSidebar({ node, onClose }: { node: RoadmapNode | null; onClose: () => void }) {
    if (!node) return null;

    const diff = DIFFICULTY_COLORS[node.difficulty] ?? DIFFICULTY_COLORS.beginner;
    const icon = CATEGORY_ICONS[node.category] ?? '📌';

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    zIndex: 90, animation: 'rmFadeIn 0.2s ease',
                }}
            />

            {/* Drawer */}
            <aside style={{
                position: 'fixed', top: 0, right: 0,
                width: 420, maxWidth: '90vw', height: '100vh',
                background: '#1a1d27',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                zIndex: 100, display: 'flex', flexDirection: 'column',
                animation: 'rmSlideIn 0.25s ease',
            }}>
                {/* Header */}
                <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e1e4ed', marginBottom: 8 }}>{node.label}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 13 }}>
                            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', background: diff.bg, color: diff.color }}>
                                {node.difficulty}
                            </span>
                            <span style={{ color: '#8b90a5' }}>·</span>
                            <span style={{ color: '#8b90a5' }}>{icon} {node.category}</span>
                            <span style={{ color: '#8b90a5' }}>·</span>
                            <span style={{ color: '#8b90a5' }}>⏱ {node.estimated_time}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b90a5', cursor: 'pointer', fontSize: 24, lineHeight: 1, padding: 4, flexShrink: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#e1e4ed')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#8b90a5')}
                    >×</button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                    <p style={{ fontSize: 14, color: '#8b90a5', lineHeight: 1.65, marginBottom: 20 }}>{node.description}</p>

                    {node.prerequisites.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8b90a5', marginBottom: 10, fontWeight: 600 }}>Prerequisites</h4>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {node.prerequisites.map(p => (
                                    <span key={p} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e1e4ed', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8b90a5', marginBottom: 10, fontWeight: 600 }}>Learning Resources</h4>
                        {!node.resources || node.resources.length === 0 ? (
                            <p style={{ color: '#8b90a5', fontSize: 13, fontStyle: 'italic' }}>No resources available.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {node.resources.map((r, i) => <ResourceCard key={`${r.url}-${i}`} resource={r} />)}
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <style>{`
                @keyframes rmFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes rmSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </>
    );
}
