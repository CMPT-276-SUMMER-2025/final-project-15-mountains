import { NextResponse } from 'next/server';

export async function POST(req) {
    const { username } = await req.json();

    const query = `
    query ($login: String!) {
      user(login: $login) {
        login
        name
        bio
        avatarUrl
        location
        url
        repositories(privacy: PUBLIC) {
          totalCount
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
        issues(states: OPEN) {
            totalCount
        }
        pullRequests {
            totalCount
        }
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      } 
      rateLimit {
        limit
        remaining
        cost
        resetAt
      }
    }`;

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PRIVATE_GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables: { login: username },
        }),
    });

    const json = await res.json();
    const user = json.data?.user || {};
    const calendar = user.contributionsCollection?.contributionCalendar || {};
    const contributions = calendar.weeks?.flatMap((week) => week.contributionDays)
        .map((day) => ({
            date: day.date,
            count: day.contributionCount,
            color: day.color,
        })) || [];

    const rateLimit = json.data?.rateLimit || {};

    return NextResponse.json({
        user: {
            login: user.login,
            name: user.name,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            location: user.location,
            url: user.url,
            publicRepos: user.repositories?.totalCount || 0,
            followers: user.followers?.totalCount || 0,
            following: user.following?.totalCount || 0,
            openIssues: user.issues?.totalCount || 0,
            pullRequests: user.pullRequests?.totalCount || 0,
            contributions,
            totalContributions: calendar.totalContributions || 0,
        },
        rateLimit: {
            limit: rateLimit.limit || 0,
            remaining: rateLimit.remaining || 0,
            cost: rateLimit.cost || 0,
            resetAt: rateLimit.resetAt || null,
        },
    });

}
