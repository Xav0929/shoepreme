import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/models/customer";
import { getCustomerIdByEmail } from "@/lib/shopify-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, message, reason, contactPreference } = await req.json();
    if (!email || !message?.trim() || !reason) {
      return NextResponse.json({ error: "Email, reason and message are required" }, { status: 400 });
    }

    await connectToDatabase();

    const shopifyId = await getCustomerIdByEmail(email);
    if (!shopifyId) {
      return NextResponse.json({ error: "No matching account found" }, { status: 404 });
    }
    const normalizedId = shopifyId.includes("gid://")
      ? shopifyId.split("/").pop()!
      : shopifyId;

    await Customer.findOneAndUpdate(
      { shopifyCustomerId: normalizedId },
      {
        $set: {
          shopifyCustomerId: normalizedId,
          "appeal.reason": reason,
          "appeal.message": message.trim(),
          "appeal.contactPreference": contactPreference?.trim() || null,
          "appeal.submittedAt": new Date(),
          "appeal.status": "pending",
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to submit appeal", err);
    return NextResponse.json({ error: "Failed to submit appeal" }, { status: 500 });
  }
}