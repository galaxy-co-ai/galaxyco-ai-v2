import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserWorkspaces } from '@/lib/actions/workspace-actions';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaces = await getUserWorkspaces();
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
