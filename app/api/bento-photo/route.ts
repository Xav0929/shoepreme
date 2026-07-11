// app/api/bento-photos/route.ts
// Public endpoint — storefront reads from here, no auth required
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BentoPhoto from "@/lib/models/BentoPhoto";

export async function GET() {
  try {
    await connectToDatabase();
    const photos = await BentoPhoto.find().sort({ index: 1 }).lean();
    return NextResponse.json(photos);
  } catch (err) {
    console.error("[GET /api/bento-photos]", err);
    return NextResponse.json([]);   // silently fall back — storefront shows placeholders
  }
}