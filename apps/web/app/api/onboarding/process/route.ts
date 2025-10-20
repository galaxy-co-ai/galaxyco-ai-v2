import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, currentStep, setupData } = await request.json();

    // Simple rule-based responses (can be enhanced with LLM later)
    let response = "";
    let updates: Record<string, any> = {};
    let shouldProgress = false;

    switch (currentStep) {
      case "welcome":
        // Check if this is role or industry response
        if (!setupData.role) {
          // First response: role
          updates.role = message;
          response = `Perfect! A **${message}** role is great for leveraging AI automation.

**What industry are you in?** (e.g., Technology, Healthcare, Finance, E-commerce, Consulting, etc.)`;
        } else {
          // Second response: industry
          updates.industry = message;
          response = `Excellent! **${message}** is a great industry for AI automation.`;
          shouldProgress = true;
        }
        break;

      case "workspace":
        // Extract workspace name
        updates.workspaceName = message;
        response = `Great! I'll set up your workspace called **"${message}"**.

Now let me configure some AI agents based on your role...`;
        shouldProgress = true;
        break;

      case "integrations":
        // Parse tools from message
        const lowerMessage = message.toLowerCase();
        updates.tools = [];

        if (lowerMessage.includes("skip")) {
          response = "No problem! You can connect integrations later.";
          shouldProgress = true;
        } else {
          if (
            lowerMessage.includes("gmail") ||
            lowerMessage.includes("email")
          ) {
            updates.tools.push("gmail");
          }
          if (lowerMessage.includes("slack")) {
            updates.tools.push("slack");
          }
          if (
            lowerMessage.includes("hubspot") ||
            lowerMessage.includes("salesforce")
          ) {
            updates.tools.push("crm");
          }
          if (
            lowerMessage.includes("drive") ||
            lowerMessage.includes("notion")
          ) {
            updates.tools.push("docs");
          }

          response = `Excellent! I've noted your tools: ${updates.tools.join(", ") || "none yet"}

You'll be able to connect these later in Settings.`;
          shouldProgress = true;
        }
        break;

      case "preferences":
        // Parse sensitivity preference
        const sensitive = message.toLowerCase().includes("yes");
        updates.sensitiveData = sensitive;
        response = sensitive
          ? "✓ Enhanced security mode enabled. I'll configure stricter logging and data handling."
          : "✓ Standard security configured.";
        shouldProgress = true;
        break;

      default:
        response = "I'm not sure how to handle that. Please try again.";
    }

    return NextResponse.json({
      response,
      updates,
      shouldProgress,
    });
  } catch (error) {
    console.error("Error processing onboarding message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
