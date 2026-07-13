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
  await Staff.updateOne({ _id: staff._id }, { sessionToken, sessionTokenCreatedAt: new Date() });
  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ 
    success: true, 
    name: staff.username, 
    role: staff.role 
  });
  
  response.cookies.set("admin-session-token", sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}