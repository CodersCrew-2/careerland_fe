'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

const LOGO_URL = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7bVtR0AczHfCIdxXY6iah1sFOJokVv4nc2Tp9';

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
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden p-4" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #e0f2fe 100%)' }}>
            {/* Blue blur gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

            <Card className="w-full max-w-md z-10 border border-white/60 bg-white/40 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 rounded-3xl">
                <CardHeader className="space-y-4 pt-8 pb-2">
                    <div className="flex justify-center mb-2">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 ring-2 ring-white/60">
                            <img src={LOGO_URL} alt="CareerLand Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold text-center text-slate-800">Join the Future</CardTitle>
                        <CardDescription className="text-center text-slate-500 mt-1">
                            Start your career journey today
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 px-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="name"
                            placeholder="Your Name"
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Full Name"
                            className="bg-white/50 border border-white/60 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <Input
                            id="email"
                            placeholder="you@example.com"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            className="bg-white/50 border border-white/60 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <Input
                            id="phone"
                            placeholder="+91 98765 43210"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            label="Phone Number"
                            className="bg-white/50 border border-white/60 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <Input
                            id="password"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            className="bg-white/50 border border-white/60 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="w-full h-12 rounded-2xl font-semibold text-white text-base transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] mt-2"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                        >
                            Create Account
                        </button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center pb-8">
                    <p className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
