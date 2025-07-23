const { test, expect } = require('@playwright/test');

test('UNIT TEST ISSUE SELECTOR: tests if route returns data ', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/github_api/issue_finder?lang=python');

  
  expect(response.ok()).toBeTruthy();

  
  const data = await response.json();
  expect(data.length).toBeGreaterThan(0);
});