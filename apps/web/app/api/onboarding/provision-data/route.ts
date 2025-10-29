import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import {
  users,
  tasks,
  contacts,
  calendarEvents,
} from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setupData = await request.json();
    const { workspaceId } = setupData;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 },
      );
    }

    // Get user record
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create sample tasks
    const sampleTasks = [
      {
        title: "Review AI Agent Performance",
        description:
          "Check the execution logs and optimize agent configurations",
        priority: "high" as const,
        status: "todo" as const,
      },
      {
        title: "Connect Email Integration",
        description: "Set up Gmail integration for automated email processing",
        priority: "medium" as const,
        status: "todo" as const,
      },
      {
        title: "Upload Product Documentation",
        description: "Add knowledge base documents for AI training",
        priority: "medium" as const,
        status: "in_progress" as const,
      },
      {
        title: "Schedule Team Onboarding",
        description: "Invite team members and assign roles",
        priority: "low" as const,
        status: "todo" as const,
      },
      {
        title: "Test Agent Workflows",
        description: "Run test scenarios to validate agent responses",
        priority: "high" as const,
        status: "done" as const,
      },
    ];

    const createdTasks = await db
      .insert(tasks)
      .values(
        sampleTasks.map((task) => ({
          workspaceId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assignedTo: user.id,
          createdBy: user.id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        })),
      )
      .returning();

    // Create sample calendar events
    const sampleEvents = [
      {
        title: "Platform Demo",
        description: "Walkthrough of AI agent capabilities",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 60, // minutes
      },
      {
        title: "Weekly Team Sync",
        description: "Discuss progress and upcoming priorities",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: 30,
      },
      {
        title: "Q1 Planning Session",
        description: "Strategic planning for next quarter",
        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        duration: 120,
      },
    ];

    const createdEvents = await db
      .insert(calendarEvents)
      .values(
        sampleEvents.map((event) => ({
          workspaceId,
          userId: user.id,
          createdBy: user.id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: new Date(event.startTime.getTime() + event.duration * 60000),
          isAllDay: false,
        })),
      )
      .returning();

    // Create sample contacts
    const sampleContacts = [
      {
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah.chen@example.com",
        company: "TechCorp",
        title: "VP of Engineering",
      },
      {
        firstName: "Michael",
        lastName: "Rodriguez",
        email: "m.rodriguez@example.com",
        company: "DataSystems Inc",
        title: "CTO",
      },
      {
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily.j@example.com",
        company: "StartupXYZ",
        title: "CEO",
      },
      {
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@example.com",
        company: "Enterprise Solutions",
        title: "Head of Sales",
      },
      {
        firstName: "Lisa",
        lastName: "Anderson",
        email: "lisa.a@example.com",
        company: "CloudTech",
        title: "Product Manager",
      },
    ];

    const createdContacts = await db
      .insert(contacts)
      .values(
        sampleContacts.map((contact) => ({
          workspaceId,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          company: contact.company,
          title: contact.title,
          tags: ["sample", "onboarding"],
        })),
      )
      .returning();

    const stats = {
      tasks: createdTasks.length,
      events: createdEvents.length,
      contacts: createdContacts.length,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error provisioning sample data:", error);
    return NextResponse.json(
      { error: "Failed to provision data" },
      { status: 500 },
    );
  }
}
