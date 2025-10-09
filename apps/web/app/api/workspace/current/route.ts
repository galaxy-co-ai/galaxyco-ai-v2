import { NextRequest, NextResponse } from 'next/server';
import { 
  getCurrentWorkspaceId, 
  getWorkspaceDetails,
  setWorkspaceCookie,
  validateWorkspaceAccess 
} from '@/lib/workspace';

export const dynamic = 'force-dynamic';

/**
 * GET /api/workspace/current
 * Get current workspace ID and details
 */
export async function GET() {
  try {
    const { id, source } = await getCurrentWorkspaceId();
    
    // No workspace is a valid state for new users - return 200 with null
    if (!id) {
      return NextResponse.json(
        { workspaceId: null, workspace: null, source },
        { status: 200 }
      );
    }
    
    // Get full workspace details
    const workspace = await getWorkspaceDetails(id);
    
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace access denied', workspaceId: id },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      workspaceId: id,
      source,
      workspace,
    });
  } catch (error: any) {
    console.error('Error getting current workspace:', error);
    return NextResponse.json(
      { error: 'Failed to get current workspace' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workspace/current
 * Set current workspace
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId } = body;
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }
    
    // Validate user has access to this workspace
    const hasAccess = await validateWorkspaceAccess(workspaceId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to workspace' },
        { status: 403 }
      );
    }
    
    // Set the workspace cookie
    await setWorkspaceCookie(workspaceId);
    
    // Get workspace details for response
    const workspace = await getWorkspaceDetails(workspaceId);
    
    return NextResponse.json({
      success: true,
      workspaceId,
      workspace,
    });
  } catch (error: any) {
    console.error('Error setting current workspace:', error);
    return NextResponse.json(
      { error: 'Failed to set current workspace' },
      { status: 500 }
    );
  }
}