import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/google — fetches the Google OAuth URL from the backend and redirects the browser to it.
// After the user authenticates with Google, the backend callback sets an httpOnly `accessToken` cookie
// and redirects to our /auth/callback page, which calls /api/auth/me to get the user.
export async function GET(_req: NextRequest) {
    const API_BASE =
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'https://cl-api.rookie.house';
    const APP_URL =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        const res = await fetch(`${API_BASE}/api/auth/google`, {
            signal: AbortSignal.timeout(10000),
            cache: 'no-store',
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

        // Redirect the browser to Google OAuth — after auth, the backend redirects to /auth/callback
        return NextResponse.redirect(json.data.url);
    } catch (err) {
        console.error('[auth/google] Backend unreachable:', err);
        return NextResponse.redirect(`${APP_URL}/login?error=backend_offline`);
    }
}
