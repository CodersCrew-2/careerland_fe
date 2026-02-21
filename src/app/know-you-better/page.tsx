'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/components/context/AuthContext';
import { FileText, UserCheck, PenTool } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function KnowYouBetterPage() {
    return (
        <ProtectedRoute>
            <KnowYouBetter />
        </ProtectedRoute>
    );
}

function KnowYouBetter() {
    const router = useRouter();
    const { setOnboardingStep } = useAuth();

    const handleSkip = () => {
        setOnboardingStep(3);
        router.push('/interests-summary');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 p-4">
            {/* Subtle Blue Blur Gradients */}
            <div className="absolute top-0 inset-x-0 h-[600px] w-full max-w-lg mx-auto bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none transform -translate-y-1/2"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute top-[30%] left-[-10%] w-[250px] h-[250px] bg-blue-300/20 dark:bg-blue-800/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-2xl text-center space-y-8 relative z-10">
                <h1 className="text-4xl font-display font-bold text-slate-800 dark:text-slate-100">
                    We want to know better about you
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border-white/40 dark:border-white/10 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-2xl hover:-translate-y-1 group"
                        onClick={() => router.push('/questionnaire')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Questionnaire</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Answer detailed questions</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border-white/40 dark:border-white/10 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-2xl hover:-translate-y-1 group"
                        onClick={() => router.push('/counsellor')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <UserCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Counsellor</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Talk to an expert</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border-white/40 dark:border-white/10 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-2xl hover:-translate-y-1 group"
                        onClick={() => router.push('/fill-data')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <PenTool className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Fill Data</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Enter your details manually</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-8">
                    <Button variant="text" onClick={handleSkip} className="text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-2xl px-6 py-2 transition-all">
                        Skip for now
                    </Button>
                </div>
            </div>
        </div>
    );
}
