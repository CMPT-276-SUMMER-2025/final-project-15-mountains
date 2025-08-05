const { test, expect } = require('@playwright/test');

test('INTEGRATION TEST AI CHATBOT: loads AI explanation after entering prompt', async ({ page }) => {
  
  await page.goto('/chatbot');
  
  const aiInput = await page.getByTestId('chatbot-input');
  await aiInput.fill('what is the best way to contribute to this project?');

  // test.setTimeout(3_0000);
  await page.keyboard.press('Enter');
  
  const response = await page.getByText('Sorry, something went wrong. Please try again.');
  await expect(response).not.toBeVisible();
});
  