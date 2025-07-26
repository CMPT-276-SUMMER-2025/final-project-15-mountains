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
        You are an AI assistant. Your job is to edit the provided Markdown based on the user's input.
        If no previous Markdown is provided, generate a new Markdown file from the input.
        Return only valid Markdown — do not wrap it in triple backticks (\`\`\`).
        At the bottom, include one line describing what you changed.

        previous markdown:
        ${markdown}

        User input:
        "${prompt}"

        Reply with only valid markdown then on the bottom line reply with an explnation of what u changed
        `;

    const res = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    temperature: 0.1,
    max_tokens: 5000,
    messages: [
        { role: "system", content: systemPrompt },
    ],
    });
    const content = res.choices[0].message.content.trim();
    const lines = content.split("\n");
    let explanation = "";
    let markdownContent = content;

    if (lines.length > 1) {
        explanation = lines[lines.length - 1];
        markdownContent = lines.slice(0, -1).join("\n").trim();
    }
    return NextResponse.json({
        newMarkdown: markdownContent,
        explanation: explanation,
    });
}
