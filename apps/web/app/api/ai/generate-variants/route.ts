import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';

const GENERATION_SYSTEM_PROMPT = `You are an AI agent architect for GalaxyCo's Agent Builder.

Your job is to generate 3 distinct agent workflow variants from a user's prompt:

1. **BASIC**: Simple, linear workflow with 3-5 core steps. Minimal integrations. Best for beginners.
2. **ADVANCED**: Comprehensive workflow with 7-10 steps, conditional logic, multiple integrations. Full-featured.
3. **MINIMAL**: Ultra-simple 2-3 step workflow. Fast setup, essential functionality only.

For each variant, provide:
- Clear name and description
- Step-by-step workflow (sequential actions)
- Required integrations (Calendar, Email, CRM, Slack, etc.)
- Estimated complexity (low/medium/high)

Output valid JSON with this structure:
{
  "variants": [
    {
      "type": "basic",
      "name": "Agent Name",
      "description": "Brief description",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "integrations": ["Calendar", "Email"],
      "complexity": "low"
    },
    // ... advanced and minimal variants
  ]
}

Be specific and actionable. Each step should be a clear action.`;

interface GeneratedVariant {
  type: 'basic' | 'advanced' | 'minimal';
  name: string;
  description: string;
  steps: string[];
  integrations: string[];
  complexity: 'low' | 'medium' | 'high';
}

function createWorkflowNodes(steps: string[], variantId: string) {
  const nodes = steps.map((step, index) => {
    const isStart = index === 0;
    const isEnd = index === steps.length - 1;

    return {
      id: `${variantId}-node-${index}`,
      type: isStart ? 'start' : isEnd ? 'end' : 'action',
      label: step,
      description: step,
      position: { x: 150, y: 100 + index * 120 },
    };
  });

  const edges = steps.slice(0, -1).map((_, index) => ({
    id: `${variantId}-edge-${index}`,
    source: `${variantId}-node-${index}`,
    target: `${variantId}-node-${index + 1}`,
  }));

  return { nodes, edges };
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, enhancedPrompt, templateId } = body;

    const finalPrompt = enhancedPrompt || prompt;

    if (!finalPrompt || typeof finalPrompt !== 'string' || finalPrompt.trim().length < 10) {
      return NextResponse.json({ error: 'Prompt must be at least 10 characters' }, { status: 400 });
    }

    // Try OpenAI first
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return NextResponse.json({ error: 'No AI API keys configured' }, { status: 500 });
    }

    let generatedVariants: GeneratedVariant[];

    if (openaiKey) {
      const openai = new OpenAI({ apiKey: openaiKey });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: GENERATION_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Generate 3 agent variants for this description:\n\n"${finalPrompt}"\n\nReturn valid JSON only, no markdown.`,
          },
        ],
        max_tokens: 1500,
        temperature: 0.8,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(response);
      generatedVariants = parsed.variants || [];
    } else {
      // Use Anthropic
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          system: GENERATION_SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `Generate 3 agent variants for this description:\n\n"${finalPrompt}"\n\nReturn valid JSON only, no markdown.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.content[0]?.text || '{}';

      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

      const parsed = JSON.parse(jsonText);
      generatedVariants = parsed.variants || [];
    }

    // Transform generated variants into full variant objects
    const variants = generatedVariants.map((gv) => {
      const variantId = `var_${nanoid(12)}`;
      const { nodes, edges } = createWorkflowNodes(gv.steps, variantId);

      return {
        id: variantId,
        type: gv.type,
        name: gv.name,
        description: gv.description,
        workflow: nodes,
        edges,
        estimatedSteps: gv.steps.length,
        complexity: gv.complexity,
        integrations: gv.integrations,
        metadata: {
          generatedAt: new Date(),
          modelUsed: openaiKey ? 'gpt-4o-mini' : 'claude-3-5-sonnet',
        },
      };
    });

    // Generate suggestions
    const suggestions = [
      'Add error handling for failed integrations',
      'Consider testing with sample data first',
      'Review required permissions for integrations',
    ];

    return NextResponse.json({
      variants,
      suggestions,
    });
  } catch (error) {
    console.error('Generate variants API error:', error);
    return NextResponse.json({ error: 'Failed to generate agent variants' }, { status: 500 });
  }
}
