import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setupData = await request.json();
    const role = setupData.role?.toLowerCase() || "";

    // Determine agents based on role
    let agents = [];

    if (role.includes("founder") || role.includes("ceo")) {
      agents = [
        {
          name: "Daily Digest Agent",
          description: "Summarizes emails, tasks, and priorities every morning",
          type: "digest",
        },
        {
          name: "Document Analyzer",
          description: "Extracts key insights from reports and contracts",
          type: "analyzer",
        },
        {
          name: "Meeting Prep Assistant",
          description: "Prepares briefs and talking points for meetings",
          type: "assistant",
        },
      ];
    } else if (
      role.includes("sales") ||
      role.includes("business development")
    ) {
      agents = [
        {
          name: "Lead Enrichment Agent",
          description: "Enriches lead data from emails and LinkedIn",
          type: "enrichment",
        },
        {
          name: "Follow-up Writer",
          description: "Drafts personalized follow-up emails",
          type: "writer",
        },
        {
          name: "Pipeline Tracker",
          description: "Monitors deals and alerts on stalled opportunities",
          type: "tracker",
        },
      ];
    } else if (role.includes("support") || role.includes("customer success")) {
      agents = [
        {
          name: "Ticket Triage Agent",
          description: "Categorizes and prioritizes support tickets",
          type: "triage",
        },
        {
          name: "Response Drafter",
          description: "Generates helpful responses using knowledge base",
          type: "drafter",
        },
        {
          name: "Sentiment Monitor",
          description: "Flags urgent or frustrated interactions",
          type: "monitor",
        },
      ];
    } else if (role.includes("operations") || role.includes("manager")) {
      agents = [
        {
          name: "Workflow Optimizer",
          description: "Analyzes and suggests process improvements",
          type: "optimizer",
        },
        {
          name: "Task Automator",
          description: "Automates repetitive operational tasks",
          type: "automator",
        },
        {
          name: "Report Generator",
          description: "Creates operational reports and dashboards",
          type: "reporter",
        },
      ];
    } else {
      // Default agents
      agents = [
        {
          name: "AI Assistant",
          description: "General-purpose AI helper for various tasks",
          type: "assistant",
        },
        {
          name: "Document Processor",
          description: "Processes and organizes documents",
          type: "processor",
        },
        {
          name: "Task Manager",
          description: "Helps manage and prioritize tasks",
          type: "manager",
        },
      ];
    }

    // TODO: Actually create agents in the database here
    // For now, just return the agent list

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error("Error provisioning agents:", error);
    return NextResponse.json(
      { error: "Failed to provision agents" },
      { status: 500 },
    );
  }
}
