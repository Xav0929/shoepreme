import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

async function getCancelModel() {
  const { default: mongoose } = await import("mongoose");
  return mongoose.models.CancelRequest ??
    mongoose.model("CancelRequest", new mongoose.Schema({
      orderId: String,
      customerEmail: String,
      requestedAt: { type: Date, default: Date.now },
      status: { type: String, default: "pending" },
    }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ cancelled: false });
    const { id } = await params;
    await connectToDatabase();
    const CancelRequest = await getCancelModel();
    const existing = await CancelRequest.findOne({ orderId: id });
    return NextResponse.json({ cancelled: !!existing });
  } catch {
    return NextResponse.json({ cancelled: false });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectToDatabase();
    const CancelRequest = await getCancelModel();
    const existing = await CancelRequest.findOne({ orderId: id });
    if (existing) return NextResponse.json({ success: true });
    await CancelRequest.create({ orderId: id, customerEmail: session.user.email });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/account-api/orders/[id]/cancel]", err);
    return NextResponse.json({ error: "Failed to submit cancellation" }, { status: 500 });
  }
}