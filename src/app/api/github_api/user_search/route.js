import { NextResponse } from "next/server";

export async function POST(req) {
    const { query } = await req.json();
    const GH_TOKEN = process.env.GH_TOKEN;

    const res = await fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
            Authorization: `Bearer ${GH_TOKEN}`,
        },
    });

    const data = await res.json();
    const limit = res.headers.get("X-RateLimit-Limit");
    const remaining = res.headers.get("X-RateLimit-Remaining");
    const reset = res.headers.get("X-RateLimit-Reset");

    return NextResponse.json({ data, limit, remaining, reset });
}
