'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Bookmark, ArrowRight, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const careers = [
    { id: 1, title: 'UX Designer', company: 'Tech', type: 'Creative', image: 'https://picsum.photos/seed/ux/100/100' },
    { id: 2, title: 'Data Scientist', company: 'Finance', type: 'Analytical', image: 'https://picsum.photos/seed/data/100/100' },
    { id: 3, title: 'Product Manager', company: 'Startup', type: 'Leadership', image: 'https://picsum.photos/seed/pm/100/100' },
    { id: 4, title: 'Frontend Dev', company: 'Agency', type: 'Technical', image: 'https://picsum.photos/seed/fe/100/100' },
];

export default function CareersPage() {
    return (
        <ProtectedRoute>
            <CareersContent />
        </ProtectedRoute>
    );
}

function CareersContent() {
    const [activeTab, setActiveTab] = useState<'explored' | 'saved'>('explored');

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-[var(--color-on-surface)]">Careers</h1>
                        <p className="text-[var(--color-on-surface-variant)] mt-2">Discover your future path.</p>
                    </div>
                    <div className="flex bg-[var(--color-surface-variant)]/50 p-1 rounded-full">
                        <button
                            onClick={() => setActiveTab('explored')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'explored'
                                    ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-sm'
                                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                                }`}
                        >
                            Explored
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'saved'
                                    ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-sm'
                                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                                }`}
                        >
                            Saved
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careers.map((career) => (
                        <Card key={career.id} className="group hover:border-[var(--color-primary)]/50 transition-colors bg-[var(--color-surface)]">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <img src={career.image} alt={career.title} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                <div>
                                    <CardTitle className="text-lg">{career.title}</CardTitle>
                                    <CardDescription>{career.company} • {career.type}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[var(--color-on-surface-variant)] line-clamp-2">
                                    Explore the day-to-day life, salary expectations, and roadmap to become a {career.title}.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-[var(--color-outline)]/10 pt-4">
                                <Button variant="text" className="p-0 h-auto text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">
                                    <Bookmark className="w-5 h-5" />
                                </Button>
                                <Button variant="tonal" className="gap-2 rounded-lg h-9">
                                    Details <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
