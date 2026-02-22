import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export async function POST(req: NextRequest) {
    try {
        const { query, sessionId } = await req.json();

        // Prefer Authorization header from the client; fall back to cl_token cookie
        let authHeader = req.headers.get('Authorization') || '';
        if (!authHeader) {
            const cookieStore = await cookies();
            const tokenFromCookie = cookieStore.get('cl_token')?.value;
            if (tokenFromCookie) authHeader = `Bearer ${tokenFromCookie}`;
        }

        if (!query) {
            return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 });
        }

        const res = await fetch(`${API_BASE}/api/onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify({ query, sessionId }),
            cache: 'no-store',
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error('[onboarding proxy]', err);
        return NextResponse.json(
            { success: false, error: 'Failed to reach onboarding service' },
            { status: 502 }
        );
    }
}
