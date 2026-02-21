'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signup(email, name);
        router.push('/onboarding');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)] p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-secondary)]/20 rounded-full blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-md z-10 border-[var(--color-outline)]/30 bg-[var(--color-surface)]/80 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-4xl font-bold text-center text-[var(--color-on-surface)]">Join the Future</CardTitle>
                    <CardDescription className="text-center text-[var(--color-on-surface-variant)]">
                        Start your career journey today
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="name"
                                placeholder="Your Name"
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                label="Full Name"
                                className="bg-[var(--color-surface-variant)]/50 border-none focus:ring-2 ring-[var(--color-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="email"
                                placeholder="you@example.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                className="bg-[var(--color-surface-variant)]/50 border-none focus:ring-2 ring-[var(--color-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="phone"
                                placeholder="+1 234 567 8900"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                label="Phone Number"
                                className="bg-[var(--color-surface-variant)]/50 border-none focus:ring-2 ring-[var(--color-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="password"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                className="bg-[var(--color-surface-variant)]/50 border-none focus:ring-2 ring-[var(--color-primary)]"
                            />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 transition-opacity" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
