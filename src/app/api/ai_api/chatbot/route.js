import { NextResponse } from "next/server";
import OpenAI from "openai";
require("dotenv").config();

const token = process.env.AI_TOKEN;

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });

export async function POST(req) {
    const { prompt, messages } = await req.json();

    const systemPrompt = `

        previous messages:
        ${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}

        user prompt:
        ${prompt}
    `;

    // await console.log(systemPrompt);
      const res = await client.chat.completions.create({
          model: "openai/gpt-4.1-mini",
          temperature: 0.7,
          max_tokens: 300,
          messages: [
              { role: "system", content: systemPrompt },
          ],
      });

    
    const content = res.choices[0].message.content.trim();
    // await console.log(content);
    return NextResponse.json({ response: content });
}