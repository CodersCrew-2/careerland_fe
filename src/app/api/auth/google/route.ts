import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/google
// Fetches the Google OAuth URL from the backend.
// For LOCAL development: encodes the localhost origin into the OAuth `state`
// param so that the production /auth/callback can forward the code back here.
// In PRODUCTION: passes the URL through unchanged.
export async function GET(req: NextRequest) {
    const API_BASE =
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'https://cl-api.rookie.house';

    const APP_URL =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Detect if we're running locally (not the deployed site)
    const requestOrigin = req.headers.get('host') ?? '';
    const isLocal =
        requestOrigin.startsWith('localhost') ||
        requestOrigin.startsWith('127.0.0.1') ||
        requestOrigin.startsWith('0.0.0.0');

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

        let oauthUrl: URL;
        try {
            oauthUrl = new URL(json.data.url);
        } catch {
            return NextResponse.redirect(`${APP_URL}/login?error=invalid_oauth_url`);
        }

        if (isLocal) {
            // Encode the localhost callback URL into the `state` param.
            // The production /auth/callback page will read this and redirect
            // the code + state back to localhost so we can process auth locally.
            const existingState = oauthUrl.searchParams.get('state') ?? '';
            const devPayload = JSON.stringify({
                dev_origin: APP_URL,
                original_state: existingState,
            });
            oauthUrl.searchParams.set('state', Buffer.from(devPayload).toString('base64'));
            console.log('[auth/google] LOCAL MODE — encoding dev_origin in state:', APP_URL);
        }

        return NextResponse.redirect(oauthUrl.toString());
    } catch (err) {
        console.error('[auth/google] Backend unreachable:', err);
        return NextResponse.redirect(`${APP_URL}/login?error=backend_offline`);
    }
}
