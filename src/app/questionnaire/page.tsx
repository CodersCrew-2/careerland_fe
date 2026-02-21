'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
    const [imgLoaded, setImgLoaded] = useState(false);

    const q = QUESTIONS[idx];
    const answered = answers[idx];
    const progress = ((idx) / QUESTIONS.length) * 100;
    const isLast = idx === QUESTIONS.length - 1;

    useEffect(() => { setImgLoaded(false); }, [idx]);

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

    const select = (val: number) => {
        setAnswers(prev => ({ ...prev, [idx]: val }));
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>

            {/* Subtle blobs */}
            <div className="fixed top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="fixed bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            {/* ── LEFT: Image panel ── */}
            <div className="relative lg:w-[45%] h-[38vh] lg:h-screen overflow-hidden shrink-0">
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.div key={idx} custom={dir}
                        initial={{ x: dir === 1 ? '100%' : '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: dir === 1 ? '-40%' : '40%', opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
                        className="absolute inset-0">
                        <img
                            src={q.img}
                            alt={q.text}
                            className="w-full h-full object-cover"
                            onLoad={() => setImgLoaded(true)}
                            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
                        />
                        {/* Light gradient overlay at bottom for mobile readability */}
                        <div className="absolute inset-0 lg:hidden"
                            style={{ background: 'linear-gradient(to top, rgba(238,242,255,0.95) 0%, transparent 55%)' }} />
                        {/* Right-side fade for desktop */}
                        <div className="absolute inset-0 hidden lg:block"
                            style={{ background: 'linear-gradient(to right, transparent 55%, rgba(238,242,255,0.95) 100%)' }} />

                        {/* Category pill */}
                        <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', color: '#1e40af', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            {CATEGORY_LABEL[q.type]}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── RIGHT: Question + Options ── */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Top bar */}
                <div className="flex items-center gap-4 px-6 lg:px-10 pt-6 pb-4 shrink-0">
                    <button onClick={goBack}
                        className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shrink-0 shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest Survey</span>
                            <span className="text-[11px] font-bold text-blue-600">{idx + 1} / {QUESTIONS.length}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-blue-500"
                                animate={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }}
                                transition={{ duration: 0.35, ease: 'easeOut' }} />
                        </div>
                    </div>
                </div>

                {/* Question content */}
                <div className="flex-1 flex flex-col justify-center px-6 lg:px-10 pb-6">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.div key={idx} custom={dir}
                            initial={{ x: dir === 1 ? 50 : -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: dir === 1 ? -50 : 50, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.32, 0, 0.67, 0] }}
                            className="space-y-7 max-w-lg">

                            {/* Question */}
                            <div>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">How do you feel about this?</span>
                                <h2 className="text-[22px] lg:text-[26px] font-bold text-slate-800 leading-tight mt-2">{q.text}</h2>
                            </div>

                            {/* Emoji option buttons */}
                            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                {OPTIONS.map(opt => {
                                    const active = answered === opt.value;
                                    return (
                                        <motion.button
                                            key={opt.value}
                                            onClick={() => select(opt.value)}
                                            whileTap={{ scale: 0.9 }}
                                            whileHover={{ scale: 1.06 }}
                                            className="flex flex-col items-center gap-2 outline-none"
                                        >
                                            {/* Face icon */}
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 transition-all duration-200"
                                                style={{
                                                    filter: active ? 'drop-shadow(0 4px 12px rgba(30,58,138,0.4))' : 'none',
                                                    transform: active ? 'scale(1.12)' : 'scale(1)',
                                                }}>
                                                <FaceIcon value={opt.value} active={active} />
                                            </div>
                                            {/* Label */}
                                            <span className="text-[9px] sm:text-[10px] font-semibold text-center leading-tight"
                                                style={{ color: active ? '#1e40af' : '#94a3b8' }}>
                                                {opt.label.split(' ').map((w, i) => (
                                                    <React.Fragment key={i}>{w}{i === 0 && opt.label.split(' ').length > 1 ? <br /> : ''}</React.Fragment>
                                                ))}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Scale labels */}
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-semibold text-slate-400">Dislike</span>
                                <div className="flex-1 h-0.5 rounded-full"
                                    style={{ background: 'linear-gradient(to right, #f87171, #e2e8f0, #34d399)' }} />
                                <span className="text-[10px] font-semibold text-slate-400">Enjoy</span>
                            </div>

                            {/* Navigation buttons */}
                            <div className="flex gap-3">
                                {idx > 0 && (
                                    <button onClick={goBack}
                                        className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm">
                                        <ArrowLeft className="w-4 h-4" /> Previous
                                    </button>
                                )}
                                <motion.button
                                    onClick={goNext}
                                    disabled={answered === undefined}
                                    whileHover={answered !== undefined ? { scale: 1.01 } : {}}
                                    whileTap={answered !== undefined ? { scale: 0.98 } : {}}
                                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all"
                                    style={{
                                        background: answered !== undefined ? '#2563eb' : '#f1f5f9',
                                        color: answered !== undefined ? '#fff' : '#94a3b8',
                                        boxShadow: answered !== undefined ? '0 4px 20px rgba(37,99,235,0.35)' : 'none',
                                        cursor: answered !== undefined ? 'pointer' : 'not-allowed',
                                    }}>
                                    {isLast ? 'See My Results' : 'Next'}
                                    {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                </motion.button>
                            </div>

                            {/* Answered count hint */}
                            <p className="text-[11px] text-slate-300 text-center">
                                {Object.keys(answers).length} of {QUESTIONS.length} answered
                                {answered === undefined && ' · Select an option to continue'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
