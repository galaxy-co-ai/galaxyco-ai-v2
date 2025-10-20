import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setupData = await request.json();

    // TODO: Actually create sample data in the database
    // For now, simulate the creation with sample counts

    const stats = {
      tasks: 8,
      workflows: 3,
      documents: 12,
      contacts: 15,
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
