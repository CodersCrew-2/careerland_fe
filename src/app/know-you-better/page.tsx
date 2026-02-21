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
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Subtle Blue Blur Gradients */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

            <div className="w-full max-w-2xl text-center space-y-8 relative z-10">
                <h1 className="text-4xl font-display font-bold text-slate-800">
                    We want to know better about you
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/60 backdrop-blur-2xl hover:-translate-y-1 group rounded-3xl" style={{ background: 'rgba(255,255,255,0.55)' }}
                        onClick={() => router.push('/questionnaire')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Questionnaire</h3>
                            <p className="text-sm text-slate-500">Answer detailed questions</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/60 backdrop-blur-2xl hover:-translate-y-1 group rounded-3xl" style={{ background: 'rgba(255,255,255,0.55)' }}
                        onClick={() => router.push('/counsellor')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <UserCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Counsellor</h3>
                            <p className="text-sm text-slate-500">Talk to an expert</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/60 backdrop-blur-2xl hover:-translate-y-1 group rounded-3xl" style={{ background: 'rgba(255,255,255,0.55)' }}
                        onClick={() => router.push('/fill-data')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <PenTool className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">Fill Data</h3>
                            <p className="text-sm text-slate-500">Enter your details manually</p>
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
