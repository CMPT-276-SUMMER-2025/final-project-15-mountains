const { test, expect } = require('@playwright/test');

test('UNIT TEST: route returns markdown and explanation', async ({ request }) => {
  const message = 'Give me a markdown file to introduce myself as John Doe, a second year student at SFU Comp Sci, with experience with languages such as: html, css, tailwind, js, react, java, c, c++, python';
  const markdown = '';

  const response = await request.post('/api/ai_api/markdown', {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ prompt: message.trim(), markdown: markdown.trim() }),
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.newMarkdown).toBeDefined();
  expect(data.explanation).toBeDefined();
});
