'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cl-api.rookie.house';

function AuthCallbackContent() {
    const { login, signup } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function verifyAuth() {
            try {
                // The backend set an httpOnly `accessToken` cookie on its domain.
                // Calling /api/auth/me with credentials:include sends that cookie automatically,
                // giving us the logged-in user's info without needing a token in the URL.
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    credentials: 'include',
                    cache: 'no-store',
                });

                if (!res.ok) {
                    router.replace('/login?error=auth_failed');
                    return;
                }

                const json = await res.json();
                const user = json?.data?.user;

                if (!user?.email) {
                    router.replace('/login?error=auth_failed');
                    return;
                }

                // Determine if this is a new user (hasn't logged in before on this device)
                const stored = localStorage.getItem('careerland_user');
                const storedEmail = stored ? JSON.parse(stored)?.email : null;
                const isNew = storedEmail !== user.email;

                if (isNew) {
                    signup(user.email, user.name || user.email.split('@')[0]);
                    router.replace('/onboarding');
                } else {
                    login(user.email, undefined, user.name || undefined);
                    router.replace('/dashboard');
                }
            } catch {
                router.replace('/login?error=auth_failed');
            }
        }

        verifyAuth();
    }, []); // eslint-disable-line

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#22a8e0] animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Signing you in…</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 text-[#22a8e0] animate-spin" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
