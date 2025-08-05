import { test, expect } from '@playwright/test';

test.describe('INTEGRATION TEST: Profile Comparison Page', () => {
    test('renders full profile and repo data from mocked API', async ({ page }) => {
        const mockResponse = {
            user: {
                login: 'mockuser',
                name: 'Mock User',
                avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
                location: 'Canada',
                followers: 42,
                following: 10,
                publicRepos: 5,
                openIssues: 2,
                pullRequests: 3,
                mergedPullRequests: 2,
                totalCommits: 100,
                totalStars: 50,
                totalForks: 10,
                contributions: [
                    { date: '2025-01-01', count: 3 },
                    { date: '2025-01-02', count: 5 }
                ],
                topLanguages: [
                    { name: 'JavaScript', color: '#f1e05a', percentage: 60 },
                    { name: 'Python', color: '#3572A5', percentage: 40 }
                ]
            },
            repos: [
                {
                    name: 'test-repo',
                    owner: 'mockuser',
                    ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
                    url: 'https://github.com/mockuser/test-repo',
                    description: 'A mocked repository',
                    primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
                    stargazerCount: 10,
                    forkCount: 2,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: new Date().toISOString()
                }
            ]
        };

        await page.route('**/api/github_api/user_search', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { items: [{ id: 1, login: 'mockuser', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }] }
                })
            });
        });

        await page.route('**/api/github_api/profile_comparison', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockResponse)
            });
        });

        await page.goto('/profile_comparison');

        await page.getByPlaceholder('Search GitHub users...').fill('mockuser');

        await page.waitForSelector('li:has-text("mockuser")', { timeout: 5000 });
        await page.locator('li', { hasText: 'mockuser' }).first().click();

        await page.getByRole('button', { name: 'Analyze' }).click();

        await expect(page.getByRole('link', { name: '@mockuser' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Mock User' })).toBeVisible();
        await expect(page.getByAltText('mockuser avatar')).toBeVisible();
    });
});
