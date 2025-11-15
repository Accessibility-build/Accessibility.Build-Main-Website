import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getAllTrialStatus } from "@/lib/trial-usage";

export async function GET() {
  try {
    // Check if user is authenticated
    const user = await currentUser();

    // Only provide trial status for non-authenticated users
    if (user) {
      return NextResponse.json([]);
    }

    // Get trial status for all tools
    const trialStatus = await getAllTrialStatus();

    return NextResponse.json(trialStatus);
  } catch (error) {
    console.error("Error fetching trial status:", error);
    return NextResponse.json(
      { error: "Failed to fetch trial status" },
      { status: 500 }
    );
  }
}
