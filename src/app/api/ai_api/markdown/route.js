import { NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.AI_TOKEN;

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });

export async function POST(req) {
    const { prompt, markdown } = await req.json();

    const systemPrompt = `
        You are an AI BOT whos job is to edit the given markdown with the users input.
         If previous markdown is blank then use the user input to generate a new markdown. 
         ONLY SEND BACK VALID MARKDOWN AND NOTHING ELSE

        previous markdown:
        ${markdown}

        User input:
        "${prompt}"

        Reply with only valid markdown
        `;

    const res = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    temperature: 0.1,
    max_tokens: 300,
    messages: [
        { role: "system", content: systemPrompt },
    ],
    });

    const content = res.choices[0].message.content.trim();
    return NextResponse.json({ newMarkdown: content});
}
