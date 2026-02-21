'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Calendar, DollarSign, ExternalLink, Bookmark } from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const scholarships = [
    { id: 1, title: 'Future Tech Leaders', amount: '$10,000', deadline: '2024-05-15', tags: ['Tech', 'Undergrad'] },
    { id: 2, title: 'Women in STEM', amount: '$5,000', deadline: '2024-06-01', tags: ['STEM', 'Women'] },
    { id: 3, title: 'Global Innovators Grant', amount: '$15,000', deadline: '2024-04-30', tags: ['Innovation', 'Global'] },
    { id: 4, title: 'Creative Arts Fund', amount: '$2,500', deadline: '2024-07-20', tags: ['Arts', 'Design'] },
];

export default function ScholarshipsPage() {
    return (
        <ProtectedRoute>
            <ScholarshipsContent />
        </ProtectedRoute>
    );
}

function ScholarshipsContent() {
    const [activeTab, setActiveTab] = useState<'explore' | 'saved'>('explore');

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-[var(--color-on-surface)]">Scholarships</h1>
                        <p className="text-[var(--color-on-surface-variant)] mt-2">Fund your dreams.</p>
                    </div>
                    <div className="flex bg-[var(--color-surface-variant)]/50 p-1 rounded-full">
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'explore'
                                    ? 'bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-sm'
                                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                                }`}
                        >
                            Explore
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scholarships.map((scholarship) => (
                        <Card key={scholarship.id} className="group border-l-4 border-l-[var(--color-tertiary)] hover:shadow-lg transition-all bg-[var(--color-surface)]">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                                        <div className="flex gap-2 mt-2">
                                            {scholarship.tags.map(tag => (
                                                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[var(--color-tertiary)]">{scholarship.amount}</div>
                                        <div className="text-xs text-[var(--color-on-surface-variant)]">Grant</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] bg-[var(--color-error)]/10 text-[var(--color-error)] w-fit px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-[var(--color-outline)]/10 pt-4">
                                <Button variant="outlined" className="gap-2 text-xs h-8">
                                    <Bell className="w-3 h-3" /> Remind Me
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="text" size="sm" className="h-8 w-8 p-0">
                                        <Bookmark className="w-4 h-4" />
                                    </Button>
                                    <Button variant="filled" size="sm" className="h-8 text-xs gap-1">
                                        Apply <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
