'use client';

import React, { useState } from 'react';
import { RoadmapNode } from './types';
import ProgressBar from './ProgressBar';
import ConfirmCompleteModal from './ConfirmCompleteModal';

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

function ResourceCard({
    resource,
    index,
    completed,
    onToggle,
}: {
    resource: RoadmapNode['resources'][0];
    index: number;
    completed: boolean;
    onToggle: (index: number) => void;
}) {
    const typeColor = TYPE_COLORS[resource.type] || '#64748b';
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: completed ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${completed ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 8,
                padding: '10px 12px',
                transition: 'all 0.2s',
            }}
        >
            {/* Check button */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggle(index); }}
                style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `1.5px solid ${completed ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                    background: completed ? 'rgba(16,185,129,0.15)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                    transition: 'all 0.2s',
                    color: completed ? '#4ade80' : 'rgba(255,255,255,0.25)',
                    fontSize: 13,
                    padding: 0,
                }}
                title={completed ? 'Mark incomplete' : 'Mark complete'}
            >
                {completed ? '✓' : ''}
            </button>

            {/* Resource link */}
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    flex: 1,
                    textDecoration: 'none',
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        color: completed ? '#6b7280' : '#e1e4ed',
                        fontWeight: 500,
                        marginBottom: 5,
                        textDecoration: completed ? 'line-through' : 'none',
                        opacity: completed ? 0.7 : 1,
                        transition: 'all 0.2s',
                    }}
                >
                    {resource.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <span
                        style={{
                            padding: '2px 8px',
                            borderRadius: 3,
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            background: `${typeColor}22`,
                            color: typeColor,
                        }}
                    >
                        {resource.type}
                    </span>
                    <span style={{ color: resource.free ? '#4ade80' : '#fbbf24' }}>
                        {resource.free ? 'Free' : 'Paid'}
                    </span>
                </div>
            </a>
        </div>
    );
}

export default function NodeSidebar({
    node,
    onClose,
    isResourceDone,
    onToggleResource,
    nodeCompleted,
}: {
    node: RoadmapNode | null;
    onClose: () => void;
    isResourceDone?: (nodeId: string, resourceIndex: number) => boolean;
    onToggleResource?: (nodeId: string, resourceIndex: number) => void;
    nodeCompleted?: (nodeId: string) => number;
}) {
    const [confirmInfo, setConfirmInfo] = useState<{ index: number; title: string; done: boolean } | null>(null);

    if (!node) return null;

    const diff = DIFFICULTY_COLORS[node.difficulty] ?? DIFFICULTY_COLORS.beginner;
    const icon = CATEGORY_ICONS[node.category] ?? '📌';

    const totalResources = node.resources?.length || 0;
    const completedCount = nodeCompleted ? nodeCompleted(node.id) : 0;
    const percent = totalResources > 0 ? (completedCount / totalResources) * 100 : 0;

    const handleToggleClick = (index: number) => {
        const r = node.resources[index];
        const done = isResourceDone ? isResourceDone(node.id, index) : false;
        setConfirmInfo({ index, title: r.title, done });
    };

    const handleConfirm = () => {
        if (confirmInfo && onToggleResource) {
            onToggleResource(node.id, confirmInfo.index);
        }
        setConfirmInfo(null);
    };

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

                        {/* Node progress bar */}
                        {totalResources > 0 && (
                            <div style={{ marginBottom: 10 }}>
                                <ProgressBar percent={percent} variant="dark" height={5} />
                            </div>
                        )}

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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8b90a5', fontWeight: 600 }}>Learning Resources</h4>
                            {totalResources > 0 && (
                                <span style={{ fontSize: 11, color: '#8b90a5', fontVariantNumeric: 'tabular-nums' }}>
                                    {completedCount}/{totalResources}
                                </span>
                            )}
                        </div>
                        {!node.resources || node.resources.length === 0 ? (
                            <p style={{ color: '#8b90a5', fontSize: 13, fontStyle: 'italic' }}>No resources available.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {node.resources.map((r, i) => (
                                    <ResourceCard
                                        key={`${r.url}-${i}`}
                                        resource={r}
                                        index={i}
                                        completed={isResourceDone ? isResourceDone(node.id, i) : false}
                                        onToggle={handleToggleClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Confirmation modal */}
            {confirmInfo && (
                <ConfirmCompleteModal
                    resourceTitle={confirmInfo.title}
                    isCompleted={confirmInfo.done}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmInfo(null)}
                    variant="dark"
                />
            )}

            <style>{`
                @keyframes rmFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes rmSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </>
    );
}
