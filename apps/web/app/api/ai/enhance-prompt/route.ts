import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const ENHANCEMENT_SYSTEM_PROMPT = `You are an AI prompt enhancement specialist for GalaxyCo's Agent Builder.

Your job is to take a user's rough agent description and enhance it with:
1. **Specificity**: Add concrete details about triggers, data sources, and outputs
2. **Structure**: Organize the workflow logically with clear steps
3. **Best Practices**: Suggest error handling, fallback logic, and notifications
4. **Integrations**: Identify required integrations (Calendar, Email, CRM, Slack, etc.)
5. **Frameworks**: Reference relevant frameworks (e.g., SPICED for sales notes)

**Input**: User's rough description
**Output**: Enhanced prompt that's clear, actionable, and complete

Keep the enhanced version conversational but structured. Add 2-3 key improvements without over-complicating.`;

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: "Prompt must be at least 10 characters" },
        { status: 400 },
      );
    }

    // Try OpenAI first, fallback to Anthropic
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return NextResponse.json(
        { error: "No AI API keys configured" },
        { status: 500 },
      );
    }

    let enhanced: string;
    let improvements: string[] = [];
    let confidence: number;

    if (openaiKey) {
      const openai = new OpenAI({ apiKey: openaiKey });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: ENHANCEMENT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Enhance this agent description:\n\n"${prompt}"\n\nProvide the enhanced version and list 2-3 key improvements made.`,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "";

      // Parse response (expecting format: "Enhanced: ... \n\nImprovements:\n- ...")
      const parts = response.split("Improvements:");
      enhanced = parts[0].replace("Enhanced:", "").trim();

      if (parts[1]) {
        improvements = parts[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim());
      }

      confidence = 0.85;
    } else {
      // Use Anthropic
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 600,
          system: ENHANCEMENT_SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Enhance this agent description:\n\n"${prompt}"\n\nProvide the enhanced version and list 2-3 key improvements made.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.content[0]?.text || "";

      const parts = text.split("Improvements:");
      enhanced = parts[0].replace("Enhanced:", "").trim();

      if (parts[1]) {
        improvements = parts[1]
          .split("\n")
          .filter((line: string) => line.trim().startsWith("-"))
          .map((line: string) => line.replace(/^-\s*/, "").trim());
      }

      confidence = 0.85;
    }

    return NextResponse.json({
      original: prompt,
      enhanced,
      improvements,
      confidence,
    });
  } catch (error) {
    console.error("Enhance prompt API error:", error);
    return NextResponse.json(
      { error: "Failed to enhance prompt" },
      { status: 500 },
    );
  }
}
