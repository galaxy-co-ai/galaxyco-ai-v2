import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/resources
 * List available resources (stub for now - returns mock data)
 *
 * Query params:
 * - workspaceId: optional
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock resources for now - can be replaced with database query later
    const mockResources = [
      {
        id: '1',
        title: 'Getting Started Guide',
        description: 'Learn the basics of GalaxyCo.ai platform',
        type: 'document',
        category: 'tutorials',
        href: '/resources/getting-started',
      },
      {
        id: '2',
        title: 'API Documentation',
        description: 'Complete API reference and examples',
        type: 'documentation',
        category: 'technical',
        href: '/resources/api-docs',
      },
      {
        id: '3',
        title: 'Video Tutorials',
        description: 'Step-by-step video guides',
        type: 'video',
        category: 'tutorials',
        href: '/resources/videos',
      },
      {
        id: '4',
        title: 'Best Practices',
        description: 'Recommended patterns and workflows',
        type: 'document',
        category: 'guides',
        href: '/resources/best-practices',
      },
    ];

    return NextResponse.json({
      resources: mockResources,
      total: mockResources.length,
    });
  } catch (error) {
    logger.error('List resources error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}
