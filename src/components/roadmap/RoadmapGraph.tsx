/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { RoadmapGraph, RoadmapNode } from './types';

const CATEGORY_EMOJI: Record<string, string> = {
    technical: '⚙️', physical: '💪', creative: '🎨', strategic: '♟️',
    competition: '🏆', research: '🔬', portfolio: '📂', exposure: '🌐',
    mental: '🧠', business: '💼',
};

const DIFF_COLORS: Record<string, { bg: string; border: string; font: string }> = {
    beginner: { bg: '#d1fae5', border: '#34d399', font: '#064e3b' },
    intermediate: { bg: '#fef3c7', border: '#f59e0b', font: '#78350f' },
    advanced: { bg: '#fee2e2', border: '#f87171', font: '#7f1d1d' },
};

// Grayed-out style for fully completed nodes
const DONE_COLORS = { bg: '#f1f5f9', border: '#cbd5e1', font: '#94a3b8' };

function buildSpanTree(nodes: RoadmapGraph['nodes'], edges: RoadmapGraph['edges']): Set<string> {
    const adj: Record<string, string[]> = {};
    edges.forEach(e => { (adj[e.source] ||= []).push(e.target); });
    const visited = new Set<string>();
    const tree = new Set<string>();
    const childIds = new Set(edges.map(e => e.target));
    const roots = nodes.filter(n => !childIds.has(n.id));
    if (roots.length === 0 && nodes.length > 0) roots.push(nodes[0]);

    function dfs(id: string) {
        visited.add(id);
        for (const child of adj[id] ?? []) {
            if (!visited.has(child)) { tree.add(`${id}->${child}`); dfs(child); }
        }
    }
    roots.forEach(r => !visited.has(r.id) && dfs(r.id));
    nodes.forEach(n => !visited.has(n.id) && dfs(n.id));
    return tree;
}

export default function RoadmapGraph({
    graph,
    onNodeClick,
    selectedNodeId,
    completedNodeIds,
}: {
    graph: RoadmapGraph;
    onNodeClick: (node: RoadmapNode | null) => void;
    selectedNodeId?: string | null;
    /** Set of node IDs where ALL resources are completed — these get grayed out */
    completedNodeIds?: Set<string>;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const networkRef = useRef<any>(null);

    const handleClick = useCallback(
        (params: { nodes: string[] }) => {
            if (params.nodes.length) {
                const node = graph.nodes.find(n => n.id === params.nodes[0]);
                onNodeClick(node ?? null);
            } else {
                onNodeClick(null);
            }
        },
        [graph, onNodeClick],
    );

    useEffect(() => {
        if (!containerRef.current || !graph) return;
        let destroyed = false;

        Promise.all([import('vis-network'), import('vis-data')]).then(([visNet, visData]) => {
            if (destroyed || !containerRef.current) return;

            const Network = visNet.Network;
            const DataSet = (visData as any).DataSet;

            const treeEdges = buildSpanTree(graph.nodes, graph.edges);

            const visNodes = new DataSet(
                graph.nodes.map(n => {
                    const isDone = completedNodeIds?.has(n.id) ?? false;
                    const col = isDone ? DONE_COLORS : (DIFF_COLORS[n.difficulty] ?? DIFF_COLORS.beginner);
                    const emoji = CATEGORY_EMOJI[n.category] ?? '📌';
                    const donePrefix = isDone ? '✓ ' : '';
                    return {
                        id: n.id,
                        label: `${donePrefix}${emoji}  ${n.label}`,
                        color: {
                            background: col.bg,
                            border: col.border,
                            highlight: { background: col.bg, border: isDone ? '#94a3b8' : '#6366f1' },
                            hover: { background: col.bg, border: isDone ? '#94a3b8' : '#818cf8' },
                        },
                        font: {
                            color: col.font,
                            size: 15,
                            face: 'Inter, system-ui, sans-serif',
                            vadjust: 0,
                        },
                        shape: 'box',
                        margin: { top: 13, bottom: 13, left: 20, right: 20 },
                        borderWidth: isDone ? 1 : 2,
                        borderWidthSelected: 3,
                        shapeProperties: { borderRadius: 10 },
                        shadow: !isDone,
                        opacity: isDone ? 0.6 : 1,
                        chosen: false,
                    };
                }),
            );

            const visEdges = new DataSet(
                graph.edges.map(e => {
                    const key = `${e.source}->${e.target}`;
                    const isTree = treeEdges.has(key);
                    return {
                        from: e.source,
                        to: e.target,
                        arrows: { to: { enabled: true, scaleFactor: 0.6 } },
                        dashes: isTree ? false : [5, 4],
                        color: {
                            color: isTree ? '#818cf8' : '#cbd5e1',
                            highlight: '#6366f1',
                            hover: '#6366f1',
                            opacity: isTree ? 0.9 : 0.5,
                        },
                        width: isTree ? 2.5 : 1,
                        smooth: isTree
                            ? { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.35 }
                            : { type: 'curvedCCW', roundness: 0.15 },
                        chosen: false,
                    };
                }),
            );

            const options = {
                layout: {
                    hierarchical: {
                        direction: 'UD',
                        sortMethod: 'hubsize',
                        levelSeparation: 100,
                        nodeSpacing: 200,
                        treeSpacing: 220,
                        blockShifting: true,
                        edgeMinimization: true,
                        parentCentralization: true,
                    },
                },
                physics: false,
                interaction: {
                    hover: true,
                    tooltipDelay: 100,
                    zoomView: true,
                    dragView: true,
                    zoomMin: 0.4,
                    zoomMax: 3.0,
                },
                edges: { width: 2 },
            };

            if (networkRef.current) networkRef.current.destroy();

            const net = new Network(containerRef.current, { nodes: visNodes, edges: visEdges }, options);

            const fitWithMinZoom = () => {
                net.fit({ animation: false });
                setTimeout(() => {
                    const scale = net.getScale();
                    if (scale < 0.65) {
                        net.moveTo({ scale: 0.65, animation: { duration: 350, easingFunction: 'easeInOutQuad' } });
                    }
                }, 80);
            };
            net.once('stabilizationIterationsDone', fitWithMinZoom);
            setTimeout(fitWithMinZoom, 700);
            net.on('click', handleClick);
            networkRef.current = net;
        });

        return () => {
            destroyed = true;
            networkRef.current?.destroy();
            networkRef.current = null;
        };
    }, [graph, handleClick, completedNodeIds]);

    useEffect(() => {
        if (!networkRef.current || selectedNodeId === undefined) return;
        if (selectedNodeId) networkRef.current.selectNodes([selectedNodeId]);
        else networkRef.current.unselectAll();
    }, [selectedNodeId]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
