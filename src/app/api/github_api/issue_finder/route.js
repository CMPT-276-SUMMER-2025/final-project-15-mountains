import { NextResponse } from "next/server";
const token = process.env.GITHUB_TOKEN;
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("lang") || "JavaScript";

    const query = `language:${language} label:"good first issue" label:"help wanted" state:open`;
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(
        query
    )}&per_page=50&sort=created&order=desc`;

    const authHeaders = {
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, { headers: authHeaders });
    const data = await res.json();
    console.log(data);

    return NextResponse.json(data);
}
