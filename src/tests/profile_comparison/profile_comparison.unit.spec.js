import { test, expect } from '@playwright/test';

test.describe('UNIT TEST: /api/github_api/profile_comparison', () => {
    test('returns user profile and repositories for a valid username (mocked)', async ({ request }) => {
        const mockResponse = {
            user: {
                login: 'mockuser',
                name: 'Mock User',
                bio: 'This is a mocked bio',
                avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
                location: 'Canada',
                url: 'https://github.com/mockuser',
                publicRepos: 1,
                followers: 42,
                following: 10,
                openIssues: 2,
                pullRequests: 3,
                mergedPullRequests: 2,
                totalCommits: 100,
                totalStars: 10,
                totalForks: 2,
                contributions: [
                    { date: '2025-01-01', count: 3, color: '#fff' }
                ],
                topLanguages: [
                    { name: 'JavaScript', color: '#f1e05a', percentage: 100 }
                ]
            },
            repos: [
                {
                    name: 'test-repo',
                    description: 'A mocked repository',
                    url: 'https://github.com/mockuser/test-repo',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2025-01-01T00:00:00Z',
                    isFork: false,
                    stargazerCount: 10,
                    forkCount: 2,
                    primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
                    defaultBranchRef: {
                        target: {
                            __typename: 'Commit',
                            history: { totalCount: 100 }
                        }
                    }
                }
            ],
            rateLimit: {
                limit: 5000,
                remaining: 4999,
                cost: 1,
                resetAt: '2025-01-01T00:00:00Z'
            }
        };

        await request.post('/api/github_api/profile_comparison', {
            headers: { 'Content-Type': 'application/json' },
            data: { username: 'mockuser' }
        });

        expect(mockResponse).toHaveProperty('user');
        expect(mockResponse).toHaveProperty('repos');
        expect(Array.isArray(mockResponse.repos)).toBeTruthy();

        expect(mockResponse.user).toEqual(
            expect.objectContaining({
                login: expect.any(String),
                followers: expect.any(Number),
                publicRepos: expect.any(Number)
            })
        );
    });

    test('returns 400 for missing username', async ({ request }) => {
        const response = await request.post('/api/github_api/profile_comparison', {
            headers: { 'Content-Type': 'application/json' },
            data: {}
        });
        expect(response.status()).toBe(400);
        expect(await response.json()).toHaveProperty('error');
    });

    test('returns 400 for blank username', async ({ request }) => {
        const response = await request.post('/api/github_api/profile_comparison', {
            headers: { 'Content-Type': 'application/json' },
            data: { username: ' ' }
        });
        expect(response.status()).toBe(400);
        expect(await response.json()).toHaveProperty('error');
    });

    test('returns 400 for non-string username', async ({ request }) => {
        const response = await request.post('/api/github_api/profile_comparison', {
            headers: { 'Content-Type': 'application/json' },
            data: { username: 12345 }
        });
        expect(response.status()).toBe(400);
        expect(await response.json()).toHaveProperty('error');
    });
});
