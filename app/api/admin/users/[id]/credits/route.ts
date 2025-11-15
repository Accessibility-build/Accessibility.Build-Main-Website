import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { assignCreditsToUser } from "@/lib/admin-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const admin = await requireAdmin();

    // Parse request body
    const { amount, reason } = await request.json();

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string") {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    const { id } = await params;
    // Assign credits to user
    const success = await assignCreditsToUser(id, amount, admin.id, reason);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to assign credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${amount} credits assigned successfully`,
      amount,
      reason,
    });
  } catch (error) {
    console.error("Admin credit assignment error:", error);

    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message.includes("User not found")) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to assign credits" },
      { status: 500 }
    );
  }
}
