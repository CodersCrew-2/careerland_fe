'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { X, Search, Briefcase } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const careers = [
    {
        id: 'software-engineer',
        title: 'Software Engineer',
        description: 'Design, develop, and maintain software applications.',
        image: 'https://picsum.photos/seed/software/400/300',
        match: '98%'
    },
    {
        id: 'data-scientist',
        title: 'Data Scientist',
        description: 'Analyze complex data to help organizations make better decisions.',
        image: 'https://picsum.photos/seed/data/400/300',
        match: '95%'
    },
    {
        id: 'ux-designer',
        title: 'UX Designer',
        description: 'Create meaningful and relevant experiences for users.',
        image: 'https://picsum.photos/seed/ux/400/300',
        match: '92%'
    },
    {
        id: 'product-manager',
        title: 'Product Manager',
        description: 'Guide the success of a product and lead the cross-functional team.',
        image: 'https://picsum.photos/seed/product/400/300',
        match: '88%'
    },
    {
        id: 'digital-marketer',
        title: 'Digital Marketer',
        description: 'Promote products or brands via one or more forms of electronic media.',
        image: 'https://picsum.photos/seed/marketing/400/300',
        match: '85%'
    }
];

export default function RecommendationsPage() {
    return (
        <ProtectedRoute>
            <JobStack />
        </ProtectedRoute>
    );
}

function JobStack() {
    const [cards, setCards] = useState(careers);
    const router = useRouter();

    const handleSwipe = (direction: 'left' | 'right', id: string) => {
        if (direction === 'right') {
            router.push(`/career/${id}`);
        } else {
            setCards(cards.filter(c => c.id !== id));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] p-4 overflow-hidden relative">
            <div className="absolute top-8 left-0 right-0 text-center z-10">
                <h1 className="text-3xl font-bold font-display text-[var(--color-on-surface)]">
                    Based on your interests
                </h1>
                <p className="text-[var(--color-on-surface-variant)]">
                    Swipe right to explore, left to ignore
                </p>
            </div>

            <div className="relative w-full max-w-sm h-[500px] flex items-center justify-center mt-12">
                <AnimatePresence>
                    {cards.map((career, index) => (
                        <CardStackItem
                            key={career.id}
                            career={career}
                            index={index}
                            total={cards.length}
                            onSwipe={(dir) => handleSwipe(dir, career.id)}
                        />
                    ))}
                </AnimatePresence>
                {cards.length === 0 && (
                    <div className="text-center">
                        <p className="text-xl font-medium text-[var(--color-on-surface-variant)]">
                            No more recommendations.
                        </p>
                        <Button onClick={() => setCards(careers)} className="mt-4">
                            Reset Stack
                        </Button>
                        <Button variant="outlined" onClick={() => router.push('/dashboard')} className="mt-4 ml-2">
                            Go to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CardStackItemProps {
    career: any;
    index: number;
    total: number;
    onSwipe: (dir: 'left' | 'right') => void;
}

const CardStackItem: React.FC<CardStackItemProps> = ({ career, index, total, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    const isFront = index === total - 1;

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                zIndex: index,
                scale: 1 - (total - 1 - index) * 0.05,
                y: (total - 1 - index) * 10,
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100) {
                    onSwipe('right');
                } else if (offset.x < -100) {
                    onSwipe('left');
                }
            }}
            className="absolute top-0 w-full cursor-grab active:cursor-grabbing"
        >
            <Card className="h-[450px] shadow-xl bg-[var(--color-surface)] border-[var(--color-outline)]/10 overflow-hidden flex flex-col">
                <div className="h-48 overflow-hidden relative">
                    <img src={career.image} alt={career.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 right-2 bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {career.match} Match
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl">{career.title}</CardTitle>
                    <CardDescription className="line-clamp-3 mt-2 text-base">
                        {career.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex justify-between pb-6 px-6">
                    <Button
                        variant="outlined"
                        className="rounded-full w-14 h-14 p-0 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                        onClick={() => onSwipe('left')}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="filled"
                        className="rounded-full px-8 h-14 text-lg gap-2 shadow-lg shadow-primary/20"
                        onClick={() => onSwipe('right')}
                    >
                        Explore <Search className="w-5 h-5" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
