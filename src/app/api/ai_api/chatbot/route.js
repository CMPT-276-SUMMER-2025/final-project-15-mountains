import { NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.AI_TOKEN;

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });

export async function POST(req) {
    const { prompt, messages } = await req.json();

    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'Unknown';
  
    // to check which IP is sending the request - ONLY printed to console in server
    console.log("Visitor IP:", ip);
    console.log("Prompt: ", prompt);

   const systemPrompt = `

      You are the GitGood chatbot, an AI assistant built into the website GitGood that helps users level up their GitHub presence. 
      GitGood combines the power of GitHub's REST API with AI to make open source contributions easier and more accessible. Use markdown to make ur responses look nice.
      
      The platform offers:
      - An **issue finder** that searches GitHub for beginner-friendly issues using filters like "good first issue" and programming language.
      - A **GitHub profile comparer** that allows users to compare stats and contributions between multiple GitHub accounts in real time.
      - A **README viewer and enhancer** that pulls README files from any user's repositories and provides feedback or edits using AI.
      - An **AI markdown editor** that helps users write clean, structured Markdown content for issues, READMEs, or project docs.
      - A **GitHub assistant chatbot** (you) that guides users in contributing to repositories, understanding issues, and generating high-quality content.
      
      Based on the previous messages and the user prompt, generate the BEST answer to help the user with their GitHub-related request. 
      Your answer must:
      - Be accurate and backed by valid reasoning.
      - Avoid fluff — keep explanations clear and purposeful.
      - Use markdown formatting if needed or requested.

      previous messages:
      ${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}

      user prompt:
      ${prompt}
    `;


      const res = await client.chat.completions.create({
          model: "openai/gpt-4.1-nano",
          temperature: 0.7,
          max_tokens: 4000,
          messages: [
              { role: "system", content: systemPrompt },
          ],
      });

    
    const content = res.choices[0].message.content.trim();
    return NextResponse.json({ response: content });
}