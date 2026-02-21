'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProtectedRoute from '@/components/ProtectedRoute';

// ─── RIASEC Mapping ──────────────────────────────────────────
const QUESTIONS = [
    { text: 'Build kitchen cabinets', type: 'R', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&fit=crop' },
    { text: 'Develop a new medicine', type: 'I', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80&fit=crop' },
    { text: 'Write books or plays', type: 'A', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80&fit=crop' },
    { text: 'Help people with personal or emotional problems', type: 'S', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80&fit=crop' },
    { text: 'Manage a department within a large company', type: 'E', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&fit=crop' },
    { text: 'Install software across computers on a large network', type: 'C', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80&fit=crop' },
    { text: 'Repair household appliances', type: 'R', img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=900&q=80&fit=crop' },
    { text: 'Study ways to reduce water pollution', type: 'I', img: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=900&q=80&fit=crop' },
    { text: 'Compose or arrange music', type: 'A', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80&fit=crop' },
    { text: 'Give career guidance to people', type: 'S', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80&fit=crop' },
    { text: 'Start your own business', type: 'E', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=80&fit=crop' },
    { text: 'Operate a calculator', type: 'C', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=80&fit=crop' },
    { text: 'Assemble electronic parts', type: 'R', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&fit=crop' },
    { text: 'Conduct chemical experiments', type: 'I', img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=900&q=80&fit=crop' },
    { text: 'Create special effects for movies', type: 'A', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=80&fit=crop' },
    { text: 'Perform rehabilitation therapy', type: 'S', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop' },
    { text: 'Negotiate business contracts', type: 'E', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80&fit=crop' },
    { text: 'Keep shipping and receiving records', type: 'C', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80&fit=crop' },
    { text: 'Drive a truck to deliver packages', type: 'R', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80&fit=crop' },
    { text: 'Examine blood samples using a microscope', type: 'I', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=900&q=80&fit=crop' },
    { text: 'Paint sets for plays', type: 'A', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80&fit=crop' },
    { text: 'Do volunteer work at a non-profit organization', type: 'S', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80&fit=crop' },
    { text: 'Market a new line of clothing', type: 'E', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80&fit=crop' },
    { text: 'Inventory supplies using a hand-held computer', type: 'C', img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&q=80&fit=crop' },
    { text: 'Test the quality of parts before shipment', type: 'R', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80&fit=crop' },
    { text: 'Develop a way to better predict the weather', type: 'I', img: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=900&q=80&fit=crop' },
    { text: 'Write scripts for movies or television shows', type: 'A', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80&fit=crop' },
    { text: 'Teach a high-school class', type: 'S', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80&fit=crop' },
    { text: 'Sell merchandise at a department store', type: 'E', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80&fit=crop' },
    { text: 'Stamp, sort, and distribute mail for an organization', type: 'C', img: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=900&q=80&fit=crop' },
];

function computeRIASEC(answers: Record<number, number>) {
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    QUESTIONS.forEach((q, i) => { scores[q.type] += answers[i] ?? 3; });
    return scores;
}

// ─── SVG Emoji Faces ─────────────────────────────────────────
function FaceIcon({ value, active }: { value: number; active: boolean }) {
    const bg = active ? '#1e3a8a' : '#e2e8f0';
    const stroke = active ? '#ffffff' : '#94a3b8';
    const fill = active ? '#ffffff' : '#94a3b8';

    const faces: Record<number, React.ReactNode> = {
        1: ( // Strongly Dislike — X eyes, grimace
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect width="48" height="48" rx="12" fill={bg} />
                {/* X left eye */}
                <line x1="14" y1="16" x2="20" y2="22" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="16" x2="14" y2="22" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
                {/* X right eye */}
                <line x1="28" y1="16" x2="34" y2="22" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="34" y1="16" x2="28" y2="22" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
                {/* Grimace — flat w/ teeth suggestion */}
                <path d="M15 33 Q24 29 33 33" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
        ),
        2: ( // Dislike — sad eyes, downturned mouth
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect width="48" height="48" rx="12" fill={bg} />
                <circle cx="17" cy="19" r="2.5" fill={fill} />
                <circle cx="31" cy="19" r="2.5" fill={fill} />
                <path d="M15 33 Q24 28 33 33" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
        ),
        3: ( // Unsure — neutral, straight mouth
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect width="48" height="48" rx="12" fill={bg} />
                <circle cx="17" cy="19" r="2.5" fill={fill} />
                <circle cx="31" cy="19" r="2.5" fill={fill} />
                <line x1="15" y1="32" x2="33" y2="32" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        ),
        4: ( // Like — dot eyes, gentle smile
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect width="48" height="48" rx="12" fill={bg} />
                <circle cx="17" cy="19" r="2.5" fill={fill} />
                <circle cx="31" cy="19" r="2.5" fill={fill} />
                <path d="M15 29 Q24 36 33 29" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
        ),
        5: ( // Strongly Like — crescent squinting eyes, big grin with teeth
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect width="48" height="48" rx="12" fill={bg} />
                {/* Squinting crescent eyes */}
                <path d="M13 20 Q17 15 21 20" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M27 20 Q31 15 35 20" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Big open smile */}
                <path d="M14 28 Q24 38 34 28" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Teeth lines */}
                <line x1="19" y1="28" x2="19" y2="32" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
                <line x1="24" y1="28" x2="24" y2="33" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
                <line x1="29" y1="28" x2="29" y2="32" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    };

    return faces[value] ?? null;
}

const OPTIONS = [
    { value: 1, label: 'Strongly Dislike' },
    { value: 2, label: 'Dislike' },
    { value: 3, label: 'Unsure' },
    { value: 4, label: 'Like' },
    { value: 5, label: 'Strongly Like' },
];

const CATEGORY_LABEL: Record<string, string> = {
    R: 'Realistic', I: 'Investigative', A: 'Artistic',
    S: 'Social', E: 'Enterprising', C: 'Conventional',
};

export default function QuestionnairePage() {
    return <ProtectedRoute><QuestionnaireContent /></ProtectedRoute>;
}

function QuestionnaireContent() {
    const router = useRouter();
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [dir, setDir] = useState<1 | -1>(1);

    const q = QUESTIONS[idx];
    const answered = answers[idx];
    const progress = ((idx + 1) / QUESTIONS.length) * 100;
    const isLast = idx === QUESTIONS.length - 1;

    const goNext = () => {
        if (answered === undefined) return;
        if (isLast) {
            const scores = computeRIASEC(answers);
            localStorage.setItem('riasec_scores', JSON.stringify(scores));
            localStorage.setItem('riasec_completed', 'true');
            router.push('/interests-summary');
        } else {
            setDir(1);
            setIdx(i => i + 1);
        }
    };

    const goBack = () => {
        if (idx === 0) { router.push('/know-you-better'); return; }
        setDir(-1);
        setIdx(i => i - 1);
    };

    const select = (val: number) => setAnswers(prev => ({ ...prev, [idx]: val }));
    const canContinue = answered !== undefined;

    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden"
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

            {/* Cyan progress bar */}
            <div style={{ height: 7, background: '#f1f5f9', position: 'relative', zIndex: 10 }}>
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#22a8e0' }} />
            </div>

            {/* Main content — vertically centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20 pb-24 max-w-3xl mx-auto w-full z-10">

                {/* Mascot + speech bubble */}
                <AnimatePresence mode="wait">
                    <motion.div key={idx}
                        initial={{ opacity: 0, x: dir === 1 ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: dir === 1 ? -30 : 30 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="flex items-center gap-5 mb-8 w-full">

                        {/* Mascot */}
                        <div className="shrink-0 w-28 h-28">
                            <video autoPlay loop muted playsInline className="w-full h-full object-contain">
                                <source src="https://uafn22926g.ufs.sh/f/F8enbsMKbqz7wGLv60fSKh0RHXxWkbs1TyYLNaoDze9PuVpt" />
                            </video>
                        </div>

                        {/* Speech bubble */}
                        <div style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.07))' }} className="flex-1">
                            <div style={{
                                position: 'relative',
                                background: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: 20,
                                padding: '18px 22px',
                                overflow: 'visible',
                            }}>
                                {/* Category chip */}
                                <span style={{
                                    display: 'inline-block', marginBottom: 8,
                                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.07em', color: '#22a8e0',
                                    background: '#f0f9ff', border: '1px solid #e0f2fe',
                                    borderRadius: 99, padding: '2px 10px',
                                }}>
                                    {CATEGORY_LABEL[q.type]}
                                </span>
                                <p style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', lineHeight: 1.5, margin: 0 }}>
                                    Would you enjoy to — <em style={{ fontStyle: 'normal', color: '#0369a1' }}>{q.text.toLowerCase()}</em>?
                                </p>
                                {/* Left-side tail */}
                                <div style={{
                                    position: 'absolute',
                                    top: 20, left: -10,
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

                {/* Emoji options */}
                <AnimatePresence mode="wait">
                    <motion.div key={`opt-${idx}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                        className="w-full">

                        {/* Scale hint */}
                        <div className="flex items-center gap-3 mb-5">
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#f87171' }}>Strongly Dislike</span>
                            <div className="flex-1 h-0.5 rounded-full"
                                style={{ background: 'linear-gradient(to right, #fca5a5, #e2e8f0, #6ee7b7)' }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981' }}>Strongly Like</span>
                        </div>

                        {/* 5 face buttons */}
                        <div className="grid grid-cols-5 gap-3">
                            {OPTIONS.map((opt, i) => {
                                const active = answered === opt.value;
                                return (
                                    <motion.button key={opt.value}
                                        onClick={() => select(opt.value)}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.08, y: -3 }}
                                        whileTap={{ scale: 0.92 }}
                                        className="flex flex-col items-center gap-2.5 outline-none">
                                        <div style={{
                                            width: 64, height: 64,
                                            transition: 'all 0.2s',
                                            filter: active ? 'drop-shadow(0 4px 14px rgba(34,168,224,0.5))' : 'none',
                                            transform: active ? 'scale(1.15)' : 'scale(1)',
                                        }}>
                                            <FaceIcon value={opt.value} active={active} />
                                        </div>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700,
                                            color: active ? '#0369a1' : '#94a3b8',
                                            textAlign: 'center', lineHeight: 1.3,
                                        }}>
                                            {opt.label.split(' ').map((w, i2) => (
                                                <React.Fragment key={i2}>{w}{i2 === 0 && opt.label.split(' ').length > 1 ? <br /> : ''}</React.Fragment>
                                            ))}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Answered hint */}
                        <p style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', marginTop: 20 }}>
                            {Object.keys(answers).length} of {QUESTIONS.length} answered
                            {!canContinue && ' · Select an option to continue'}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Fixed bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 z-20"
                style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9', padding: '14px 32px' }}>
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={goBack}
                        className="flex items-center gap-1 text-[12px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.06em' }}>
                        {idx + 1} / {QUESTIONS.length}
                    </span>

                    <motion.button onClick={goNext}
                        disabled={!canContinue}
                        whileHover={canContinue ? { scale: 1.04 } : {}}
                        whileTap={canContinue ? { scale: 0.96 } : {}}
                        style={{
                            background: canContinue ? '#22a8e0' : '#e2e8f0',
                            color: canContinue ? '#ffffff' : '#94a3b8',
                            borderRadius: 100,
                            padding: '11px 32px',
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            cursor: canContinue ? 'pointer' : 'not-allowed',
                            border: 'none', outline: 'none',
                            transition: 'background 0.18s',
                        }}>
                        {isLast ? 'See Results ✓' : 'Continue'}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

