'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TrendingUp, Flame, Star, MessageCircle, Eye, Bookmark, Search, ChevronUp, BarChart2, Zap, Globe, Award, Clock, Plus, X, ExternalLink } from 'lucide-react';
import { fetchLiveForums, RSSFeedItem } from './actions';
import { useForumStore, ForumPost } from './store';
import { useAuth } from '@/components/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
    { label: 'All', icon: Globe, color: '#6366f1' },
    { label: 'AI & Tech', icon: Zap, color: '#6366f1' },
    { label: 'Business', icon: TrendingUp, color: '#0ea5e9' },
    { label: 'Finance', icon: BarChart2, color: '#10b981' },
    { label: 'Design', icon: Star, color: '#f59e0b' },
    { label: 'General', icon: MessageCircle, color: '#8b5cf6' },
];

// Generates stable random numbers per post ID
function rand(min: number, max: number, seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
    }
    const x = Math.sin(hash++) * 10000;
    const frac = x - Math.floor(x);
    return Math.floor(frac * (max - min + 1)) + min;
}

function timeLabel(dateStr: string) {
    const minDiff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (minDiff < 1) return 'Just now';
    if (minDiff < 60) return `${minDiff}m ago`;
    if (minDiff < 1440) return `${Math.floor(minDiff / 60)}h ago`;
    return `${Math.floor(minDiff / 1440)}d ago`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ForumsPage() {
    return (
        <ProtectedRoute>
            <Layout>
                <ForumsContent />
            </Layout>
        </ProtectedRoute>
    );
}

function ForumsContent() {
    const { user } = useAuth();
    const { customPosts, addPost } = useForumStore();

    const [rssPosts, setRssPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);

    // UI state
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // Interactions
    const [voted, setVoted] = useState<Set<string>>(new Set());
    const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
    const [localVotes, setLocalVotes] = useState<Record<string, number>>({});

    useEffect(() => {
        async function load() {
            setLoading(true);
            const liveData = await fetchLiveForums();

            // Map RSS items to ForumPost structure
            const mapped: ForumPost[] = liveData.map(item => ({
                id: item.id,
                title: item.title,
                body: item.contentSnippet,
                category: item.category,
                source: item.source,
                author: item.source,
                link: item.link,
                pubDate: item.pubDate,
                votes: rand(10, 850, item.id),
                comments: rand(2, 60, item.id + "c"),
                views: rand(100, 5000, item.id + "v"),
                isCustom: false
            }));

            setRssPosts(mapped);
            setLoading(false);
        }
        load();
    }, []);

    // Merge global RSS posts with real-time local Zustand posts
    const allPosts = [...customPosts, ...rssPosts].sort((a, b) =>
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    const filtered = allPosts.filter(p => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.body.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    function toggleVote(id: string, base: number) {
        setVoted(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                setLocalVotes(lv => ({ ...lv, [id]: 0 }));
            } else {
                next.add(id);
                setLocalVotes(lv => ({ ...lv, [id]: 1 }));
            }
            return next;
        });
    }

    function toggleBookmark(id: string) {
        setBookmarked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Live Career Forums</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Real-time industry articles & community discussions</p>
                </div>

                <button
                    onClick={() => setIsPosting(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" /> Start Discussion
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search articles and discussions…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm text-slate-700 placeholder-slate-400 outline-none"
                        style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(8px)' }}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.label;
                        return (
                            <button
                                key={cat.label}
                                onClick={() => setActiveCategory(cat.label)}
                                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                                style={isActive
                                    ? { background: cat.color, color: '#fff', boxShadow: `0 2px 12px ${cat.color}40` }
                                    : { background: 'rgba(255,255,255,0.6)', color: '#64748b', border: '1px solid rgba(148,163,184,0.3)' }
                                }
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Feed List */}
            <section className="space-y-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">Fetching live articles from around the web…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm">No discussions found for this filter.</div>
                ) : (
                    filtered.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            voted={voted}
                            bookmarked={bookmarked}
                            localVotes={localVotes}
                            onVote={toggleVote}
                            onBookmark={toggleBookmark}
                        />
                    ))
                )}
            </section>

            {/* Post Modal */}
            <AnimatePresence>
                {isPosting && (
                    <PostModal
                        onClose={() => setIsPosting(false)}
                        userName={user?.name || 'Anonymous Explorer'}
                        onPost={(newPost) => {
                            addPost(newPost);
                            setIsPosting(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Components ───────────────────────────────────────────────────────────────

function PostCard({ post, voted, bookmarked, localVotes, onVote, onBookmark }: {
    post: ForumPost;
    voted: Set<string>;
    bookmarked: Set<string>;
    localVotes: Record<string, number>;
    onVote: (id: string, base: number) => void;
    onBookmark: (id: string) => void;
}) {
    const isVoted = voted.has(post.id);
    const isBookmarked = bookmarked.has(post.id);
    const displayVotes = post.votes + (localVotes[post.id] || 0);

    const catInfo = CATEGORIES.find(c => c.label === post.category) || CATEGORIES[1];

    return (
        <div
            className="rounded-3xl p-5 transition-all duration-300 hover:shadow-lg group"
            style={{
                background: post.isCustom ? 'rgba(59,130,246,0.03)' : 'rgba(255,255,255,0.62)',
                border: post.isCustom ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(255,255,255,0.6)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
        >
            <div className="flex items-start gap-4">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 min-w-[36px]">
                    <button
                        onClick={() => onVote(post.id, post.votes)}
                        className="rounded-xl p-1.5 transition-all duration-200"
                        style={isVoted
                            ? { background: 'rgba(99,102,241,0.15)', color: '#6366f1' }
                            : { color: '#94a3b8' }
                        }
                    >
                        <ChevronUp className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-bold" style={{ color: isVoted ? '#6366f1' : '#475569' }}>
                        {displayVotes >= 1000 ? `${(displayVotes / 1000).toFixed(1)}k` : displayVotes}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: post.isCustom ? '#dbeafe' : `${catInfo.color}15`, color: post.isCustom ? '#2563eb' : catInfo.color }}>
                            {post.isCustom ? <MessageCircle className="w-3 h-3" /> : <catInfo.icon className="w-3 h-3" />}
                            {post.category}
                        </span>

                        {post.isCustom && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                                Community
                            </span>
                        )}

                        {!post.isCustom && (
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-200">
                                <Globe className="w-3 h-3" /> {post.source}
                            </span>
                        )}
                    </div>

                    <a href={post.link} target="_blank" rel="noreferrer" className="block group/link">
                        <h2 className="text-base font-bold text-slate-800 leading-snug mb-1.5 group-hover/link:text-blue-600 transition-colors flex items-start gap-2">
                            {post.title}
                            {!post.isCustom && <ExternalLink className="w-3.5 h-3.5 mt-1 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />}
                        </h2>
                    </a>

                    <p className="text-sm text-slate-500 leading-relaxed max-w-3xl line-clamp-2">
                        {post.body}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-slate-800">
                                {post.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{post.author}</span>
                        </div>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />{timeLabel(post.pubDate)}
                        </span>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageCircle className="w-3.5 h-3.5" />{post.comments}
                        </span>
                        {!post.isCustom && (
                            <>
                                <span className="text-slate-300 text-xs">·</span>
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <Eye className="w-3.5 h-3.5" />{post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                                </span>
                            </>
                        )}

                        <div className="ml-auto">
                            <button
                                onClick={() => onBookmark(post.id)}
                                className="p-1.5 rounded-xl transition-all duration-200"
                                style={isBookmarked
                                    ? { color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }
                                    : { color: '#e2e8f0' }
                                }
                            >
                                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function PostModal({ onClose, onPost, userName }: { onClose: () => void, onPost: (p: any) => void, userName: string }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [cat, setCat] = useState('General');

    const submit = () => {
        if (!title.trim() || !body.trim()) return;
        onPost({
            title,
            body,
            category: cat,
            author: userName,
            source: 'CareerLand Community',
            link: '#'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/40"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-800">Start a Discussion</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Category</label>
                        <select
                            value={cat}
                            onChange={e => setCat(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
                        >
                            {CATEGORIES.slice(1).map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Title</label>
                        <input
                            placeholder="What's on your mind?"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Details</label>
                        <textarea
                            placeholder="Add context, ask a question, or share an insight..."
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={!title.trim() || !body.trim()}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                    >
                        Post Discussion
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
