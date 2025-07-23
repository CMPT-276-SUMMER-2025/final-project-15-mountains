import { NextResponse } from "next/server";
const token = process.env.GH_TOKEN;
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("lang");
    if(!language){
        throw new Error(`Error getting params`);
    }
    const query = `language:${language} label:"good first issue" label:"help wanted" state:open`;
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=created&order=desc`;

    const authHeaders = {
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, { headers: authHeaders });
    if(!res.ok){
        throw new Error(`GitHub issue fetch failed: ${res.status}`);
    }
    const data = await res.json();


    const issues = data.items;
    const filtered = [];
    let pass = 0;
    for (const issue of issues) {
        if (issue.assignees.length > 0 || issue.comments > 0) {
            continue;
        }
        const repoUrl = issue.repository_url;

        const repoRes = await fetch(repoUrl, { headers: authHeaders });
        if(!res.ok){
            throw new Error(`GitHub Repo fetch failed: ${res.status}`);
        }

        const repoData = await repoRes.json();

        if (repoData.stargazers_count >= 100) {
        filtered.push({
            id: issue.id,
            html_url: issue.html_url,
            title: issue.title,
            body: issue.body,
            repository: {
            name: repoData.full_name,
            description: repoData.description,
            stargazers_count: repoData.stargazers_count,
            forks_count: repoData.forks_count,
            html_url: repoData.html_url,
            },
        });
        pass++;

        }

        if (filtered.length >= 20) break;
    }

    return NextResponse.json(filtered);
}
