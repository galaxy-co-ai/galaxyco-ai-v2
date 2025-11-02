/**
 * Pre-built Templates Tests
 * Testing pre-built workflow template validity
 */

import { describe, it, expect } from 'vitest';
import { PREBUILT_TEMPLATES } from '@/lib/templates/prebuilt-templates';
import { TEMPLATE_CATEGORIES } from '@/lib/templates/types';

describe('Pre-built Templates', () => {
  it('should have at least 10 templates', () => {
    expect(PREBUILT_TEMPLATES).toHaveLength(10);
  });

  describe('Template Structure', () => {
    it('should have valid structure for all templates', () => {
      PREBUILT_TEMPLATES.forEach((template) => {
        expect(template.name).toBeDefined();
        expect(template.category).toBeDefined();
        expect(template.previewData).toBeDefined();
        expect(template.previewData.nodes).toBeDefined();
        expect(template.previewData.edges).toBeDefined();
      });
    });

    it('should have valid categories', () => {
      PREBUILT_TEMPLATES.forEach((template) => {
        expect(TEMPLATE_CATEGORIES).toContain(template.category as any);
      });
    });

    it('should have at least one node in each template', () => {
      PREBUILT_TEMPLATES.forEach((template) => {
        expect(template.previewData.nodes.length).toBeGreaterThan(0);
      });
    });

    it('should have start and end nodes', () => {
      PREBUILT_TEMPLATES.forEach((template) => {
        const hasStart = template.previewData.nodes.some((n) => n.type === 'start');
        const hasEnd = template.previewData.nodes.some((n) => n.type === 'end');

        expect(hasStart).toBe(true);
        expect(hasEnd).toBe(true);
      });
    });

    it('should have valid edge connections', () => {
      PREBUILT_TEMPLATES.forEach((template) => {
        const nodeIds = template.previewData.nodes.map((n) => n.id);

        template.previewData.edges.forEach((edge) => {
          expect(nodeIds).toContain(edge.source);
          expect(nodeIds).toContain(edge.target);
        });
      });
    });
  });

  describe('Template Categories', () => {
    it('should have sales templates', () => {
      const salesTemplates = PREBUILT_TEMPLATES.filter((t) => t.category === 'sales');

      expect(salesTemplates.length).toBeGreaterThan(0);
    });

    it('should have marketing templates', () => {
      const marketingTemplates = PREBUILT_TEMPLATES.filter((t) => t.category === 'marketing');

      expect(marketingTemplates.length).toBeGreaterThan(0);
    });

    it('should have support templates', () => {
      const supportTemplates = PREBUILT_TEMPLATES.filter((t) => t.category === 'support');

      expect(supportTemplates.length).toBeGreaterThan(0);
    });

    it('should have operations templates', () => {
      const opsTemplates = PREBUILT_TEMPLATES.filter((t) => t.category === 'operations');

      expect(opsTemplates.length).toBeGreaterThan(0);
    });
  });

  describe('Template Metadata', () => {
    it('should have complexity ratings', () => {
      const templatesWithComplexity = PREBUILT_TEMPLATES.filter((t) => t.complexity);

      expect(templatesWithComplexity.length).toBeGreaterThan(0);
    });

    it('should have estimated times', () => {
      const templatesWithTime = PREBUILT_TEMPLATES.filter((t) => t.estimatedTime);

      expect(templatesWithTime.length).toBeGreaterThan(0);
    });

    it('should have tags', () => {
      PREBUILT_TEMPLATES.forEach((template) => {
        expect(Array.isArray(template.tags)).toBe(true);
        expect(template.tags.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration Usage', () => {
    it('should use Gmail integration in at least one template', () => {
      const gmailTemplates = PREBUILT_TEMPLATES.filter((t) =>
        t.previewData.nodes.some((n: any) => n.data?.integration === 'gmail'),
      );

      expect(gmailTemplates.length).toBeGreaterThan(0);
    });

    it('should use Slack integration in at least one template', () => {
      const slackTemplates = PREBUILT_TEMPLATES.filter((t) =>
        t.previewData.nodes.some((n: any) => n.data?.integration === 'slack'),
      );

      expect(slackTemplates.length).toBeGreaterThan(0);
    });

    it('should use CRM integration in at least one template', () => {
      const crmTemplates = PREBUILT_TEMPLATES.filter((t) =>
        t.previewData.nodes.some(
          (n: any) => n.data?.integration === 'hubspot' || n.data?.integration === 'pipedrive',
        ),
      );

      expect(crmTemplates.length).toBeGreaterThan(0);
    });
  });
});
