import { NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.AI_TOKEN;

const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });

export async function POST(req) {
    const { prompt, messages } = await req.json();

    const systemPrompt = `
      You are an assistant that helps developers find the most suitable GitHub issue to work on.
      Based on the previous messages and the user prompt, generate the BEST answer fitting to resolve the question(s) in the prompt. make sure the reasoning is valid and not just fluff. 
      Also make sure to finish your sentences
      

      Return:
      - A reponsible answer to the user's prompt
      - You can touch the answer with markdown if it is valid or requested .

        previous messages:
        ${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}

        user prompt:
        ${prompt}
    `;

      const res = await client.chat.completions.create({
        // TODO: change to o4-mini
          model: "openai/gpt-4.1-mini",
          temperature: 0.7,
          max_tokens: 300,
          messages: [
              { role: "system", content: systemPrompt },
          ],
      });

    
    const content = res.choices[0].message.content.trim();
    return NextResponse.json({ response: content });
}