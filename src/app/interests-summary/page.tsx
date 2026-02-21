'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowRight, Sparkles, Target, BookOpen } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InterestsSummaryPage() {
    return (
        <ProtectedRoute>
            <InterestsSummary />
        </ProtectedRoute>
    );
}

function InterestsSummary() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-4 flex flex-col items-center justify-center text-center">
            <div className="max-w-2xl w-full space-y-8">
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-[var(--color-primary-container)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-[var(--color-on-primary-container)]" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-[var(--color-on-surface)]">
                        We&apos;ve analyzed your profile
                    </h1>
                    <p className="text-xl text-[var(--color-on-surface-variant)]">
                        Based on your current interests and responses, we have curated a list of careers that match your potential.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <Card className="bg-[var(--color-surface-variant)]/30 border-none">
                        <CardHeader className="pb-2">
                            <Target className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                            <CardTitle className="text-lg">Top Match</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[var(--color-on-surface-variant)]">Technology & Engineering</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[var(--color-surface-variant)]/30 border-none">
                        <CardHeader className="pb-2">
                            <BookOpen className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                            <CardTitle className="text-lg">Learning Style</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[var(--color-on-surface-variant)]">Practical & Analytical</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[var(--color-surface-variant)]/30 border-none">
                        <CardHeader className="pb-2">
                            <Sparkles className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                            <CardTitle className="text-lg">Potential</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-[var(--color-on-surface-variant)]">High Growth Roles</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-8">
                    <Button
                        className="w-full md:w-auto px-12 py-6 text-lg rounded-full shadow-lg shadow-primary/25"
                        onClick={() => router.push('/recommendations')}
                    >
                        Reveal My Career Matches <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
