import { test, expect } from '@playwright/test';

test('README_Viewer: Markdown file appears after searching for it', async ({ page }) => {
    await page.goto('/markdown_editor');

    await page.getByPlaceholder('Username').fill('AmarKoonar');
    await page.getByPlaceholder('Repo').fill('AmarKoonar');
    await page.getByRole('button',{name:'Load'}).click();

    await expect(page.locator('text=Hey there').first()).toBeVisible();

});