'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Layout from '@/components/Layout';
import { Puzzle, Sun, DollarSign, ChevronDown, Cloud, CloudRain, ArrowRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const careerSuggestions = [
    {
        id: 1,
        title: "Engineering Teachers, Postsecondary",
        fit: "Good fit",
        outlook: "Bright outlook",
        outlookIcon: Sun,
        outlookColor: "text-yellow-500",
        salary: "$106,120",
        salaryLevel: "$$$",
        fitIcon: Puzzle,
    },
    {
        id: 2,
        title: "Anthropologists & Archeologists",
        fit: "Good fit",
        outlook: "Average outlook",
        outlookIcon: Cloud,
        outlookColor: "text-orange-400",
        salary: "$64,910",
        salaryLevel: "$$",
        fitIcon: Puzzle,
    },
    {
        id: 3,
        title: "Biological Science Teachers, Postsecondary",
        fit: "Good fit",
        outlook: "Bright outlook",
        outlookIcon: Sun,
        outlookColor: "text-yellow-500",
        salary: "$83,460",
        salaryLevel: "$$$",
        fitIcon: Puzzle,
    },
    {
        id: 4,
        title: "Speech-Language Pathologists",
        fit: "Good fit",
        outlook: "Bright outlook",
        outlookIcon: Sun,
        outlookColor: "text-yellow-500",
        salary: "$95,410",
        salaryLevel: "$$$",
        fitIcon: Puzzle,
    },
    {
        id: 5,
        title: "Orthoptists",
        fit: "Good fit",
        outlook: "Below average outlook",
        outlookIcon: CloudRain,
        outlookColor: "text-blue-400",
        salary: "$113,730",
        salaryLevel: "$$$",
        fitIcon: Puzzle,
    },
    {
        id: 6,
        title: "Chemistry Teachers, Postsecondary",
        fit: "Good fit",
        outlook: "Bright outlook",
        outlookIcon: Sun,
        outlookColor: "text-yellow-500",
        salary: "$79,550",
        salaryLevel: "$$$",
        fitIcon: Puzzle,
    }
];

export default function CareerSuggestionsPage() {
    return (
        <ProtectedRoute>
            <CareerSuggestions />
        </ProtectedRoute>
    );
}

function CareerSuggestions() {
    const router = useRouter();

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-[var(--color-on-surface)]">Career Matches</h1>
                        <p className="text-[var(--color-on-surface-variant)] mt-2">
                            Based on your responses, here are 186 matching careers sorted by best fit.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outlined" className="text-sm h-9">Filters</Button>
                        <Button variant="outlined" className="text-sm h-9">Sort by: Best Fit</Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {careerSuggestions.map((career) => (
                        <Card
                            key={career.id}
                            className="hover:shadow-md transition-shadow cursor-pointer border-[var(--color-outline)] bg-blue-50/30 hover:bg-blue-50/60"
                            onClick={() => router.push(`/career/software-engineer`)}
                        >
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center p-4 md:p-6 gap-4 md:gap-0">
                                    {/* Title Section */}
                                    <div className="flex-1 w-full">
                                        <h3 className="text-lg md:text-xl font-bold text-[var(--color-on-surface)] mb-2">
                                            {career.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm">
                                            <career.fitIcon className="w-4 h-4" />
                                            {career.fit}
                                        </div>
                                    </div>

                                    {/* Outlook Section */}
                                    <div className="w-full md:w-48 flex flex-col items-start md:items-center justify-center gap-1">
                                        <career.outlookIcon className={`w-6 h-6 ${career.outlookColor}`} />
                                        <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">{career.outlook}</span>
                                    </div>

                                    {/* Salary Section */}
                                    <div className="w-full md:w-40 flex flex-col items-start md:items-end justify-center gap-1">
                                        <div className="flex gap-0.5 text-green-600 font-bold text-sm">
                                            {career.salaryLevel}
                                        </div>
                                        <span className="text-lg font-bold text-[var(--color-on-surface)]">{career.salary}</span>
                                    </div>

                                    {/* Action */}
                                    <div className="hidden md:flex w-12 justify-end">
                                        <ChevronDown className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center pt-8">
                    <Button variant="tonal" className="gap-2">
                        Load More Careers <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
