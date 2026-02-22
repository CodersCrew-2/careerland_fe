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
            console.error('[roadmap proxy] upstream error:', upstream.status, JSON.stringify(data).slice(0, 500));
            return NextResponse.json(data, { status: upstream.status });
        }

        // The upstream API may return data at different nesting levels:
        //   { data: { response: { graph: ... } } }
        //   { data: { graph: ... } }
        //   { graph: ... }
        // Try each path and use the first one that has a valid graph.
        const candidate =
            data?.data?.response ??
            data?.data ??
            data?.response ??
            data;

        // Validate that we have a graph-like object
        if (!candidate || (!candidate.graph && !candidate.nodes)) {
            console.error('[roadmap proxy] unexpected response shape:', JSON.stringify(data).slice(0, 1000));
            return NextResponse.json(
                { error: 'Unexpected response from roadmap API. Please try again.' },
                { status: 502 }
            );
        }

        // If the candidate itself has { graph: { nodes, edges } }, return it as-is (frontend expects { graph })
        // If the candidate IS the graph (has nodes/edges directly), wrap it.
        if (candidate.graph) {
            return NextResponse.json(candidate);
        } else if (candidate.nodes && candidate.edges) {
            return NextResponse.json({ graph: candidate });
        }

        return NextResponse.json(candidate);
    } catch (err) {
        console.error('[roadmap proxy]', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Proxy error' },
            { status: 500 }
        );
    }
}
