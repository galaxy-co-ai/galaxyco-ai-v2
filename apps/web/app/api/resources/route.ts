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

<<<<<<< Updated upstream
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
=======
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const query = searchParams.get('query');
    const type = searchParams.get('type');
    const collectionId = searchParams.get('collectionId');
    const isFavorite = searchParams.get('isFavorite');
    const isArchived = searchParams.get('isArchived');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    z.string().uuid().parse(workspaceId);

    // Build query with multi-tenant isolation
    const conditions = [eq(knowledgeItems.workspaceId, workspaceId)];

    if (type && ['document', 'url', 'image', 'text'].includes(type)) {
      conditions.push(eq(knowledgeItems.type, type as any));
    }

    if (collectionId) {
      z.string().uuid().parse(collectionId);
      conditions.push(eq(knowledgeItems.collectionId, collectionId));
    }

    if (isFavorite !== null) {
      conditions.push(eq(knowledgeItems.isFavorite, isFavorite === 'true'));
    }

    if (isArchived !== null) {
      conditions.push(eq(knowledgeItems.isArchived, isArchived === 'true'));
    }

    if (query) {
      conditions.push(
        or(like(knowledgeItems.title, `%${query}%`)!, like(knowledgeItems.content, `%${query}%`)!)!,
      );
    }

    const resources = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResources = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions));
>>>>>>> Stashed changes

    return NextResponse.json({
      resources: mockResources,
      total: mockResources.length,
    });
  } catch (error) {
<<<<<<< Updated upstream
    logger.error('List resources error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
=======
    console.error('[Resources API Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch resources',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/resources
 * Create a new resource
 *
 * DEPRECATED: Use Server Actions in /lib/actions/resource-actions.ts instead
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const CreateResourceSchema = z.object({
      workspaceId: z.string().uuid(),
      title: z.string().min(1).max(255),
      type: z.enum(['document', 'url', 'image', 'text']),
      sourceUrl: z.string().url().optional(),
      fileName: z.string().optional(),
      fileSize: z.number().optional(),
      mimeType: z.string().optional(),
      content: z.string().optional(),
      summary: z.string().optional(),
      collectionId: z.string().uuid().optional(),
      tags: z.array(z.string()).optional(),
      metadata: z.record(z.any()).optional(),
    });

    const validated = CreateResourceSchema.parse(body);

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [resource] = await db
      .insert(knowledgeItems)
      .values({
        workspaceId: validated.workspaceId,
        title: validated.title,
        type: validated.type,
        sourceUrl: validated.sourceUrl || null,
        fileName: validated.fileName || null,
        fileSize: validated.fileSize || null,
        mimeType: validated.mimeType || null,
        content: validated.content || null,
        summary: validated.summary || null,
        status: 'ready',
        collectionId: validated.collectionId || null,
        tags: validated.tags || [],
        metadata: validated.metadata || {},
        createdBy: user.id,
        isFavorite: false,
        isArchived: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error('[Resource Create Error]', error);

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
        error: 'Failed to create resource',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
>>>>>>> Stashed changes
  }
}
