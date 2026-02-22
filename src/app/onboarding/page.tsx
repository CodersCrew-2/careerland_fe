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

// ─── Static warm-up questions (no API needed) ────────────────
const WARMUP_QUESTIONS: Question[] = [
    {
        id: 'name',
        text: 'What should I call you?',
        input_type: 'text',
        required: true,
    },
    {
        id: 'age',
        text: 'How old are you?',
        input_type: 'number',
        required: true,
    },
];

// ─── Phases ──────────────────────────────────────────────────
type Phase = 'welcome' | 'warmup' | 'questions' | 'thankyou' | 'choice';

export default function OnboardingPage() {
    return <ProtectedRoute><OnboardingFlow /></ProtectedRoute>;
}

function OnboardingFlow() {
    const [phase, setPhase] = useState<Phase>('welcome');
    // warmup answers (name/age)
    const [warmupAnswers, setWarmupAnswers] = useState<Record<string, string | string[]>>({});
    // API-returned questions
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingQ, setLoadingQ] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, setOnboardingStep, onboardingSessionId, setOnboardingSessionId } = useAuth();
    const router = useRouter();

    // ── Call API with a query string, returns {questions} or signals "done" ──
    const callOnboardingAPI = useCallback(async (
        query: string,
        sessionId?: string,
    ): Promise<{ type: 'question'; questions: Question[] } | { type: 'result' }> => {
        const token = user?.apiToken;
        const res = await fetch('/api/onboarding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ query, sessionId }),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'API error');

        const { response, sessionId: newSessionId } = json.data;
        if (newSessionId) setOnboardingSessionId(newSessionId);

        if (response?.type === 'question') {
            return { type: 'question', questions: response.data?.questions ?? [] };
        }
        // type: "result" → roadmap generated, save it
        if (response?.type === 'result' || response?.nodes) {
            localStorage.setItem('onboarding_roadmap', JSON.stringify(response.data ?? response));
            return { type: 'result' };
        }
        throw new Error('Unknown response type from onboarding API');
    }, [user?.apiToken, setOnboardingSessionId]);

    // ── After warmup, call API with name+age to kick off AI questions ──
    const startAIQuestions = useCallback(async (wa: Record<string, string | string[]>) => {
        setLoadingQ(true);
        setError(null);
        try {
            const openingQuery = `My name is ${wa.name || 'a user'} and I am ${wa.age || '18'} years old. Please help me discover my ideal career path.`;
            const result = await callOnboardingAPI(openingQuery, onboardingSessionId ?? undefined);
            if (result.type === 'question') {
                setQuestions(result.questions);
                setPhase('questions');
            } else {
                // Unlikely on first turn, but handle it
                finishAll();
            }
        } catch (e: any) {
            setError(e.message ?? 'Something went wrong. Please try again.');
            setPhase('warmup'); // stay on warmup so user can retry
        } finally {
            setLoadingQ(false);
        }
    }, [callOnboardingAPI, onboardingSessionId]);

    // ── After each batch of AI questions is answered, send them & get more ──
    const handleQuestionsAnswered = useCallback(async (answers: Record<string, string | string[]>) => {
        // Save partial answers
        const existing = JSON.parse(localStorage.getItem('onboarding_answers') || '{}');
        localStorage.setItem('onboarding_answers', JSON.stringify({ ...existing, ...answers }));

        setLoadingQ(true);
        setError(null);
        setPhase('thankyou'); // show thankyou while loading

        try {
            // Format answers as natural language string
            const queryParts = Object.entries(answers).map(
                ([key, val]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(val) ? val.join(', ') : val}`
            );
            const query = queryParts.join('. ');

            const result = await callOnboardingAPI(query, onboardingSessionId ?? undefined);
            if (result.type === 'question' && result.questions.length > 0) {
                setQuestions(result.questions);
                setPhase('questions');
            } else {
                finishAll();
            }
        } catch (e: any) {
            setError(e.message ?? 'Something went wrong.');
            setPhase('choice'); // fallback to choice phase
        } finally {
            setLoadingQ(false);
        }
    }, [callOnboardingAPI, onboardingSessionId]);

    const finishAll = () => {
        setOnboardingStep(2);
        setTimeout(() => setPhase('choice'), 2200);
    };

    const handleChoice = (path: string) => {
        setOnboardingStep(3);
        router.push(path);
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center"
            style={{ background: '#ffffff' }}>
            {/* 4-corner blur blobs */}
            <div className="absolute top-[-8%] left-[-8%] w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)', filter: 'blur(72px)' }} />
            <div className="absolute top-[-8%] right-[-8%] w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34,168,224,0.12) 0%, transparent 70%)', filter: 'blur(72px)' }} />
            <div className="absolute bottom-[-8%] left-[-8%] w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)', filter: 'blur(72px)' }} />
            <div className="absolute bottom-[-8%] right-[-8%] w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(56,195,245,0.10) 0%, transparent 70%)', filter: 'blur(72px)' }} />

            {/* Error toast */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-[13px] font-semibold"
                        style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                        ⚠️ {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {phase === 'welcome' && (
                    <WelcomePhase key="welcome" userName={user?.name}
                        onContinue={() => setPhase('warmup')} loadingQ={false} />
                )}
                {phase === 'warmup' && (
                    <QuestionsPhase key="warmup"
                        questions={WARMUP_QUESTIONS}
                        onFinish={(wa) => { setWarmupAnswers(wa); startAIQuestions(wa); }}
                        loadingSubmit={loadingQ} />
                )}
                {phase === 'questions' && questions.length > 0 && (
                    <QuestionsPhase key={`q-${questions[0]?.id}`}
                        questions={questions}
                        onFinish={handleQuestionsAnswered}
                        loadingSubmit={loadingQ} />
                )}
                {phase === 'questions' && questions.length === 0 && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3 z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-slate-400 text-sm">Preparing your questions…</p>
                    </motion.div>
                )}
                {phase === 'thankyou' && (
                    <ThankYouPhase key="thankyou" loading={loadingQ} />
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

            {/* ── Speech bubble ABOVE mascot ── */}
            {/* drop-shadow on outer wrapper applies to the whole shape incl. tail */}
            <div className="max-w-md w-full"
                style={{ filter: 'drop-shadow(0 6px 18px rgba(99,102,241,0.13)) drop-shadow(0 1px 4px rgba(0,0,0,0.07))' }}>

                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.2 }}
                    style={{
                        position: 'relative',
                        background: '#ffffff',
                        border: '1.5px solid #e8edf3',
                        borderRadius: 24,
                        padding: '24px 28px',
                        overflow: 'visible',   /* let tail poke out */
                    }}>

                    {/* Messages */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150 }}>
                        {messages.map(({ text, bold }, i) => (
                            <AnimatePresence key={i}>
                                {visibleLines > i && (
                                    <motion.p
                                        initial={{ opacity: 0, filter: 'blur(8px)', y: 6 }}
                                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                        transition={{ duration: 0.55, ease: 'easeOut' }}
                                        style={{
                                            margin: 0,
                                            fontSize: bold ? 17 : 14,
                                            fontWeight: bold ? 700 : 400,
                                            color: bold ? '#1e293b' : '#64748b',
                                            lineHeight: 1.55,
                                        }}>
                                        {text}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        ))}

                        {/* Typing dots */}
                        <AnimatePresence>
                            {visibleLines < messages.length && visibleLines > 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ display: 'flex', gap: 5, paddingTop: 4 }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="animate-bounce"
                                            style={{ width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1', animationDelay: `${i * 0.18}s` }} />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Tail: rotated square, bottom-center, pokes out below ── */}
                    {/* Only borderBottom + borderRight shown → lower two diamond edges visible */}
                    <div style={{
                        position: 'absolute',
                        bottom: -10,          /* half sticks out, half inside */
                        left: '50%',
                        marginLeft: -10,      /* center it */
                        width: 20,
                        height: 20,
                        background: '#ffffff',
                        borderRight: '1.5px solid #e8edf3',
                        borderBottom: '1.5px solid #e8edf3',
                        transform: 'rotate(45deg)',
                    }} />
                </motion.div>
            </div>

            {/* ── Mascot video (BELOW bubble) ── */}
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
                className="shrink-0 w-48 h-48 lg:w-56 lg:h-56 mt-1 mb-2">
                <BuddyVideo src={BUDDY_GIF} />
            </motion.div>

            {/* ── CTA button ── */}
            <AnimatePresence>
                {showBtn && (
                    <motion.button
                        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        whileHover={{ y: -3, scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onContinue}
                        disabled={loadingQ}
                        className="flex items-center gap-2 text-white font-semibold text-[15px] disabled:opacity-60 mt-4"
                        style={{
                            background: '#22a8e0',
                            borderRadius: 100,
                            padding: '13px 36px',
                            letterSpacing: '0.01em',
                        }}>
                        {loadingQ
                            ? <><Loader2 className="w-4 h-4 animate-spin" />&nbsp;Setting things up&hellip;</>
                            : <>Let&apos;s get started &nbsp;<ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Phase 2: Questions ─ Duolingo-style layout ───────────────
const THINKING_GIF = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7wGLv60fSKh0RHXxWkbs1TyYLNaoDze9PuVpt';

function QuestionsPhase({ questions, onFinish, loadingSubmit = false }: {
    questions: Question[];
    onFinish: (a: Record<string, string | string[]>) => void;
    loadingSubmit?: boolean;
}) {
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [dir, setDir] = useState<1 | -1>(1);

    const q = questions[idx];
    const isLast = idx === questions.length - 1;
    const currentVal = answers[q.id];
    const hasAnswer = currentVal !== undefined && currentVal !== '' && (Array.isArray(currentVal) ? currentVal.length > 0 : true);
    const progress = ((idx + 1) / questions.length) * 100;

    const goNext = () => { if (isLast) { onFinish(answers); return; } setDir(1); setIdx(i => i + 1); };
    const goBack = () => { if (idx === 0) return; setDir(-1); setIdx(i => i - 1); };
    const skip = () => { if (isLast) { onFinish(answers); return; } setDir(1); setIdx(i => i + 1); };
    const setAnswer = (val: string | string[]) => setAnswers(prev => ({ ...prev, [q.id]: val }));
    const toggleMulti = (opt: string) => {
        const cur = (answers[q.id] as string[] | undefined) ?? [];
        setAnswer(cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt]);
    };

    const canContinue = !q.required || hasAnswer;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-10 w-full min-h-screen flex flex-col"
            style={{ background: '#ffffff' }}>

            {/* ── Progress bar (top) ── */}
            <div style={{ height: 7, background: '#f1f5f9' }}>
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#22a8e0', borderRadius: 0 }} />
            </div>

            {/* ── Main content: centered vertically ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20 pb-24 max-w-3xl mx-auto w-full">

                {/* ── Mascot + speech bubble ── */}
                <AnimatePresence mode="wait">
                    <motion.div key={idx}
                        initial={{ opacity: 0, x: dir === 1 ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: dir === 1 ? -30 : 30 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="flex items-center gap-5 mb-7 w-full">

                        {/* Mascot video */}
                        <div className="shrink-0 w-28 h-28">
                            <BuddyVideo src={THINKING_GIF} />
                        </div>

                        {/* Speech bubble — right of mascot, tail on LEFT */}
                        <div style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.07))' }} className="flex-1">
                            <div style={{
                                position: 'relative',
                                background: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: 20,
                                padding: '18px 22px',
                                overflow: 'visible',
                            }}>
                                <p style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', lineHeight: 1.5, margin: 0 }}>
                                    {q.text}
                                </p>
                                {q.required && (
                                    <span style={{ display: 'inline-block', marginTop: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#ef4444', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 99, padding: '2px 10px' }}>Required</span>
                                )}
                                {/* Left-side tail (pointing to mascot) */}
                                <div style={{
                                    position: 'absolute',
                                    top: 18, left: -10,
                                    width: 20, height: 20,
                                    background: '#ffffff',
                                    borderTop: '1.5px solid #e2e8f0',
                                    borderLeft: '1.5px solid #e2e8f0',
                                    transform: 'rotate(-45deg)',
                                }} />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ── Answer options ── */}
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.div key={`ans-${idx}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="w-full">
                        <QuestionInput q={q} value={currentVal} onChange={setAnswer} toggleMulti={toggleMulti} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Bottom bar — fixed to viewport bottom ── */}
            <div className="fixed bottom-0 left-0 right-0 z-20"
                style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9', padding: '14px 32px' }}>
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    {/* Back / Skip */}
                    <div className="flex items-center gap-4">
                        <button onClick={goBack} disabled={idx === 0}
                            className="flex items-center gap-1 text-[12px] font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </button>
                        {!q.required && (
                            <button onClick={skip}
                                className="flex items-center gap-1 text-[12px] font-semibold text-slate-300 hover:text-slate-400 transition-colors">
                                <SkipForward className="w-3.5 h-3.5" /> Skip
                            </button>
                        )}
                    </div>

                    {/* Counter */}
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.06em' }}>
                        {idx + 1} / {questions.length}
                    </span>

                    {/* Continue */}
                    <motion.button onClick={goNext}
                        disabled={!canContinue}
                        whileHover={canContinue ? { scale: 1.04 } : {}}
                        whileTap={canContinue ? { scale: 0.96 } : {}}
                        style={{
                            background: canContinue ? '#22a8e0' : '#e2e8f0',
                            color: canContinue ? '#ffffff' : '#94a3b8',
                            borderRadius: 100,
                            padding: '13px 36px',
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            cursor: canContinue ? 'pointer' : 'not-allowed',
                            border: 'none',
                            outline: 'none',
                            transition: 'background 0.18s',
                        }}>
                        {isLast
                            ? (loadingSubmit
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
                                : 'Finish ✓')
                            : 'Continue'}
                    </motion.button>
                </div>
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
    const inputBase = 'w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-[15px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm';

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
            <div className="space-y-3">
                {q.options.map((opt, i) => {
                    const active = value === opt;
                    return (
                        <motion.button key={opt} onClick={() => onChange(opt)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-left text-[15px] font-semibold transition-all"
                            style={{
                                background: active ? '#f0f9ff' : '#ffffff',
                                border: `2px solid ${active ? '#22a8e0' : '#e8edf3'}`,
                                color: active ? '#0369a1' : '#475569',
                                boxShadow: active ? '0 2px 12px rgba(34,168,224,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                            }}>
                            {/* Left indicator */}
                            <div style={{
                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                border: `2px solid ${active ? '#22a8e0' : '#cbd5e1'}`,
                                background: active ? '#22a8e0' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.18s',
                            }}>
                                {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
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
function ThankYouPhase({ loading = false }: { loading?: boolean }) {
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
                <h2 className="text-[22px] font-bold text-slate-800">
                    {loading ? 'Analysing your answers…' : 'Thank you for your time!'}
                </h2>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                    {loading
                        ? 'Hang tight while I find your best career matches.'
                        : <>I&apos;ll evaluate the results for you.<br />In the meantime, let me know more about you.</>}
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
            className="z-10 flex flex-col items-center px-6 w-full max-w-lg relative">

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
