import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/google/callback?code=...
// Called by Google after OAuth consent (when backend redirect_uri points here),
// OR can also be called by the frontend if the backend itself redirects here.
export async function GET(req: NextRequest) {
    const API_BASE =
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'https://cl-api.rookie.house';
    const APP_URL =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const code = req.nextUrl.searchParams.get('code');


    if (!code) {
        return NextResponse.redirect(`${APP_URL}/login?error=no_code`);
    }

    try {
        const res = await fetch(
            `${API_BASE}/api/auth/google/callback?code=${encodeURIComponent(code)}`,
            { signal: AbortSignal.timeout(10000) }
        );
        const json = await res.json();

        // Backend returns { success, data: { user, access_token } }
        if (!json.success || !json.data?.access_token) {
            console.error('[auth callback] bad response:', JSON.stringify(json));
            return NextResponse.redirect(`${APP_URL}/login?error=auth_failed`);
        }

        const { access_token, user } = json.data;
        // Backend doesn't return isNewUser — default new users to onboarding
        const dest = '/dashboard';

        const redirectUrl = new URL(`${APP_URL}${dest}`);
        redirectUrl.searchParams.set('token', access_token);
        redirectUrl.searchParams.set('email', user?.email || '');
        redirectUrl.searchParams.set('name', user?.firstName || '');

        const response = NextResponse.redirect(redirectUrl.toString());
        // Also store token in a cookie for easy access
        response.cookies.set('cl_token', access_token, {
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });
        return response;
    } catch (err) {
        console.error('[auth callback]', err);
        return NextResponse.redirect(`${APP_URL}/login?error=backend_offline`);
    }
}
