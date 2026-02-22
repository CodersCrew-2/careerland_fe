'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cl-api.rookie.house';

function AuthCallbackContent() {
    const { login, signup } = useAuth();
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
            router.replace('/login?error=no_code');
            return;
        }

        // ── DEV FORWARD: detect localhost dev_origin encoded in state ──
        // When running locally, /api/auth/google encodes the dev origin
        // into the state as base64 JSON. If we detect it here (on the
        // production callback), just forward the code + state to localhost.
        if (state) {
            try {
                const decoded = JSON.parse(
                    Buffer.from(state, 'base64').toString('utf-8'),
                );
                if (decoded?.dev_origin) {
                    const devOrigin: string = decoded.dev_origin;
                    const forwardUrl = new URL(`${devOrigin}/auth/callback`);
                    forwardUrl.searchParams.set('code', code);
                    // Forward the original state (not the dev wrapper)
                    if (decoded.original_state) {
                        forwardUrl.searchParams.set('state', decoded.original_state);
                    }
                    console.log('[auth/callback] Forwarding to local dev:', devOrigin);
                    window.location.href = forwardUrl.toString();
                    return;
                }
            } catch {
                // Not a dev state — continue with normal flow below
            }
        }

        // ── NORMAL FLOW ──
        async function exchangeCode() {
            try {
                const url = new URL(`${API_BASE}/api/auth/google/callback`);
                url.searchParams.set('code', code!);
                if (state) url.searchParams.set('state', state);

                const res = await fetch(url.toString(), {
                    cache: 'no-store',
                    credentials: 'include',
                });

                const json = await res.json();

                if (!res.ok || !json.success) {
                    console.error('[auth/callback] Backend error:', json);
                    router.replace('/login?error=auth_failed');
                    return;
                }

                const access_token =
                    json?.data?.access_token ?? json?.data?.token ?? json?.access_token;
                const userEmail = json?.data?.user?.email ?? '';
                const userName = json?.data?.user?.name ?? '';

                if (!access_token) {
                    console.error('[auth/callback] No access_token in response:', json);
                    router.replace('/login?error=no_token');
                    return;
                }

                localStorage.setItem('cl_access_token', access_token);

                const stored = localStorage.getItem('careerland_user');
                const storedEmail = stored ? JSON.parse(stored)?.email : null;
                const isNew = !storedEmail || storedEmail !== userEmail;

                if (isNew) {
                    signup(userEmail || 'user', userName || undefined, access_token);
                    router.replace('/onboarding');
                } else {
                    login(userEmail || storedEmail, access_token, userName || undefined);
                    router.replace('/dashboard');
                }
            } catch (err) {
                console.error('[auth/callback] Exception:', err);
                router.replace('/login?error=auth_failed');
            }
        }

        exchangeCode();
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
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <Loader2 className="w-8 h-8 text-[#22a8e0] animate-spin" />
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
