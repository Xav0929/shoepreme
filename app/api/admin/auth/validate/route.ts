import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Staff from "@/lib/models/Staff";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { sessionToken } = await req.json();
  if (!sessionToken) return NextResponse.json({ valid: false });
  const staff = await Staff.findOne({ sessionToken });
  return NextResponse.json({ valid: !!staff });
}