import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// GET /api/auth/google — fetches OAuth URL from backend and redirects
export async function GET(req: NextRequest) {
    try {
        const res = await fetch(`${API_BASE}/api/auth/google`, {
            signal: AbortSignal.timeout(5000), // 5s timeout
        });
        const json = await res.json();

        if (!json.success || !json.data?.url) {
            return NextResponse.redirect(`${APP_URL}/login?error=oauth_url_failed`);
        }

        return NextResponse.redirect(json.data.url);
    } catch (err) {
        console.error('[auth/google] Backend unreachable:', err);
        // Backend not running — redirect back with a helpful error
        return NextResponse.redirect(`${APP_URL}/login?error=backend_offline`);
    }
}
