import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cl-api.rookie.house';

// GET /api/auth/callback?code=...&state=...
// Forwards the Google OAuth code to the backend, extracts the access_token
// from either the JSON response body or the Set-Cookie header, and returns JSON.
export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');

    if (!code) {
        return NextResponse.json({ success: false, error: 'No authorization code provided' }, { status: 400 });
    }

    try {
        const callbackUrl = new URL(`${API_BASE}/api/auth/google/callback`);
        callbackUrl.searchParams.set('code', code);
        if (state) callbackUrl.searchParams.set('state', state);

        const res = await fetch(callbackUrl.toString(), {
            cache: 'no-store',
            redirect: 'manual', // don't follow backend redirects — we handle them
        });

        let accessToken: string | null = null;
        let email = '';
        let name = '';

        // Strategy 1: Backend returns JSON with token (after AdityaTote's update)
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            try {
                const json = await res.json();
                accessToken = json?.data?.access_token ?? json?.data?.token ?? json?.access_token ?? null;
                email = json?.data?.user?.email ?? '';
                name = json?.data?.user?.name ?? '';
            } catch { /* fall through to cookie strategy */ }
        }

        // Strategy 2: Extract token from Set-Cookie header (current backend behaviour)
        if (!accessToken) {
            const setCookie = res.headers.get('set-cookie') ?? '';
            const match = setCookie.match(/accessToken=([^;,\s]+)/i);
            if (match) accessToken = decodeURIComponent(match[1]);
        }

        if (!accessToken) {
            console.error('[api/auth/callback] No token found. Status:', res.status);
            return NextResponse.json({ success: false, error: 'Authentication failed — no token returned by backend' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: { access_token: accessToken, user: { email, name } },
        });
    } catch (err) {
        console.error('[api/auth/callback] Error:', err);
        return NextResponse.json({ success: false, error: 'Server error during auth' }, { status: 500 });
    }
}
