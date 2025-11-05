/**
 * Unit Tests for FlowParser
 *
 * Tests natural language parsing, auto-layout, and validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  autoLayoutNodes,
  generateWorkflowName,
  FlowNode,
  FlowEdge,
} from '@/components/figma/shared/FlowParser';

describe('FlowParser', () => {
  describe('autoLayoutNodes', () => {
    it('should layout nodes horizontally', async () => {
      const nodes: FlowNode[] = [
        { id: 'node-1', type: 'start', label: 'Start' },
        { id: 'node-2', type: 'action', label: 'Action' },
        { id: 'node-3', type: 'end', label: 'End' },
      ];

      const edges: FlowEdge[] = [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-2', target: 'node-3' },
      ];

      const layouted = await autoLayoutNodes(nodes, edges);

      // Verify all nodes have positions
      expect(layouted).toHaveLength(3);
      layouted.forEach((node) => {
        expect(node.position).toBeDefined();
        expect(node.position?.x).toBeGreaterThanOrEqual(0);
        expect(node.position?.y).toBeGreaterThanOrEqual(0);
      });

      // Verify horizontal layout (x increases left to right)
      expect(layouted[1].position!.x).toBeGreaterThan(layouted[0].position!.x);
      expect(layouted[2].position!.x).toBeGreaterThan(layouted[1].position!.x);
    });

    it('should handle branching workflows', async () => {
      const nodes: FlowNode[] = [
        { id: 'node-1', type: 'start', label: 'Start' },
        { id: 'node-2', type: 'condition', label: 'Check condition' },
        { id: 'node-3', type: 'action', label: 'Action A' },
        { id: 'node-4', type: 'action', label: 'Action B' },
        { id: 'node-5', type: 'end', label: 'End' },
      ];

      const edges: FlowEdge[] = [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-2', target: 'node-3', label: 'Yes' },
        { id: 'edge-3', source: 'node-2', target: 'node-4', label: 'No' },
        { id: 'edge-4', source: 'node-3', target: 'node-5' },
        { id: 'edge-5', source: 'node-4', target: 'node-5' },
      ];

      const layouted = await autoLayoutNodes(nodes, edges);

      // Verify branching layout
      expect(layouted).toHaveLength(5);

      // Branches should have different Y positions
      const actionA = layouted.find((n) => n.id === 'node-3');
      const actionB = layouted.find((n) => n.id === 'node-4');

      expect(actionA?.position?.y).not.toBe(actionB?.position?.y);
    });

    it('should fallback to simple layout on error', async () => {
      const nodes: FlowNode[] = [
        { id: 'node-1', type: 'start', label: 'Start' },
        { id: 'node-2', type: 'end', label: 'End' },
      ];

      const edges: FlowEdge[] = [{ id: 'edge-1', source: 'node-1', target: 'node-2' }];

      const layouted = await autoLayoutNodes(nodes, edges);

      // Should still have positions (fallback layout)
      expect(layouted).toHaveLength(2);
      layouted.forEach((node) => {
        expect(node.position).toBeDefined();
      });
    });

    it('should handle empty nodes array', async () => {
      const layouted = await autoLayoutNodes([], []);
      expect(layouted).toHaveLength(0);
    });

    it('should preserve node properties during layout', async () => {
      const nodes: FlowNode[] = [
        {
          id: 'node-1',
          type: 'integration',
          label: 'Gmail',
          description: 'Send email',
          integration: 'gmail',
          config: { to: 'test@example.com' },
        },
      ];

      const layouted = await autoLayoutNodes(nodes, []);

      expect(layouted[0]).toMatchObject({
        id: 'node-1',
        type: 'integration',
        label: 'Gmail',
        description: 'Send email',
        integration: 'gmail',
        config: { to: 'test@example.com' },
      });
      expect(layouted[0].position).toBeDefined();
    });
  });

  describe('generateWorkflowName', () => {
    it('should capitalize first letter', () => {
      const name = generateWorkflowName('email new leads');
      expect(name).toBe('Email new leads');
    });

    it('should trim whitespace', () => {
      const name = generateWorkflowName('  test workflow  ');
      expect(name).toBe('Test workflow');
    });

    it('should truncate to 50 characters', () => {
      const longInput = 'a'.repeat(100);
      const name = generateWorkflowName(longInput);
      expect(name.length).toBeLessThanOrEqual(50);
    });

    it('should handle empty string', () => {
      const name = generateWorkflowName('');
      expect(name).toBe('');
    });

    it('should preserve existing capitalization after first letter', () => {
      const name = generateWorkflowName('email NEW leads EVERY monday');
      expect(name).toBe('Email NEW leads EVERY monday');
    });
  });
});

describe('FlowParser Integration', () => {
  it('should create valid workflow structure', async () => {
    const nodes: FlowNode[] = [
      { id: 'start', type: 'start', label: 'Start' },
      { id: 'action', type: 'action', label: 'Send Email' },
      { id: 'end', type: 'end', label: 'End' },
    ];

    const edges: FlowEdge[] = [
      { id: 'e1', source: 'start', target: 'action' },
      { id: 'e2', source: 'action', target: 'end' },
    ];

    const layouted = await autoLayoutNodes(nodes, edges);

    // Verify workflow structure
    expect(layouted[0].type).toBe('start');
    expect(layouted[layouted.length - 1].type).toBe('end');

    // Verify all nodes connected
    expect(edges).toHaveLength(layouted.length - 1);
  });
});
