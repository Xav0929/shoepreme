import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Staff from "@/lib/models/Staff";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const sessionToken = req.cookies.get("admin-session-token")?.value;
    if (sessionToken) {
      await Staff.updateOne(
        { sessionToken },
        { sessionToken: null, sessionTokenCreatedAt: null }
      );
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-session-token", "", { maxAge: 0, path: "/" });
    response.cookies.set("demo-admin-session", "", { maxAge: 0, path: "/" });
    return response;
  } catch {
    return NextResponse.json({ success: false });
  }
}