const { test, expect } = require('@playwright/test');

test('INTEGRATION TEST ISSUE SUGGESTION: loads AI explanation after entering prompt', async ({ page }) => {

  await page.goto('/issue_finder');

  await page.getByText('Find Issues').click();


  await page.waitForSelector('#issue-1');


  const aiInput = await page.getByTestId('AI-Input');
  await aiInput.fill('I like easy UI-related issues');


  

  await page.getByText('Get AI Suggestion').click();


  const explanation = await page.locator('text=Why AI chose this:').first();
  await expect(explanation).toBeVisible();

});
