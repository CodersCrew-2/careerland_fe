'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowLeft, Calendar, MessageSquare, Video } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CounsellorPage() {
    return (
        <ProtectedRoute>
            <Counsellor />
        </ProtectedRoute>
    );
}

function Counsellor() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-4 flex items-center justify-center">
            <Card className="w-full max-w-4xl h-[80vh] flex flex-col md:flex-row overflow-hidden">
                <div className="md:w-1/3 bg-[var(--color-secondary-container)] p-6 flex flex-col">
                    <Button variant="text" onClick={() => router.push('/know-you-better')} className="w-fit pl-0 gap-2 mb-6 text-[var(--color-on-secondary-container)] hover:bg-black/5">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <h2 className="text-2xl font-bold text-[var(--color-on-secondary-container)] mb-2">Talk to an Expert</h2>
                    <p className="text-[var(--color-on-secondary-container)]/80 mb-8">
                        Get personalized career guidance from certified counsellors.
                    </p>

                    <div className="space-y-4 mt-auto">
                        <div className="bg-[var(--color-surface)]/50 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                                    <span className="font-bold text-green-800">JD</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Jane Doe</p>
                                    <p className="text-xs opacity-70">Senior Career Coach</p>
                                </div>
                            </div>
                            <p className="text-xs italic">&quot;Helped me switch from Marketing to UX Design in 3 months!&quot;</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <h3 className="text-xl font-bold mb-6">Available Sessions</h3>

                    <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border border-[var(--color-outline)]/20 shadow-none hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[var(--color-primary-container)] rounded-lg text-[var(--color-on-primary-container)]">
                                            <Video className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">1:1 Career Strategy</h4>
                                            <p className="text-sm text-[var(--color-on-surface-variant)]">45 mins • Video Call</p>
                                        </div>
                                    </div>
                                    <Button variant="outlined" onClick={() => router.push('/interests-summary')}>Book</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Or chat now</h3>
                        <Button className="w-full py-6 text-lg gap-2" variant="tonal" onClick={() => router.push('/interests-summary')}>
                            <MessageSquare className="w-5 h-5" /> Start Chat
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
