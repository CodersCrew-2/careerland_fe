import { NextRequest, NextResponse } from 'next/server';

const ROADMAP_API = 'https://roadmap-gen.rookie.house/v1/roadmaps';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const upstream = await fetch(ROADMAP_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await upstream.json();

        if (!upstream.ok) {
            return NextResponse.json(data, { status: upstream.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('[roadmap proxy]', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Proxy error' },
            { status: 500 }
        );
    }
}
