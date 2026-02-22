'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
    const { login, signup } = useAuth();
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const token = params.get('token');

        if (!token) {
            // No token in URL — backend hasn't been updated yet
            router.replace('/login?error=no_token');
            return;
        }

        // Decode user info from the JWT payload (it's a standard base64 JWT)
        let email = '';
        let name = '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            email = payload.email || payload.sub || '';
            name = payload.name || payload.given_name || '';
        } catch {
            // Token might not be a JWT — that's fine, we just won't have user info yet
        }

        // Store the token in AuthContext (saved to localStorage for display)
        const stored = localStorage.getItem('careerland_user');
        const storedEmail = stored ? JSON.parse(stored)?.email : null;
        const isNew = !storedEmail || storedEmail !== email;

        if (isNew) {
            signup(email || 'user', name || undefined, token);
            router.replace('/onboarding');
        } else {
            login(email || storedEmail, token, name || undefined);
            router.replace('/dashboard');
        }
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
