import { db } from "@/db";
import { releases } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/releases - Fetch all releases sorted by date descending
export async function GET() {
  try {
    const allReleases = await db.select().from(releases).orderBy(desc(releases.date));
    return NextResponse.json(allReleases);
  } catch (error) {
    console.error("Error fetching releases:", error);
    return NextResponse.json({ error: "Failed to fetch releases" }, { status: 500 });
  }
}

// POST /api/releases - Create a new release
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, date, additionalInfo } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const [newRelease] = await db
      .insert(releases)
      .values({
        name: name.trim(),
        date: parsedDate,
        status: "planned",
        additionalInfo: additionalInfo || "",
        stepsCompleted: [],
      })
      .returning();

    return NextResponse.json(newRelease, { status: 201 });
  } catch (error) {
    console.error("Error creating release:", error);
    return NextResponse.json({ error: "Failed to create release" }, { status: 500 });
  }
}
