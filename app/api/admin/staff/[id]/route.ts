import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Staff from "@/lib/models/Staff";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Staff.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}