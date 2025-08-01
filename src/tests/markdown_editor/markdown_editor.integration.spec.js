import { test, expect } from '@playwright/test';

test('README_Viewer: Markdown file appears after searching for it', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/markdown_editor');

    await page.getByPlaceholder('Tell AI what changes you want: Edit this README with setup steps or Create a GitHub issue for broken links').fill('Give me a markdown file to introduce myself as John Doe, a second year student at SFU Comp Sci, with experience with languages such as: html, css, tailwind, js, react, java, c, c++, python');
    
    await page.getByTestId('submit').click()

    await page.waitForResponse(resp => resp.url().includes('/api/ai_api/markdown') && resp.status() === 200);

    await expect(page.getByText('John Doe').first()).toBeVisible({ timeout: 10000 });
});