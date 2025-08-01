const { test, expect } = require('@playwright/test');

test('UNIT TEST AI CHATBOT: tests if route returns data ', async ({ request }) => {
    const userPrompt = "what is the best way to contribute to this project?";

    const messages = [
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your GitGood AI assistant. How can I help you today? I can help you with GitHub issues, code problems, or any development questions you might have.',
        timestamp: new Date()
      }
    ]
  
    const response = await request.post('/api/ai_api/chatbot', {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ prompt: userPrompt, messages }),
    });
  
    
    expect(response.ok()).toBeTruthy();
    
  
    const data = await response.json();
    expect(data.response).toBeDefined();
    expect(data.response).not.toBe("Sorry, something went wrong. Please try again.");
  });
  