import { db } from "@/db";
import { releases } from "@/db/schema";
import { computeReleaseStatus } from "@/constants/steps";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PATCH /api/releases/[id] - Update steps or additional info
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const releaseId = parseInt(id, 10);
    if (isNaN(releaseId)) {
      return NextResponse.json({ error: "Invalid release ID" }, { status: 400 });
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.stepsCompleted !== undefined) {
      if (!Array.isArray(body.stepsCompleted)) {
        return NextResponse.json({ error: "stepsCompleted must be an array of strings" }, { status: 400 });
      }
      updateData.stepsCompleted = body.stepsCompleted;
      updateData.status = computeReleaseStatus(body.stepsCompleted);
    }

    if (body.additionalInfo !== undefined) {
      updateData.additionalInfo = body.additionalInfo;
    }

    updateData.updatedAt = new Date();

    const [updatedRelease] = await db
      .update(releases)
      .set(updateData)
      .where(eq(releases.id, releaseId))
      .returning();

    if (!updatedRelease) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRelease);
  } catch (error) {
    console.error("Error updating release:", error);
    return NextResponse.json({ error: "Failed to update release" }, { status: 500 });
  }
}

// DELETE /api/releases/[id] - Delete a release
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const releaseId = parseInt(id, 10);
    if (isNaN(releaseId)) {
      return NextResponse.json({ error: "Invalid release ID" }, { status: 400 });
    }

    const [deletedRelease] = await db
      .delete(releases)
      .where(eq(releases.id, releaseId))
      .returning();

    if (!deletedRelease) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Release deleted successfully" });
  } catch (error) {
    console.error("Error deleting release:", error);
    return NextResponse.json({ error: "Failed to delete release" }, { status: 500 });
  }
}
