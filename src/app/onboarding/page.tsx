'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, SkipForward, Check, Loader2, FileText, UserCheck, PenTool } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/components/context/AuthContext';

// ─── GIF URLs ────────────────────────────────────────────────
const BUDDY_GIF = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7o7bGfI6LEJPzqR8WfsIC0u5TSBvU2lrxtVhp'; // hi wave
const THANKYOU_GIF = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7IPghd4VQP2S9oVhF75KXjdRvasrzcAyi1uwt'; // search

// ─── Types ───────────────────────────────────────────────────
interface Question {
    id: string;
    text: string;
    input_type: 'text' | 'number' | 'radio' | 'dropdown' | 'multiselect';
    options?: string[];
    required: boolean;
    image_keyword?: string;
}

// Unsplash image per keyword
function questionImg(keyword?: string) {
    const kw = keyword || 'career';
    return `https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=900&q=80&fit=crop&crop=entropy&auto=format&ixlib=rb-4.0.3`;
}

// Better curated images per common keywords
const KEYWORD_IMGS: Record<string, string> = {
    portrait: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=900&q=80&fit=crop',
    calendar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=900&q=80&fit=crop',
    graduation: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80&fit=crop',
    workplace: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&fit=crop',
    inspiration: 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=900&q=80&fit=crop',
    office: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80&fit=crop',
    strength: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=80&fit=crop',
    goal: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80&fit=crop',
    technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&fit=crop',
    science: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80&fit=crop',
    art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80&fit=crop',
    default: 'https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=900&q=80&fit=crop',
};

function getImg(kw?: string) {
    if (!kw) return KEYWORD_IMGS.default;
    return KEYWORD_IMGS[kw.toLowerCase()] ?? KEYWORD_IMGS.default;
}

// ─── Phases ──────────────────────────────────────────────────
type Phase = 'welcome' | 'questions' | 'thankyou' | 'choice';

export default function OnboardingPage() {
    return <ProtectedRoute><OnboardingFlow /></ProtectedRoute>;
}

function OnboardingFlow() {
    const [phase, setPhase] = useState<Phase>('welcome');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingQ, setLoadingQ] = useState(false);
    const { user, setOnboardingStep } = useAuth();
    const router = useRouter();

    // On mount: load questions in background while user sees welcome
    useEffect(() => {
        setLoadingQ(true);
        fetch('/api/onboarding-questions')
            .then(r => r.json())
            .then(data => { setQuestions(data); setLoadingQ(false); })
            .catch(() => setLoadingQ(false));
    }, []);

    const startQuestions = () => {
        setPhase('questions');
    };

    const finishQuestions = (answers: Record<string, string | string[]>) => {
        // Save answers
        localStorage.setItem('onboarding_answers', JSON.stringify(answers));
        setOnboardingStep(2);
        setPhase('thankyou');
        // Auto-advance to choice after 2s
        setTimeout(() => setPhase('choice'), 2200);
    };

    const handleChoice = (path: string) => {
        setOnboardingStep(3);
        router.push(path);
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center"
            style={{ background: '#ffffff' }}>
            {/* Subtle blue blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(100px)' }} />

            <AnimatePresence mode="wait">
                {phase === 'welcome' && (
                    <WelcomePhase key="welcome" userName={user?.name} onContinue={startQuestions} loadingQ={loadingQ} />
                )}
                {phase === 'questions' && questions.length > 0 && (
                    <QuestionsPhase key="questions" questions={questions} onFinish={finishQuestions} />
                )}
                {phase === 'questions' && questions.length === 0 && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3 z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-slate-400 text-sm">Preparing your questions…</p>
                    </motion.div>
                )}
                {phase === 'thankyou' && (
                    <ThankYouPhase key="thankyou" />
                )}
                {phase === 'choice' && (
                    <ChoicePhase key="choice" onChoice={handleChoice} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Reusable video component ────────────────────────────────
function BuddyVideo({ src, className }: { src: string; className?: string }) {
    return (
        <video autoPlay loop muted playsInline
            className={className ?? 'w-full h-full object-contain'}
            style={{ background: 'transparent' }}>
            <source src={src} />
        </video>
    );
}

// ─── Phase 1: Welcome ─────────────────────────────────────────
function WelcomePhase({ userName, onContinue, loadingQ }: { userName?: string; onContinue: () => void; loadingQ: boolean }) {
    const messages = [
        { text: `Welcome to CareerLand${userName ? `, ${userName}` : ''}! 👋`, bold: true },
        { text: "I'm your Career Buddy.", bold: true },
        { text: "I'll help you discover the perfect career path — tailored just for you.", bold: false },
        { text: "First, let me get to know you a little better.", bold: false },
    ];
    const [visibleLines, setVisibleLines] = useState(0);
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        const timers = messages.map((_, i) =>
            setTimeout(() => setVisibleLines(v => Math.max(v, i + 1)), 600 + i * 1000)
        );
        const btnTimer = setTimeout(() => setShowBtn(true), 600 + messages.length * 1000 + 400);
        return () => { timers.forEach(clearTimeout); clearTimeout(btnTimer); };
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 lg:px-16 py-10">

            {/* ── Speech bubble with bottom-left tail (ABOVE mascot) ── */}
            <div className="relative max-w-md w-full mb-1">

                {/* Bubble body */}
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.2 }}
                    className="relative rounded-3xl px-7 py-6 space-y-3 min-h-[150px]"
                    style={{
                        background: '#ffffff',
                        boxShadow: '0 4px 32px rgba(99,102,241,0.10), 0 1px 8px rgba(0,0,0,0.06)',
                        border: '1.5px solid #e2e8f0',
                    }}>
                    {messages.map(({ text, bold }, i) => (
                        <AnimatePresence key={i}>
                            {visibleLines > i && (
                                <motion.p
                                    initial={{ opacity: 0, filter: 'blur(8px)', y: 6 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.55, ease: 'easeOut' }}
                                    className={bold
                                        ? 'text-[17px] font-bold text-slate-800 leading-snug'
                                        : 'text-[14px] text-slate-500 leading-relaxed'
                                    }>
                                    {text}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    ))}

                    {/* Typing dots */}
                    <AnimatePresence>
                        {visibleLines < messages.length && visibleLines > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex gap-1 pt-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="rounded-full bg-slate-300 animate-bounce"
                                        style={{ width: 8, height: 8, animationDelay: `${i * 0.18}s` }} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Speech bubble tail — bottom-left triangle */}
                    {/* Shadow layer */}
                    <div style={{
                        position: 'absolute', bottom: -13, left: 28,
                        width: 0, height: 0,
                        borderLeft: '14px solid transparent',
                        borderTop: '14px solid #d8dfe8',
                    }} />
                    {/* White fill layer on top */}
                    <div style={{
                        position: 'absolute', bottom: -11, left: 29,
                        width: 0, height: 0,
                        borderLeft: '13px solid transparent',
                        borderTop: '13px solid #ffffff',
                    }} />
                </motion.div>
            </div>

            {/* ── Mascot video (BELOW bubble) ── */}
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
                className="shrink-0 w-36 h-36 lg:w-44 lg:h-44">
                <BuddyVideo src={BUDDY_GIF} />
            </motion.div>

            {/* ── CTA button ── */}
            <AnimatePresence>
                {showBtn && (
                    <motion.button
                        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5 }}
                        onClick={onContinue}
                        disabled={loadingQ}
                        className="mt-6 flex items-center gap-2.5 px-10 py-4 rounded-2xl text-[15px] font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 32px rgba(99,102,241,0.45)' }}>
                        {loadingQ
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting things up&hellip;</>
                            : <>Let&apos;s get started <ArrowRight className="w-5 h-5" /></>}
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Phase 2: Questions ───────────────────────────────────────
function QuestionsPhase({ questions, onFinish }: { questions: Question[]; onFinish: (a: Record<string, string | string[]>) => void }) {
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [dir, setDir] = useState<1 | -1>(1);
    const [imgLoaded, setImgLoaded] = useState(false);

    const q = questions[idx];
    const isLast = idx === questions.length - 1;
    const currentVal = answers[q.id];
    const hasAnswer = currentVal !== undefined && currentVal !== '' && (Array.isArray(currentVal) ? currentVal.length > 0 : true);
    const progress = ((idx + 1) / questions.length) * 100;

    useEffect(() => { setImgLoaded(false); }, [idx]);

    const goNext = () => {
        if (isLast) { onFinish(answers); return; }
        setDir(1); setIdx(i => i + 1);
    };
    const goBack = () => {
        if (idx === 0) return;
        setDir(-1); setIdx(i => i - 1);
    };
    const skip = () => {
        if (isLast) { onFinish(answers); return; }
        setDir(1); setIdx(i => i + 1);
    };

    const setAnswer = (val: string | string[]) =>
        setAnswers(prev => ({ ...prev, [q.id]: val }));

    const toggleMulti = (opt: string) => {
        const cur = (answers[q.id] as string[] | undefined) ?? [];
        setAnswer(cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt]);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-10 w-full min-h-screen flex flex-col lg:flex-row">

            {/* ── LEFT: Image ── */}
            <div className="relative lg:w-[42%] h-[35vh] lg:h-screen overflow-hidden shrink-0">
                <AnimatePresence mode="wait">
                    <motion.div key={idx}
                        initial={{ x: dir === 1 ? '100%' : '-100%' }} animate={{ x: 0 }}
                        exit={{ x: dir === 1 ? '-35%' : '35%', opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.32, 0, 0.67, 0] }}
                        className="absolute inset-0">
                        <img src={getImg(q.image_keyword)} alt={q.text}
                            className="w-full h-full object-cover"
                            onLoad={() => setImgLoaded(true)}
                            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s' }} />
                        <div className="absolute inset-0 lg:hidden"
                            style={{ background: 'linear-gradient(to top, rgba(238,242,255,0.96) 0%, transparent 50%)' }} />
                        <div className="absolute inset-0 hidden lg:block"
                            style={{ background: 'linear-gradient(to right, transparent 50%, rgba(238,242,255,0.98) 100%)' }} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── RIGHT: Question form ── */}
            <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 pt-6 lg:pt-0 pb-8">
                {/* Top bar */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={goBack} disabled={idx === 0}
                        className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all disabled:opacity-30 shadow-sm shrink-0">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Getting to know you</span>
                            <span className="text-[11px] font-bold text-blue-600">{idx + 1} / {questions.length}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-blue-500"
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.35, ease: 'easeOut' }} />
                        </div>
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.div key={idx} custom={dir}
                        initial={{ x: dir === 1 ? 40 : -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: dir === 1 ? -40 : 40, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                        className="space-y-6 max-w-lg">

                        {/* Required pill */}
                        <div className="flex items-center gap-2">
                            {q.required && (
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                    style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5' }}>
                                    Required
                                </span>
                            )}
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
                                {q.input_type.replace('_', ' ')}
                            </span>
                        </div>

                        <h2 className="text-[22px] lg:text-[26px] font-bold text-slate-800 leading-snug">{q.text}</h2>

                        {/* Input based on type */}
                        <QuestionInput q={q} value={currentVal} onChange={setAnswer} toggleMulti={toggleMulti} />

                        {/* Navigation */}
                        <div className="flex gap-3 pt-2">
                            {!q.required && (
                                <button onClick={skip}
                                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
                                    <SkipForward className="w-3.5 h-3.5" /> Skip
                                </button>
                            )}
                            <motion.button onClick={goNext}
                                disabled={q.required && !hasAnswer}
                                whileHover={!q.required || hasAnswer ? { scale: 1.01 } : {}}
                                whileTap={!q.required || hasAnswer ? { scale: 0.98 } : {}}
                                className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
                                style={{
                                    background: (q.required && !hasAnswer) ? '#f1f5f9' : '#2563eb',
                                    color: (q.required && !hasAnswer) ? '#94a3b8' : '#fff',
                                    boxShadow: (q.required && !hasAnswer) ? 'none' : '0 4px 20px rgba(37,99,235,0.35)',
                                    cursor: (q.required && !hasAnswer) ? 'not-allowed' : 'pointer',
                                }}>
                                {isLast ? 'Finish' : 'Next Question'}
                                {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─── Input renderer ───────────────────────────────────────────
function QuestionInput({ q, value, onChange, toggleMulti }: {
    q: Question;
    value: string | string[] | undefined;
    onChange: (v: string | string[]) => void;
    toggleMulti: (opt: string) => void;
}) {
    const inputBase = 'w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-[14px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm';

    if (q.input_type === 'text') {
        return (
            <input type="text" value={(value as string) ?? ''} onChange={e => onChange(e.target.value)}
                placeholder="Type your answer…" className={inputBase} />
        );
    }

    if (q.input_type === 'number') {
        return (
            <input type="number" value={(value as string) ?? ''} onChange={e => onChange(e.target.value)}
                placeholder="Enter a number…" className={`${inputBase} w-40`} min={1} max={120} />
        );
    }

    if (q.input_type === 'radio' && q.options) {
        return (
            <div className="space-y-2">
                {q.options.map(opt => {
                    const active = value === opt;
                    return (
                        <motion.button key={opt} onClick={() => onChange(opt)}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left text-[13px] font-medium transition-all"
                            style={{
                                borderColor: active ? '#3b82f6' : '#e2e8f0',
                                background: active ? '#eff6ff' : '#fff',
                                color: active ? '#1e40af' : '#475569',
                            }}>
                            <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                                style={{ borderColor: active ? '#3b82f6' : '#cbd5e1', background: active ? '#3b82f6' : 'transparent' }}>
                                {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            {opt}
                        </motion.button>
                    );
                })}
            </div>
        );
    }

    if (q.input_type === 'dropdown' && q.options) {
        return (
            <select value={(value as string) ?? ''} onChange={e => onChange(e.target.value)}
                className={inputBase}>
                <option value="">— Select an option —</option>
                {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        );
    }

    if (q.input_type === 'multiselect' && q.options) {
        const selected = (value as string[]) ?? [];
        return (
            <div className="flex flex-wrap gap-2">
                {q.options.map(opt => {
                    const active = selected.includes(opt);
                    return (
                        <motion.button key={opt} onClick={() => toggleMulti(opt)}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl border-2 text-[12px] font-semibold transition-all"
                            style={{
                                borderColor: active ? '#3b82f6' : '#e2e8f0',
                                background: active ? '#eff6ff' : '#fff',
                                color: active ? '#1e40af' : '#64748b',
                            }}>
                            {active && <Check className="w-3 h-3 inline mr-1 mb-0.5" />}
                            {opt}
                        </motion.button>
                    );
                })}
            </div>
        );
    }

    return null;
}

// ─── Phase 3: Thank You ───────────────────────────────────────
function ThankYouPhase() {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 flex flex-col items-center text-center gap-5 px-6 max-w-sm">
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                className="w-36 h-36">
                <BuddyVideo src={THANKYOU_GIF} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="space-y-2">
                <h2 className="text-[22px] font-bold text-slate-800">Thank you for your time!</h2>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                    I'll evaluate the results for you.<br />
                    In the meantime, let me know more about you.
                </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex gap-1.5">
                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />)}
            </motion.div>
        </motion.div>
    );
}

// ─── Phase 4: Choice ─────────────────────────────────────────
function ChoicePhase({ onChoice }: { onChoice: (path: string) => void }) {
    const choices = [
        { label: 'Questionnaire', sub: '30 interest questions', icon: FileText, accent: '#3b82f6', path: '/questionnaire' },
        { label: 'Counsellor', sub: 'Chat with an expert', icon: UserCheck, accent: '#6366f1', path: '/counsellor' },
        { label: 'Fill Data', sub: 'Enter RIASEC scores', icon: PenTool, accent: '#10b981', path: '/fill-data' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="z-10 flex flex-col items-center px-6 w-full max-w-lg">

            {/* GIF */}
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="w-40 h-40 mb-7">
                <BuddyVideo src={THANKYOU_GIF} />
            </motion.div>

            {/* Heading */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center mb-9 space-y-1.5">
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">One last thing</p>
                <h2 className="text-[24px] font-bold text-slate-800 leading-snug">
                    First, let me get to know<br />you a little better.
                </h2>
                <p className="text-[13px] text-slate-400">How would you like to continue?</p>
            </motion.div>

            {/* 3 buttons — horizontal row */}
            <div className="flex gap-3 w-full">
                {choices.map(({ label, sub, icon: Icon, accent, path }, i) => (
                    <motion.button key={label}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28 + i * 0.09, type: 'spring', stiffness: 260, damping: 22 }}
                        whileHover={{ y: -6, scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChoice(path)}
                        className="flex-1 flex flex-col items-center gap-2.5 pt-6 pb-5 px-3 rounded-3xl outline-none group cursor-pointer"
                        style={{
                            background: 'rgba(255,255,255,0.93)',
                            border: `1.5px solid ${accent}30`,
                            boxShadow: `0 3px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
                            backdropFilter: 'blur(16px)',
                            transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
                        }}>
                        {/* Icon bubble */}
                        <div className="rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                            style={{
                                width: 52, height: 52,
                                background: `linear-gradient(135deg, ${accent}1a, ${accent}08)`,
                                border: `2px solid ${accent}35`,
                            }}>
                            <Icon style={{ color: accent, width: 24, height: 24 }} />
                        </div>
                        {/* Label */}
                        <p className="text-[13px] font-bold text-slate-700 leading-tight text-center">{label}</p>
                        {/* Sub */}
                        <p className="text-[10px] text-slate-400 leading-tight text-center px-1 pb-1">{sub}</p>
                    </motion.button>
                ))}
            </div>

            {/* Skip */}
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                onClick={() => onChoice('/careers')}
                className="mt-6 text-[12px] text-slate-400 hover:text-slate-600 transition-colors font-medium flex items-center gap-1.5">
                <SkipForward className="w-3.5 h-3.5" /> Skip for now
            </motion.button>
        </motion.div>
    );
}
