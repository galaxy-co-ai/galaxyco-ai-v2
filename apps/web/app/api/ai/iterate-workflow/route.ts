import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireSession } from '@/lib/services/user-session';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';

const ITERATION_SYSTEM_PROMPT = `You are an AI workflow architect for GalaxyCo's Agent Builder.

Your job is to modify an existing agent workflow based on user feedback. The user will describe changes they want, and you'll update the workflow accordingly.

**Common requests:**
- Add new steps (e.g., "Add Slack notification")
- Modify existing steps (e.g., "Change email template")
- Add error handling or fallback logic
- Include data validation
- Integrate new services

**Output format (JSON):**
{
  "explanation": "Brief explanation of what changed",
  "steps": ["Updated step 1", "Updated step 2", "New step 3"],
  "integrations": ["Calendar", "Email", "Slack"]
}

Be concise and actionable. Update only what's necessary based on the user's request.`;

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  description?: string;
  integration?: string;
  position: { x: number; y: number };
}

function createWorkflowNodes(steps: string[], variantId: string, existingNodes: WorkflowNode[]): { nodes: WorkflowNode[]; edges: any[] } {
  // Reuse existing node positions where possible
  const nodes = steps.map((step, index) => {
    const existingNode = existingNodes[index];
    const isStart = index === 0;
    const isEnd = index === steps.length - 1;
    
    return {
      id: existingNode?.id || `${variantId}-node-${index}`,
      type: isStart ? 'start' : isEnd ? 'end' : 'action',
      label: step,
      description: step,
      position: existingNode?.position || { x: 150, y: 100 + index * 120 },
    };
  });

  const edges = steps.slice(0, -1).map((_, index) => ({
    id: `${variantId}-edge-${index}`,
    source: nodes[index].id,
    target: nodes[index + 1].id,
  }));

  return { nodes, edges };
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const { currentWorkflow, currentEdges, message, variantId } = body;

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json(
        { error: 'Message must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!currentWorkflow || !Array.isArray(currentWorkflow)) {
      return NextResponse.json(
        { error: 'Current workflow is required' },
        { status: 400 }
      );
    }

    // Extract current steps
    const currentSteps = currentWorkflow.map((node: WorkflowNode) => node.label);

    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return NextResponse.json(
        { error: 'No AI API keys configured' },
        { status: 500 }
      );
    }

    let response: { explanation: string; steps: string[]; integrations: string[] };

    if (openaiKey) {
      const openai = new OpenAI({ apiKey: openaiKey });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: ITERATION_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Current workflow steps:\n${currentSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nUser request: "${message}"\n\nReturn updated workflow as JSON.`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const result = completion.choices[0]?.message?.content || '{}';
      response = JSON.parse(result);
    } else {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          system: ITERATION_SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `Current workflow steps:\n${currentSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nUser request: "${message}"\n\nReturn updated workflow as JSON.`,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Anthropic API error: ${res.statusText}`);
      }

      const data = await res.json();
      const text = data.content[0]?.text || '{}';
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      
      response = JSON.parse(jsonText);
    }

    // Generate updated workflow
    const { nodes, edges } = createWorkflowNodes(
      response.steps,
      variantId || `var_${nanoid(12)}`,
      currentWorkflow
    );

    return NextResponse.json({
      explanation: response.explanation,
      workflow: nodes,
      edges,
      integrations: response.integrations,
    });
  } catch (error) {
    console.error('Iterate workflow API error:', error);
    return NextResponse.json(
      { error: 'Failed to iterate workflow' },
      { status: 500 }
    );
  }
}
