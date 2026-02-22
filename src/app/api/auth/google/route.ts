import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/auth/google — fetches OAuth URL from backend and redirects
export async function GET(req: NextRequest) {
    // Read at request time (not build time) so env vars are always current
    const API_BASE =
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'https://cl-api.rookie.house';
    const APP_URL =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        // Forward auth token from cookie if present
        const cookieStore = await cookies();
        const tokenFromCookie = cookieStore.get('cl_token')?.value;
        const headers: Record<string, string> = {};
        if (tokenFromCookie) headers['Authorization'] = `Bearer ${tokenFromCookie}`;

        const res = await fetch(`${API_BASE}/api/auth/google`, {
            signal: AbortSignal.timeout(10000), // 10s — Cloudflare Worker cold starts can be slow
            cache: 'no-store',
            headers,
        });

        if (!res.ok) {
            console.error('[auth/google] Backend returned', res.status);
            return NextResponse.redirect(`${APP_URL}/login?error=oauth_url_failed`);
        }

        const json = await res.json();

        if (!json.success || !json.data?.url) {
            console.error('[auth/google] Bad response:', JSON.stringify(json));
            return NextResponse.redirect(`${APP_URL}/login?error=oauth_url_failed`);
        }

        return NextResponse.redirect(json.data.url);
    } catch (err) {
        console.error('[auth/google] Backend unreachable:', err);
        return NextResponse.redirect(`${APP_URL}/login?error=backend_offline`);
    }
}

