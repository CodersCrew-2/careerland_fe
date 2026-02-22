'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Progress hook – persists per-roadmap resource completion state in localStorage.
 *
 * Key format:  roadmap_progress_{roadmapTitle}
 * Value:       Record<nodeId, completedResourceIndices[]>
 *
 * This data is NOT removed on logout (the logout handler only removes
 * careerland_user / _step / _session), so progress persists across sessions.
 */

export type ProgressMap = Record<string, number[]>;

function storageKey(roadmapTitle: string) {
    return `roadmap_progress_${roadmapTitle.replace(/\s+/g, '_').toLowerCase()}`;
}

export function useProgress(roadmapTitle: string) {
    const [progress, setProgress] = useState<ProgressMap>({});

    // Load from localStorage on mount / title change
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey(roadmapTitle));
            if (raw) setProgress(JSON.parse(raw));
            else setProgress({});
        } catch {
            setProgress({});
        }
    }, [roadmapTitle]);

    // Persist helper
    const save = useCallback(
        (next: ProgressMap) => {
            try {
                localStorage.setItem(storageKey(roadmapTitle), JSON.stringify(next));
            } catch { /* quota exceeded – silently ignore */ }
        },
        [roadmapTitle],
    );

    /** Toggle a single resource (by index) inside a node */
    const toggleResource = useCallback(
        (nodeId: string, resourceIndex: number) => {
            setProgress(prev => {
                const list = prev[nodeId] ?? [];
                const next = list.includes(resourceIndex)
                    ? list.filter(i => i !== resourceIndex)
                    : [...list, resourceIndex];
                const updated = { ...prev, [nodeId]: next };
                save(updated);
                return updated;
            });
        },
        [save],
    );

    /** How many resources a given node has completed */
    const nodeCompleted = useCallback(
        (nodeId: string) => (progress[nodeId] ?? []).length,
        [progress],
    );

    /** Is a specific resource completed? */
    const isResourceDone = useCallback(
        (nodeId: string, resourceIndex: number) =>
            (progress[nodeId] ?? []).includes(resourceIndex),
        [progress],
    );

    return { progress, toggleResource, nodeCompleted, isResourceDone };
}
