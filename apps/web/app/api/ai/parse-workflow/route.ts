/**
 * Parse Workflow API - Natural Language → Workflow Structure
 *
 * Uses GPT-4 with JSON mode to convert natural language descriptions
 * into structured workflow nodes and edges.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import OpenAI from 'openai';

// Request schema
const ParseWorkflowRequestSchema = z.object({
  input: z.string().min(1, 'Workflow description is required'),
  workspaceId: z.string(),
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request
    const body = await req.json();
    const { input, workspaceId } = ParseWorkflowRequestSchema.parse(body);

    // System prompt for workflow parsing
    const systemPrompt = `You are a workflow automation expert. Convert natural language descriptions into structured workflow definitions.

Your task is to analyze the user's description and create a workflow with:
- Nodes: Individual steps in the workflow (start, action, condition, integration, end)
- Edges: Connections between nodes showing the flow

Node types:
- start: The beginning of the workflow
- action: An action to perform (send email, create task, etc.)
- condition: A decision point (if/then logic)
- integration: External service integration (Gmail, Slack, etc.)
- end: The end of the workflow

Return a JSON object with:
{
  "name": "Short workflow name (max 50 chars)",
  "description": "Brief description of what the workflow does",
  "nodes": [
    {
      "id": "unique-id",
      "type": "start|action|condition|integration|end",
      "label": "Node display name",
      "description": "What this node does (optional)",
      "integration": "Service name if type is integration (optional)",
      "config": {} // Configuration object (optional)
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "Optional label for edge",
      "condition": "Optional condition description"
    }
  ]
}

Guidelines:
1. Always start with a "start" node and end with an "end" node
2. Use descriptive labels that explain what each step does
3. Identify integrations (Gmail, Slack, CRM, etc.) and mark them as "integration" type
4. For conditional logic, use "condition" nodes with multiple outgoing edges
5. Keep workflows focused and avoid unnecessary complexity
6. Generate sequential IDs (node-1, node-2, etc.)`;

    // Call GPT-4 with JSON mode
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Convert this workflow description into a structured workflow:\n\n${input}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const flow = JSON.parse(responseContent);

    // Validate the structure (basic validation)
    if (!flow.nodes || !Array.isArray(flow.nodes) || flow.nodes.length === 0) {
      throw new Error('Invalid workflow structure');
    }

    if (!flow.edges || !Array.isArray(flow.edges)) {
      throw new Error('Invalid workflow structure');
    }

    // Return the parsed flow
    return NextResponse.json({
      flow: {
        name: flow.name || 'Untitled Workflow',
        description: flow.description || '',
        nodes: flow.nodes,
        edges: flow.edges,
      },
    });
  } catch (error) {
    console.error('Error parsing workflow:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to parse workflow',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
