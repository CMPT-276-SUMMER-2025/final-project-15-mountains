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
                title: issue.title,
                html_url: issue.html_url,
                body: issue.body,
                created_at: issue.created_at,
                labels: issue.labels.map(l => ({ name: l.name, color: l.color })),
                repository: {
                    name: repoData.full_name,
                    description: repoData.description,
                    html_url: repoData.html_url,
                    language: repoData.language,
                    stargazers_count: repoData.stargazers_count,
                    forks_count: repoData.forks_count,
                    watchers_count: repoData.watchers_count,
                    open_issues_count: repoData.open_issues_count,
                    license: repoData.license?.name || null,
                    owner: {
                        login: repoData.owner.login,
                        avatar_url: repoData.owner.avatar_url,
                        html_url: repoData.owner.html_url,
                    },
                },
            });
        }

        if (filtered.length >= 20) break;
    }

    return NextResponse.json(filtered);
}
