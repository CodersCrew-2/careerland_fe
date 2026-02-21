'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FillDataPage() {
    return (
        <ProtectedRoute>
            <FillData />
        </ProtectedRoute>
    );
}

function FillData() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-4 flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <Button variant="text" onClick={() => router.push('/know-you-better')} className="w-fit pl-0 gap-2 mb-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <CardTitle className="text-2xl">Fill Data Manually</CardTitle>
                    <CardDescription>Upload your resume or enter your details directly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-[var(--color-outline)]/40 rounded-xl p-8 text-center hover:bg-[var(--color-surface-variant)]/30 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-[var(--color-secondary-container)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-[var(--color-on-secondary-container)]" />
                        </div>
                        <h3 className="font-semibold text-lg">Upload Resume / CV</h3>
                        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">PDF, DOCX up to 5MB</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[var(--color-outline)]/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[var(--color-surface)] px-2 text-[var(--color-on-surface-variant)]">Or enter manually</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input label="Full Name" placeholder="John Doe" />
                        <Input label="Current Job Title" placeholder="e.g. Student, Associate" />
                        <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push('/interests-summary')}>
                        Save & Continue
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
