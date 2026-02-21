'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/components/context/AuthContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const LOGO_URL = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7bVtR0AczHfCIdxXY6iah1sFOJokVv4nc2Tp9';

const questions = [
    { text: "Do you enjoy solving complex mathematical problems?", image: "https://picsum.photos/seed/math/600/400" },
    { text: "Are you interested in how machines and software work?", image: "https://picsum.photos/seed/tech/600/400" },
    { text: "Do you like helping people with their personal problems?", image: "https://picsum.photos/seed/help/600/400" },
    { text: "Do you enjoy creative writing or storytelling?", image: "https://picsum.photos/seed/write/600/400" },
    { text: "Are you interested in financial markets and investing?", image: "https://picsum.photos/seed/finance/600/400" },
    { text: "Do you like working with your hands to build or fix things?", image: "https://picsum.photos/seed/build/600/400" },
    { text: "Are you interested in scientific experiments and research?", image: "https://picsum.photos/seed/science/600/400" },
    { text: "Do you enjoy leading teams and managing projects?", image: "https://picsum.photos/seed/lead/600/400" },
    { text: "Are you interested in visual arts and design?", image: "https://picsum.photos/seed/art/600/400" },
    { text: "Do you like analyzing data to find trends and patterns?", image: "https://picsum.photos/seed/data/600/400" }
];

export default function OnboardingPage() {
    return (
        <ProtectedRoute>
            <OnboardingQuestions />
        </ProtectedRoute>
    );
}

function OnboardingQuestions() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
    const router = useRouter();
    const { setOnboardingStep } = useAuth();

    const handleAnswer = (answer: boolean) => {
        setAnswers({ ...answers, [currentIndex]: answer });
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleSubmit = () => {
        setOnboardingStep(2);
        router.push('/know-you-better');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Blur gradients */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            {/* Logo header */}
            <div className="flex items-center gap-2 mb-8 z-10">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/60 shadow-md">
                    <img src={LOGO_URL} alt="CareerLand" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold text-slate-700 font-display">CareerLand</span>
            </div>

            <div className="w-full max-w-md relative h-[560px] z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0, rotate: 5 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        exit={{ x: -300, opacity: 0, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute inset-0"
                    >
                        <div
                            className="h-full flex flex-col rounded-3xl border border-white/60 shadow-2xl shadow-blue-500/10 overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(24px)' }}
                        >
                            <div className="h-44 overflow-hidden relative flex-shrink-0">
                                <img
                                    src={questions[currentIndex].image}
                                    alt="Question Context"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 flex items-end p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                                    <span className="text-white font-bold uppercase tracking-widest text-xs">
                                        Question {currentIndex + 1} of {questions.length}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <h2 className="text-xl font-bold text-slate-800 leading-snug">
                                    {questions[currentIndex].text}
                                </h2>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        className="flex-1 h-20 text-lg font-semibold rounded-2xl border-2 border-red-200 text-red-500 transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:scale-[1.02] active:scale-95"
                                        onClick={() => handleAnswer(false)}
                                    >
                                        No
                                    </button>
                                    <button
                                        className="flex-1 h-20 text-lg font-semibold rounded-2xl text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                                        onClick={() => handleAnswer(true)}
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-6 py-4 border-t border-white/40">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-40 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </button>
                                {currentIndex === questions.length - 1 ? (
                                    <button onClick={handleSubmit} className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                                        Submit <Check className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={() => setCurrentIndex(currentIndex + 1)} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                        Skip <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="mt-8 flex gap-2 z-10">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                            ? "w-8 bg-blue-600"
                            : idx < currentIndex
                                ? "w-2 bg-blue-400"
                                : "w-2 bg-slate-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
