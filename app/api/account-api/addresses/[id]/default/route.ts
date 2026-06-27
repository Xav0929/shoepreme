import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Address } from "@/models/address";

// POST /api/account/addresses/:id/default
// Clears isDefault on every other address for the same customer, then sets
// this one. Mirrors the "Set Default" button in AddressesSection.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const target = await Address.findById(id);
    if (!target) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await Address.updateMany(
      { customerId: target.customerId },
      { $set: { isDefault: false } },
    );
    target.isDefault = true;
    await target.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/account/addresses/:id/default]", err);
    return NextResponse.json(
      { error: "Failed to set default address" },
      { status: 500 },
    );
  }
}