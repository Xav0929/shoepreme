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
    if (!sessionToken) {
      return NextResponse.json({ valid: false });
    }
    const staff = await Staff.findOne({ sessionToken });
    if (!staff) {
      return NextResponse.json({ valid: false });
    }

    // Reject tokens older than 24 hours
    const tokenAge = Date.now() - new Date(staff.sessionTokenCreatedAt).getTime();
    if (tokenAge > 24 * 60 * 60 * 1000) {
      await Staff.updateOne({ _id: staff._id }, { sessionToken: null, sessionTokenCreatedAt: null });
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true, role: staff.role, name: staff.username });
  } catch {
    return NextResponse.json({ valid: false });
  }
}