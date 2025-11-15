import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { updateUserStatus } from "@/lib/admin-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const admin = await requireAdmin();

    // Parse request body
    const { isActive } = await request.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    // Await params before using
    const { id } = await params;

    // Update user status
    const success = await updateUserStatus(id, isActive, admin.id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Admin user status update error:", error);

    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
