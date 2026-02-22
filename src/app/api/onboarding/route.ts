import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cl-api.rookie.house';

export async function POST(req: NextRequest) {
    try {
        const { query, sessionId } = await req.json();

        if (!query) {
            return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 });
        }

        // Pull access token from Authorization header (sent by the frontend as Bearer)
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

        // Also try the httpOnly cookie as fallback
        const cookieToken = req.cookies.get('accessToken')?.value;
        const effectiveToken = token || cookieToken || '';

        const res = await fetch(`${API_BASE}/api/onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
                ...(cookieToken ? { Cookie: `accessToken=${cookieToken}` } : {}),
            },
            body: JSON.stringify({ query, sessionId }),
            cache: 'no-store',
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('[onboarding proxy] upstream error', res.status, errText);
            return NextResponse.json(
                { success: false, error: `Upstream error ${res.status}` },
                { status: res.status }
            );
        }

        const raw = await res.json();

        // The backend returns an array of agent-event objects.
        // Each event may have:
        //   - actions.stateDelta.response  → the AI response payload ({ type, data })
        //   - id                           → can be used as a session / invocation id
        //
        // We scan all events and pick the last one that carries a response.
        let agentResponse: Record<string, unknown> | null = null;
        let newSessionId: string | null = null;

        const events: unknown[] = Array.isArray(raw) ? raw : [raw];
        for (const event of events) {
            const e = event as Record<string, unknown>;
            const stateDelta = (e?.actions as Record<string, unknown>)?.stateDelta as Record<string, unknown> | undefined;
            if (stateDelta?.response) {
                agentResponse = stateDelta.response as Record<string, unknown>;
            }
            if (e?.id && typeof e.id === 'string') {
                newSessionId = e.id;
            }
        }

        if (!agentResponse) {
            console.error('[onboarding proxy] no response found in events', JSON.stringify(raw));
            return NextResponse.json(
                { success: false, error: 'No response found in agent events' },
                { status: 502 }
            );
        }

        // Return a normalised shape that the frontend expects:
        // { success: true, data: { response: { type, data }, sessionId } }
        return NextResponse.json({
            success: true,
            data: {
                response: agentResponse,
                sessionId: newSessionId ?? sessionId ?? null,
            },
        });
    } catch (err) {
        console.error('[onboarding proxy]', err);
        return NextResponse.json(
            { success: false, error: 'Failed to reach onboarding service' },
            { status: 502 }
        );
    }
}
