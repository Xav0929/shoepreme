import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Staff from "@/lib/models/Staff";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password } = await req.json();
  const staff = await Staff.findOne({ username });
  if (!staff) return NextResponse.json({ success: false }, { status: 401 });
  const valid = await bcrypt.compare(password, staff.password);
  if (!valid) return NextResponse.json({ success: false }, { status: 401 });
  const sessionToken = crypto.randomUUID();
  await Staff.updateOne({ _id: staff._id }, { sessionToken });
  return NextResponse.json({ success: true, name: staff.username, role: staff.role, sessionToken });
}