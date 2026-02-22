import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export async function POST(req: NextRequest) {
    try {
        const { query, sessionId } = await req.json();
        const authHeader = req.headers.get('Authorization') || '';

        if (!query) {
            return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 });
        }

        const res = await fetch(`${API_BASE}/api/onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
            body: JSON.stringify({ query, sessionId }),
            credentials: 'include',
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
