import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cl-api.rookie.house';

export async function POST(req: NextRequest) {
    try {
        const { query, sessionId } = await req.json();

        if (!query) {
            return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 });
        }

        // Forward the browser's accessToken cookie to the backend
        // (backend sets it as httpOnly on its own domain, so we read it from the incoming request)
        const accessToken = req.cookies.get('accessToken')?.value;
        const cookieHeader = accessToken ? `accessToken=${accessToken}` : '';

        const res = await fetch(`${API_BASE}/api/onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
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

