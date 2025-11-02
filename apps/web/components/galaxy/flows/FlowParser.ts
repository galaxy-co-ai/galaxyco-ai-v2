/**
 * Flow Parser - Natural Language → Visual Workflow
 *
 * Converts natural language descriptions into workflow node structures
 * using GPT-4 with JSON mode for structured output.
 */

import { z } from 'zod';

// Workflow node schema
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['start', 'action', 'condition', 'integration', 'end']),
  label: z.string(),
  description: z.string().optional(),
  integration: z.string().optional(),
  config: z.record(z.any()).optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  condition: z.string().optional(),
});

export const ParsedFlowSchema = z.object({
  name: z.string(),
  description: z.string(),
  nodes: z.array(FlowNodeSchema),
  edges: z.array(FlowEdgeSchema),
});

export type FlowNode = z.infer<typeof FlowNodeSchema>;
export type FlowEdge = z.infer<typeof FlowEdgeSchema>;
export type ParsedFlow = z.infer<typeof ParsedFlowSchema>;

/**
 * Parse natural language into a workflow structure
 */
export async function parseNaturalLanguageToFlow(
  input: string,
  workspaceId: string,
): Promise<ParsedFlow> {
  try {
    const response = await fetch('/api/ai/parse-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        workspaceId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to parse workflow');
    }

    const data = await response.json();
    return ParsedFlowSchema.parse(data.flow);
  } catch (error) {
    console.error('Error parsing natural language to flow:', error);
    throw new Error('Failed to convert your description into a workflow. Please try again.');
  }
}

/**
 * Auto-layout nodes using ELK (Layered algorithm)
 */
export async function autoLayoutNodes(nodes: FlowNode[], edges: FlowEdge[]): Promise<FlowNode[]> {
  const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
  const elk = new ELK();

  // Convert to ELK format
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '80',
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: 200,
      height: 80,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layout = await elk.layout(elkGraph);

    // Apply positions to nodes
    return nodes.map((node) => {
      const layoutNode = layout.children?.find((n) => n.id === node.id);
      return {
        ...node,
        position: {
          x: layoutNode?.x ?? 0,
          y: layoutNode?.y ?? 0,
        },
      };
    });
  } catch (error) {
    console.error('Auto-layout failed:', error);
    // Fallback to simple vertical layout
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: index * 300,
        y: 100,
      },
    }));
  }
}

/**
 * Generate workflow name from input
 */
export function generateWorkflowName(input: string): string {
  // Take first 50 chars, capitalize first letter
  const name = input.slice(0, 50).trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}
