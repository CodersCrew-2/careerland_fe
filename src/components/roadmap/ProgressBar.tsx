'use client';

import React from 'react';

interface ProgressBarProps {
    /** 0 – 100 */
    percent: number;
    /** 'light' for career page (white bg), 'dark' for RoadmapViewer (dark bg) */
    variant?: 'light' | 'dark';
    /** Show numeric label */
    showLabel?: boolean;
    /** Height in px */
    height?: number;
    /** Optional className for wrapper */
    className?: string;
}

export default function ProgressBar({
    percent,
    variant = 'light',
    showLabel = true,
    height = 6,
    className = '',
}: ProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));

    const trackBg = variant === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const fillGradient =
        clamped === 100
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : 'linear-gradient(90deg, #6366f1, #818cf8)';
    const labelColor = variant === 'dark' ? '#8b90a5' : '#94a3b8';
    const percentColor =
        clamped === 100
            ? variant === 'dark' ? '#4ade80' : '#10b981'
            : variant === 'dark' ? '#a5b4ff' : '#6366f1';

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <div
                style={{
                    flex: 1,
                    height,
                    borderRadius: height,
                    background: trackBg,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        width: `${clamped}%`,
                        height: '100%',
                        borderRadius: height,
                        background: fillGradient,
                        transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
            </div>
            {showLabel && (
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: percentColor,
                        minWidth: 32,
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {clamped}%
                </span>
            )}
        </div>
    );
}
