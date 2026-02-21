'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Map, Clock, DollarSign, BookOpen, PlayCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock data - in a real app this would come from an API
const careerData: Record<string, any> = {
    'software-engineer': {
        title: 'Software Engineer',
        description: 'Design, develop, and maintain software applications.',
        image: 'https://picsum.photos/seed/software/800/400',
        details: 'Software engineers apply engineering principles to the design, development, maintenance, testing, and evaluation of computer software.',
        requirements: [
            'Bachelor\'s degree in Computer Science or related field',
            'Proficiency in Java, Python, C++, or JavaScript',
            'Experience with databases and SQL',
            'Understanding of algorithms and data structures'
        ],
        roadmap: [
            'Learn programming basics (Python/JS)',
            'Understand Data Structures & Algorithms',
            'Build projects and portfolio',
            'Learn frameworks (React/Node/Django)',
            'Apply for internships/jobs'
        ],
        salary: '$80,000 - $150,000',
        youtubeId: 'WpG89bB6-jY'
    },
    'default': {
        title: 'Career Details',
        description: 'Detailed information about this career path.',
        image: 'https://picsum.photos/seed/career/800/400',
        details: 'This is a placeholder for career details. In a real application, this would be fetched from a database based on the career ID.',
        requirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
        roadmap: ['Step 1', 'Step 2', 'Step 3'],
        salary: '$50,000 - $100,000',
        youtubeId: 'dQw4w9WgXcQ'
    }
};

export default function CareerDetailPage() {
    return (
        <ProtectedRoute>
            <CareerDetail />
        </ProtectedRoute>
    );
}

function CareerDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const career = careerData[id] || careerData['default'];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <Button variant="text" onClick={() => router.back()} className="pl-0 gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg">
                    <img src={career.image} alt={career.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-display">{career.title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                <BookOpen className="w-6 h-6" /> Details
                            </h2>
                            <p className="text-lg leading-relaxed text-[var(--color-on-surface)]">
                                {career.details}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-[var(--color-on-surface)]">
                                {career.requirements.map((req: string, i: number) => (
                                    <li key={i} className="text-lg">{req}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                                <Map className="w-6 h-6" /> Career Roadmap
                            </h2>
                            <div className="relative border-l-2 border-[var(--color-primary)]/30 ml-3 space-y-8 pl-8 py-2">
                                {career.roadmap.map((step: string, i: number) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-surface)] shadow-sm" />
                                        <h3 className="text-lg font-bold">Step {i + 1}</h3>
                                        <p className="text-[var(--color-on-surface-variant)]">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-[var(--color-secondary-container)] border-none">
                            <CardHeader>
                                <CardTitle className="text-[var(--color-on-secondary-container)] flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" /> Salary Range
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-[var(--color-on-secondary-container)]">
                                    {career.salary}
                                </p>
                                <p className="text-sm text-[var(--color-on-secondary-container)]/70 mt-1">Per year (estimated)</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5" /> A Day in the Life
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 overflow-hidden rounded-b-3xl">
                                <div className="aspect-video w-full">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${career.youtubeId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
