import { NextResponse } from 'next/server';
import { getUserWorkspaces } from '@/lib/workspace';

/**
 * GET /api/workspace/list
 * Get all workspaces user has access to
 */
export async function GET() {
  try {
    const workspaces = await getUserWorkspaces();
    
    return NextResponse.json({
      workspaces,
      count: workspaces.length,
    });
  } catch (error: any) {
    console.error('Error listing workspaces:', error);
    return NextResponse.json(
      { error: 'Failed to list workspaces' },
      { status: 500 }
    );
  }
}