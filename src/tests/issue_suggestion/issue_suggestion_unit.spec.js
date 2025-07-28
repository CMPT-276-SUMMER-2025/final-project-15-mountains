const { test, expect } = require('@playwright/test');

test('UNIT TEST ISSUE SUGGESTION: tests if route returns data ', async ({ request }) => {
  const userPrompt = "pick first one";

  const issues = [
  {
    id: 3247030431,
    html_url: 'https://github.com/PipedreamHQ/pipedream/issues/17712',
    title: 'actions for hootsuite',
    body: 'there are no actions available for Hootsuite MCP, such as scheduling posts or retrieving analytics. This feature would help automate content workflows.',
    repository: {}
  },
  {
    id: 3246363956,
    html_url: 'https://github.com/code-charity/youtube/issues/3049',
    title: '🐞 UI bug in fullscreen mode',
    body: 'When clicking the fullscreen button in cinema mode, the video sometimes reloads and loses playback progress.',
    repository: {}
  },
  {
    id: 3246246245,
    html_url: 'https://github.com/code-charity/youtube/issues/3048',
    title: '🐞 Home button misalignment on hover',
    body: 'When using hover option for the header display, the Home icon appears misaligned compared to other elements.',
    repository: {}
  },
  ];


  const response = await request.post('/api/ai_api/issue_suggestion', {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ prompt: userPrompt, issues }),
  });

  
  expect(response.ok()).toBeTruthy();
  

  const data = await response.json();
  expect(data.explanation).toBeDefined();
  expect(data.index).toBeDefined();
});
