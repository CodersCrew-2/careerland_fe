'use client';

import React, { useState } from 'react';
import RoadmapGraph from './RoadmapGraph';
import NodeSidebar from './NodeSidebar';
import ProgressBar from './ProgressBar';
import { useProgress } from './useProgress';
import type { RoadmapGraph as RoadmapGraphType, RoadmapNode } from './types';
import { Sparkles } from 'lucide-react';

export default function RoadmapViewer({
    graph,
    onRegenerate,
}: {
    graph: RoadmapGraphType;
    onRegenerate?: () => void;
}) {
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
    const { toggleResource, nodeCompleted, isResourceDone } = useProgress(graph.title);

    // -- overall progress --
    const totalResources = graph.nodes.reduce((sum, n) => sum + (n.resources?.length || 0), 0);
    const totalCompleted = graph.nodes.reduce((sum, n) => sum + nodeCompleted(n.id), 0);
    const overallPercent = totalResources > 0 ? (totalCompleted / totalResources) * 100 : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f1117', borderRadius: 16, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: '#1a1d27', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#e1e4ed', fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                    Roadmap <span style={{ color: '#6c63ff' }}>Gen</span>
                </div>
                <span style={{ color: '#8b90a5', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {graph.title}
                </span>

                {/* Overall progress bar in header */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, minWidth: 160, maxWidth: 240 }}>
                    <ProgressBar percent={overallPercent} variant="dark" height={5} />
                </div>

                {onRegenerate && (
                    <button
                        onClick={onRegenerate}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
                            color: '#a5b4ff', borderRadius: 8, padding: '6px 12px',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s', flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.15)'; }}
                    >
                        <Sparkles style={{ width: 13, height: 13 }} />
                        Regenerate
                    </button>
                )}
            </div>

            {/* Body: left list + main graph canvas */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {/* Left node list */}
                <div style={{ width: 260, minWidth: 260, background: '#1a1d27', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#8b90a5', fontWeight: 600 }}>Nodes</span>
                        <span style={{ background: '#242836', color: '#8b90a5', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                            {graph.nodes.length}
                        </span>
                    </div>
                    <ul style={{ listStyle: 'none', overflowY: 'auto', flex: 1, padding: '6px 0', margin: 0 }}>
                        {graph.nodes.map(node => {
                            const nodeTotalRes = node.resources?.length || 0;
                            const nodeCompletedRes = nodeCompleted(node.id);
                            const nodePercent = nodeTotalRes > 0 ? (nodeCompletedRes / nodeTotalRes) * 100 : 0;

                            return (
                                <li
                                    key={node.id}
                                    onClick={() => setSelectedNode(node)}
                                    style={{
                                        padding: '10px 18px',
                                        cursor: 'pointer',
                                        borderLeft: `3px solid ${selectedNode?.id === node.id ? '#6c63ff' : 'transparent'}`,
                                        background: selectedNode?.id === node.id ? '#242836' : 'transparent',
                                        transition: 'all 0.12s',
                                    }}
                                    onMouseEnter={e => { if (selectedNode?.id !== node.id) e.currentTarget.style.background = '#1e2130'; }}
                                    onMouseLeave={e => { if (selectedNode?.id !== node.id) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: '#e1e4ed', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</div>
                                        {nodeTotalRes > 0 && (
                                            <span style={{
                                                fontSize: 9,
                                                fontWeight: 700,
                                                color: nodePercent === 100 ? '#4ade80' : '#8b90a5',
                                                flexShrink: 0,
                                                fontVariantNumeric: 'tabular-nums',
                                            }}>
                                                {Math.round(nodePercent)}%
                                            </span>
                                        )}
                                    </div>
                                    {/* Mini progress bar per node */}
                                    {nodeTotalRes > 0 && (
                                        <div style={{ marginBottom: 6 }}>
                                            <ProgressBar percent={nodePercent} variant="dark" height={3} showLabel={false} />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 10, color: '#8b90a5' }}>
                                        <span style={{
                                            padding: '1px 5px', borderRadius: 3, fontWeight: 600, textTransform: 'uppercase',
                                            background: node.difficulty === 'beginner' ? 'rgba(22,163,106,0.15)' : node.difficulty === 'intermediate' ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: node.difficulty === 'beginner' ? '#4ade80' : node.difficulty === 'intermediate' ? '#fbbf24' : '#f87171',
                                        }}>
                                            {node.difficulty}
                                        </span>
                                        <span>{node.estimated_time}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Graph canvas */}
                <div style={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden' }}>
                    <RoadmapGraph graph={graph} onNodeClick={setSelectedNode} />
                </div>
            </div>

            {/* Node detail drawer */}
            <NodeSidebar
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                isResourceDone={isResourceDone}
                onToggleResource={toggleResource}
                nodeCompleted={nodeCompleted}
            />
        </div>
    );
}
