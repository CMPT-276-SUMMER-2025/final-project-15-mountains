import { NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.AI_TOKEN;

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });

export async function POST(req) {
    const { prompt, issues } = await req.json();

    const systemPrompt = `
        You are an assistant that helps developers find the most suitable GitHub issue to work on.
        Based on the user's request and their interests, pick the BEST fitting issue from the following list. make sure the reasoning is valid and not just fluff. if u cant pick any from the info given pick a easy one and explain that this is the closest match but if more data is given you can give better respone.
        Also make sure to finish your sentences
        Return:
        - The 0-based index (just a number on the first line)
        - Then a short explanation (on the second line) about why this issue fits best

        Issues:
        ${issues.map((issue, i) => `${i}. ${issue.title} - ${issue.body}`).join("\n")}

        User input:
        "${prompt}"

        Reply with just the number (0-${issues.length - 1}) on the first line, and an explanation on the second line.
        `;

    const res = await client.chat.completions.create({
    model: "openai/gpt-4o",
    temperature: 0.7,
    max_tokens: 300,
    messages: [
        { role: "system", content: systemPrompt },
    ],
    });

    const content = res.choices[0].message.content.trim();
    const [indexLine, ...explanationLines] = content.split("\n");
    const index = parseInt(indexLine, 10);
    const safeIndex = isNaN(index) ? 0 : Math.max(0, Math.min(index, issues.length - 1));
    const explanation = explanationLines.join("\n").trim();
    return NextResponse.json({ index: safeIndex, explanation });
}
