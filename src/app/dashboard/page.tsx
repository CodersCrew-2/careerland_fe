'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/components/context/AuthContext';
import { Activity, Star, TrendingUp, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

function StatsCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">{title}</p>
                    <h3 className="text-3xl font-bold mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-[var(--color-on-surface)]">
                            Hello, {user?.name || 'Explorer'}!
                        </h1>
                        <p className="text-[var(--color-on-surface-variant)]">
                            Here is your career progress overview.
                        </p>
                    </div>
                    <div className="text-sm text-[var(--color-on-surface-variant)] bg-[var(--color-surface-variant)] px-4 py-2 rounded-full">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Careers Explored"
                        value="12"
                        icon={Activity}
                        color="bg-blue-100 text-blue-700"
                    />
                    <StatsCard
                        title="Saved Careers"
                        value="5"
                        icon={Star}
                        color="bg-yellow-100 text-yellow-700"
                    />
                    <StatsCard
                        title="Progress"
                        value="35%"
                        icon={TrendingUp}
                        color="bg-green-100 text-green-700"
                    />
                    <StatsCard
                        title="Next Session"
                        value="Tomorrow"
                        icon={Calendar}
                        color="bg-purple-100 text-purple-700"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Recommended Paths</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/30 hover:bg-[var(--color-surface-variant)]/50 transition-colors cursor-pointer">
                                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                                                <img src={`https://picsum.photos/seed/${i}/100/100`} alt="Career" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold">Senior Product Designer</h4>
                                                <p className="text-sm text-[var(--color-on-surface-variant)]">Tech Industry • Remote</p>
                                            </div>
                                            <div className="text-[var(--color-primary)] font-bold">95% Match</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="h-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] border-none">
                            <CardHeader>
                                <CardTitle>Daily Tip</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-medium">
                                    &quot;Networking is not about just connecting people. It&apos;s about connecting people with people, people with ideas, and people with opportunities.&quot;
                                </p>
                                <p className="mt-4 text-sm opacity-80">— Michele Jennae</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
