import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/services/user-session";
import { logger } from "@/lib/utils/logger";
import { conversationService } from "@/lib/services/conversation-service";

export const runtime = "nodejs";

/**
 * GET /api/ai/conversations
 * List user's conversations
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { userId, workspaceId } = session;

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const query = searchParams.get("query");

    let conversations;
    if (query) {
      conversations = await conversationService.searchConversations(
        userId,
        workspaceId,
        query,
      );
    } else {
      conversations = await conversationService.getUserConversations(
        userId,
        workspaceId,
        limit,
      );
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    logger.error("Get conversations error", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/ai/conversations
 * Create a new conversation
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const { userId, workspaceId } = session;

    const body = await req.json();
    const { title, context } = body;

    const conversation = await conversationService.createConversation({
      userId,
      workspaceId,
      title,
      context,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    logger.error("Create conversation error", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
