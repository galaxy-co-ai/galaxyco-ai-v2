import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/services/user-session";
import { conversationService } from "@/lib/services/conversation-service";

export const runtime = "nodejs";

/**
 * GET /api/ai/conversations/[id]
 * Get a specific conversation with messages
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { id } = await params;

    const conversationContext = await conversationService.getConversation(
      id,
      workspaceId,
    );

    if (!conversationContext) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(conversationContext);
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/ai/conversations/[id]
 * Update conversation (pin, tags, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { id } = await params;

    const body = await req.json();
    const { action, tags } = body;

    if (action === "toggle_pin") {
      await conversationService.togglePinConversation(id, workspaceId);
      return NextResponse.json({ success: true });
    }

    if (action === "update_tags" && tags) {
      await conversationService.updateConversationTags(id, workspaceId, tags);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/ai/conversations/[id]
 * Delete a conversation
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { id } = await params;

    const success = await conversationService.deleteConversation(
      id,
      workspaceId,
    );

    if (!success) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 },
    );
  }
}
