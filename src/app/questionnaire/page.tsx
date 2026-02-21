'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/components/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

const questions = [
    "Build kitchen cabinets",
    "Develop a new medicine",
    "Write books or plays",
    "Help people with personal or emotional problems",
    "Manage a department within a large company",
    "Install software across computers on a large network",
    "Repair household appliances",
    "Study ways to reduce water pollution",
    "Compose or arrange music",
    "Give career guidance to people"
];

const options = [
    { value: 1, label: "Strongly Dislike", emoji: "😖" },
    { value: 2, label: "Dislike", emoji: "☹️" },
    { value: 3, label: "Unsure", emoji: "😐" },
    { value: 4, label: "Like", emoji: "🙂" },
    { value: 5, label: "Strongly Like", emoji: "😃" }
];

export default function QuestionnairePage() {
    return (
        <ProtectedRoute>
            <Questionnaire />
        </ProtectedRoute>
    );
}

function Questionnaire() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isAnimating, setIsAnimating] = useState(false);

    const handleOptionSelect = (value: number) => {
        if (isAnimating) return;
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: value
        }));

        setIsAnimating(true);
        // Auto-advance after a short delay for better UX
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                router.push('/career-suggestions');
            }
            setIsAnimating(false);
        }, 400);
    };

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                router.push('/career-suggestions');
            }
            setIsAnimating(false);
        }, 200);
    };

    const handleBack = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            } else {
                router.push('/know-you-better');
            }
            setIsAnimating(false);
        }, 200);
    };

    const currentAnswer = answers[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Subtle Blue Blur Gradients */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

            {/* Mobile-view Glassmorphic Container */}
            <Card className="w-full max-w-[400px] min-h-[640px] flex flex-col shadow-2xl border border-white/60 backdrop-blur-2xl rounded-[2.5rem] relative z-10 overflow-hidden transition-all duration-300" style={{ background: 'rgba(255,255,255,0.55)' }}>
                {/* Minimal Progress Bar */}
                <div className="w-full h-1.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div
                        className="bg-blue-600 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <CardHeader className="pt-6 pb-2 px-6 flex-shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-slate-700"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="text-xs font-semibold tracking-widest uppercase text-blue-600 opacity-80 px-3 py-1 bg-blue-500/10 rounded-full">
                            {currentQuestionIndex + 1} / {questions.length}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-6 py-4 flex-1 flex flex-col justify-center">
                    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                        <div className="mb-10 text-center space-y-3">
                            <span className="inline-block p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                                {questions[currentQuestionIndex]}
                            </h3>
                            <p className="text-sm text-slate-500">
                                How much would you enjoy this?
                            </p>
                        </div>

                        <div className="grid grid-cols-5 gap-2 sm:gap-3">
                            {options.map((option) => {
                                const isSelected = currentAnswer === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleOptionSelect(option.value)}
                                        className={cn(
                                            "group flex flex-col items-center justify-center p-3 sm:py-4 rounded-2xl transition-all duration-300 outline-none",
                                            isSelected
                                                ? "bg-blue-600/10 border-2 border-blue-500 shadow-sm scale-105"
                                                : "border-2 border-transparent hover:border-black/5 hover:scale-105"
                                        )}
                                        style={!isSelected ? { background: 'rgba(255,255,255,0.5)' } : {}}
                                    >
                                        <span className={cn(
                                            "text-3xl sm:text-4xl mb-2 transition-transform duration-300",
                                            isSelected ? "scale-110" : "group-hover:scale-110"
                                        )}>
                                            {option.emoji}
                                        </span>
                                        <span className={cn(
                                            "text-[9px] sm:text-[10px] font-semibold text-center leading-tight transition-colors",
                                            isSelected ? "text-blue-700" : "text-slate-500"
                                        )}>
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="px-6 py-6 mt-auto">
                    <Button
                        onClick={handleNext}
                        disabled={currentAnswer === undefined}
                        className={cn(
                            "w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2",
                            currentAnswer !== undefined
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25"
                                : "text-slate-400 pointer-events-none"
                        )}
                        style={currentAnswer === undefined ? { background: 'rgba(0,0,0,0.06)' } : {}}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Continue'}
                        {currentQuestionIndex === questions.length - 1 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
