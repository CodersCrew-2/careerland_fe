'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/components/context/AuthContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const questions = [
    {
        text: "Do you enjoy solving complex mathematical problems?",
        image: "https://picsum.photos/seed/math/600/400"
    },
    {
        text: "Are you interested in how machines and software work?",
        image: "https://picsum.photos/seed/tech/600/400"
    },
    {
        text: "Do you like helping people with their personal problems?",
        image: "https://picsum.photos/seed/help/600/400"
    },
    {
        text: "Do you enjoy creative writing or storytelling?",
        image: "https://picsum.photos/seed/write/600/400"
    },
    {
        text: "Are you interested in financial markets and investing?",
        image: "https://picsum.photos/seed/finance/600/400"
    },
    {
        text: "Do you like working with your hands to build or fix things?",
        image: "https://picsum.photos/seed/build/600/400"
    },
    {
        text: "Are you interested in scientific experiments and research?",
        image: "https://picsum.photos/seed/science/600/400"
    },
    {
        text: "Do you enjoy leading teams and managing projects?",
        image: "https://picsum.photos/seed/lead/600/400"
    },
    {
        text: "Are you interested in visual arts and design?",
        image: "https://picsum.photos/seed/art/600/400"
    },
    {
        text: "Do you like analyzing data to find trends and patterns?",
        image: "https://picsum.photos/seed/data/600/400"
    }
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
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = () => {
        // Save answers logic here
        setOnboardingStep(2);
        router.push('/know-you-better');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] p-4 overflow-hidden">
            <div className="w-full max-w-lg relative h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0, rotate: 5 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        exit={{ x: -300, opacity: 0, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute inset-0"
                    >
                        <Card className="h-full flex flex-col justify-between shadow-2xl border-none bg-[var(--color-surface)] overflow-hidden">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={questions[currentIndex].image}
                                    alt="Question Context"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="text-white font-bold uppercase tracking-wider text-sm">
                                        Question {currentIndex + 1} of {questions.length}
                                    </span>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl leading-tight text-[var(--color-on-surface)]">
                                    {questions[currentIndex].text}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1 flex items-center justify-center p-6">
                                <div className="flex gap-4 w-full">
                                    <Button
                                        variant="outlined"
                                        className="flex-1 h-24 text-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all rounded-2xl"
                                        onClick={() => handleAnswer(false)}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        variant="filled"
                                        className="flex-1 h-24 text-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all rounded-2xl shadow-lg shadow-primary/20"
                                        onClick={() => handleAnswer(true)}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </CardContent>

                            <CardFooter className="justify-between border-t border-[var(--color-outline)]/50 pt-4 bg-[var(--color-surface-variant)]/30">
                                <Button
                                    variant="text"
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </Button>
                                {currentIndex === questions.length - 1 ? (
                                    <Button onClick={handleSubmit} className="gap-2">
                                        Submit <Check className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button variant="text" onClick={() => setCurrentIndex(currentIndex + 1)} className="gap-2">
                                        Skip <ArrowRight className="w-4 h-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 flex gap-2">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? "w-8 bg-[var(--color-primary)]"
                                : idx < currentIndex
                                    ? "w-2 bg-[var(--color-primary)]/50"
                                    : "w-2 bg-[var(--color-outline)]"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
