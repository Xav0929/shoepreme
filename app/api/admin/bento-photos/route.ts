// app/api/admin/bento-photos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BentoPhoto from "@/lib/models/BentoPhoto";

// ── GET — return all saved tiles ──────────────────────────────────────────────
export async function GET() {
  try {
    await connectToDatabase();
    const photos = await BentoPhoto.find().sort({ index: 1 }).lean();
    return NextResponse.json(
      photos.map((p: any) => ({ ...p, id: String(p._id) })),
    );
  } catch (err: any) {
    console.error("[GET /api/admin/bento-photos]", err);
    return NextResponse.json([], { status: 500 });
  }
}

// ── PATCH — update label / caption for a tile ─────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const { index, label, caption } = await req.json();

    if (typeof index !== "number") {
      return NextResponse.json(
        { success: false, error: "index is required" },
        { status: 400 },
      );
    }

    await BentoPhoto.findOneAndUpdate(
      { index },
      { $set: { label, caption } },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[PATCH /api/admin/bento-photos]", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Failed to update" },
      { status: 500 },
    );
  }
}

// ── DELETE — clear the photo src for a tile ───────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { index } = await req.json();

    if (typeof index !== "number") {
      return NextResponse.json(
        { success: false, error: "index is required" },
        { status: 400 },
      );
    }

    await BentoPhoto.findOneAndUpdate(
      { index },
      { $set: { src: null } },
      { upsert: true },
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/admin/bento-photos]", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Failed to delete" },
      { status: 500 },
    );
  }
}