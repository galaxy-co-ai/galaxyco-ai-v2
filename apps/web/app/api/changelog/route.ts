import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * GET /api/changelog
 * Get product changelog entries
 *
 * Query params:
 * - limit?: number (default: 50)
 * - offset?: number (default: 0)
 * - version?: string (filter by version)
 * - type?: 'feature' | 'improvement' | 'bugfix' | 'breaking'
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const version = searchParams.get('version');
    const type = searchParams.get('type');

    // TODO: Store changelog in database or fetch from external source
    // For now, return stub data with recent changes
    const stubChangelog = [
      {
        id: 'v2.0.0',
        version: '2.0.0',
        date: '2025-11-03',
        title: 'GalaxyCo.ai 2.0 Launch',
        description: 'Major platform update with visual workflow builder and integrations',
        type: 'feature',
        changes: [
          {
            type: 'feature',
            title: 'Visual Workflow Builder',
            description:
              'Create complex workflows with drag-and-drop interface powered by React Flow',
          },
          {
            type: 'feature',
            title: 'Gmail Integration',
            description: 'Send and receive emails directly from workflows',
          },
          {
            type: 'feature',
            title: 'Slack Integration',
            description: 'Post messages and read channels from workflows',
          },
          {
            type: 'feature',
            title: 'CRM Connectors',
            description: 'Connect with HubSpot and Pipedrive for customer data sync',
          },
          {
            type: 'feature',
            title: 'Template Library',
            description: '10 pre-built workflow templates to get started quickly',
          },
          {
            type: 'improvement',
            title: 'Enhanced Security',
            description: 'Multi-tenant isolation on all API endpoints',
          },
          {
            type: 'improvement',
            title: 'Server Actions',
            description: 'Type-safe mutations using Next.js 15 Server Actions',
          },
        ],
        breaking: false,
      },
      {
        id: 'v1.5.0',
        version: '1.5.0',
        date: '2025-10-15',
        title: 'Agent Marketplace',
        description: 'Discover and install pre-built AI agents',
        type: 'feature',
        changes: [
          {
            type: 'feature',
            title: 'Agent Marketplace',
            description: 'Browse and install agents from the marketplace',
          },
          {
            type: 'feature',
            title: 'Agent Templates',
            description: '50+ pre-built agent templates',
          },
        ],
        breaking: false,
      },
      {
        id: 'v1.0.0',
        version: '1.0.0',
        date: '2025-09-01',
        title: 'GalaxyCo.ai Launch',
        description: 'Initial platform launch',
        type: 'feature',
        changes: [
          {
            type: 'feature',
            title: 'AI Agent Builder',
            description: 'Create custom AI agents with natural language',
          },
          {
            type: 'feature',
            title: 'Knowledge Base',
            description: 'Upload documents for RAG-powered AI assistance',
          },
          {
            type: 'feature',
            title: 'Multi-tenant Platform',
            description: 'Workspace-based isolation for teams',
          },
        ],
        breaking: false,
      },
    ];

    // Filter by version if provided
    let changelog = stubChangelog;
    if (version) {
      changelog = changelog.filter((entry) => entry.version === version);
    }

    // Filter by type if provided
    if (type && ['feature', 'improvement', 'bugfix', 'breaking'].includes(type)) {
      changelog = changelog.filter((entry) => entry.type === type);
    }

    // Apply pagination
    const paginatedChangelog = changelog.slice(offset, offset + limit);

    return NextResponse.json({
      changelog: paginatedChangelog,
      total: changelog.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Changelog API Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch changelog',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/changelog
 * Create a new changelog entry (admin only)
 *
 * NOTE: This would typically be managed through a CMS or version control
 * For now, this is a stub endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check
    // TODO: Store in database or integrate with CMS

    const body = await req.json();

    const CreateChangelogSchema = z.object({
      version: z.string(),
      title: z.string(),
      description: z.string(),
      type: z.enum(['feature', 'improvement', 'bugfix', 'breaking']),
      changes: z.array(
        z.object({
          type: z.enum(['feature', 'improvement', 'bugfix', 'breaking']),
          title: z.string(),
          description: z.string(),
        }),
      ),
      breaking: z.boolean().optional(),
    });

    const validated = CreateChangelogSchema.parse(body);

    // TODO: Insert into database
    console.log('[Changelog Entry Created]', validated);

    return NextResponse.json(
      {
        message: 'Changelog creation not yet implemented',
        note: 'Use version control or CMS for changelog management',
      },
      { status: 501 },
    );
  } catch (error) {
    console.error('[Changelog Create Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors[0]?.message || 'Validation failed',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create changelog entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
