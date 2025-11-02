/**
 * Workflow Template Types
 * Type definitions for workflow templates
 */

import { z } from 'zod';

// Template category enum
export const TEMPLATE_CATEGORIES = [
  'sales',
  'marketing',
  'support',
  'operations',
  'hr',
  'finance',
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

// Template complexity
export type TemplateComplexity = 'beginner' | 'intermediate' | 'advanced';

// Workflow node type (from React Flow)
export interface WorkflowNode {
  id: string;
  type: 'start' | 'action' | 'condition' | 'integration' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    integration?: string;
    config?: Record<string, any>;
  };
}

// Workflow edge type (from React Flow)
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

// Template preview data
export interface TemplatePreview {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

// Template metadata
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  tags: string[];
  thumbnailUrl: string | null;
  previewData: TemplatePreview;
  complexity: TemplateComplexity | null;
  estimatedTime: number | null; // in minutes
  uses: number;
  rating: number | null;
  featured: boolean | null;
  authorId: string;
  createdAt: Date;
}

// Create template schema
export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(TEMPLATE_CATEGORIES),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z.string().url().optional(),
  previewData: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z
      .object({
        x: z.number(),
        y: z.number(),
        zoom: z.number(),
      })
      .optional(),
  }),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedTime: z.number().positive().optional(),
});

export type CreateTemplateRequest = z.infer<typeof CreateTemplateSchema>;
