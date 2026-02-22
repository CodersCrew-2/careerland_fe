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
        const email = params.get('email') || '';
        const name = params.get('name') || '';
        const isNew = params.get('new') === '1';

        if (!token) {
            router.replace('/login?error=no_token');
            return;
        }

        if (isNew) {
            signup(email, name, token);
            router.replace('/onboarding');
        } else {
            login(email, token, name);
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
