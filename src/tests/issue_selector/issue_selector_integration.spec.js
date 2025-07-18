const { test, expect } = require('@playwright/test');

test('INTEGRATION TEST ISSUE SELECTOR: loads issues when language is selected', async ({ page }) => {
  await page.goto('/issue_finder');
  await page.click('[data-testid="language-select"]');
  await page.getByText('Python').click();
  await page.getByText('Find Issues').click();
  await expect(page.locator('#issue-9')).toBeVisible({ timeout: 10000 });

});
