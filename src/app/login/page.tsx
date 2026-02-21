'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
        router.push('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center text-[var(--color-primary)]">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="email"
                                placeholder="m@example.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
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
                            />
                        </div>
                        <Button className="w-full" type="submit">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-[var(--color-primary)] hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
