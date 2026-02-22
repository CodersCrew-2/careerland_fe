'use client';

import React from 'react';

interface ConfirmCompleteModalProps {
    resourceTitle: string;
    isCompleted: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'light' | 'dark';
}

export default function ConfirmCompleteModal({
    resourceTitle,
    isCompleted,
    onConfirm,
    onCancel,
    variant = 'dark',
}: ConfirmCompleteModalProps) {
    const isDark = variant === 'dark';

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onCancel}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 200,
                    animation: 'ccmFadeIn 0.15s ease',
                }}
            />
            {/* Dialog */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 210,
                    width: 340,
                    maxWidth: '90vw',
                    borderRadius: 16,
                    padding: '24px 20px 20px',
                    background: isDark ? '#1e2130' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                    animation: 'ccmPop 0.2s ease',
                    textAlign: 'center',
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        background: isCompleted
                            ? 'rgba(239,68,68,0.12)'
                            : 'rgba(16,185,129,0.12)',
                    }}
                >
                    {isCompleted ? '↩️' : '✅'}
                </div>

                <h3
                    style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: isDark ? '#e1e4ed' : '#1e293b',
                        marginBottom: 6,
                    }}
                >
                    {isCompleted ? 'Mark as incomplete?' : 'Mark as completed?'}
                </h3>

                <p
                    style={{
                        fontSize: 12,
                        color: isDark ? '#8b90a5' : '#94a3b8',
                        lineHeight: 1.6,
                        marginBottom: 20,
                        padding: '0 8px',
                    }}
                >
                    {isCompleted
                        ? `Unmark "${resourceTitle}" as completed?`
                        : `Have you really completed "${resourceTitle}"?`}
                </p>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '10px 0',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                            background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                            color: isDark ? '#8b90a5' : '#64748b',
                            transition: 'all 0.15s',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '10px 0',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: 'none',
                            background: isCompleted
                                ? 'linear-gradient(135deg, #ef4444, #f87171)'
                                : 'linear-gradient(135deg, #6366f1, #818cf8)',
                            color: '#ffffff',
                            transition: 'all 0.15s',
                            boxShadow: isCompleted
                                ? '0 4px 12px rgba(239,68,68,0.3)'
                                : '0 4px 12px rgba(99,102,241,0.3)',
                        }}
                    >
                        {isCompleted ? 'Yes, undo' : 'Yes, completed!'}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes ccmFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes ccmPop {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `}</style>
        </>
    );
}
