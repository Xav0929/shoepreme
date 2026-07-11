import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Address } from "@/models/address";
import { setShopifyDefaultAddress } from "@/lib/shopify-admin";

// POST /api/account-api/addresses/[id]/default
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const target = await Address.findById(id).lean();
    if (!target) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Unset all defaults for this customer, then set the target
    await Address.updateMany(
      { customerId: (target as any).customerId },
      { $set: { isDefault: false } },
    );
    await Address.findByIdAndUpdate(id, { $set: { isDefault: true } });

    // Mirror default status to Shopify (best-effort)
    try {
      const t = target as any;
      if (t.shopifyAddressId) {
        const result = await setShopifyDefaultAddress(
          t.customerId,
          t.shopifyAddressId,
        );
        if (!result.success)
          console.error("Shopify default address sync failed:", result.error);
      }
    } catch (syncErr) {
      console.error("Shopify default address sync threw:", syncErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/account-api/addresses/:id/default]", err);
    return NextResponse.json(
      { error: "Failed to set default" },
      { status: 500 },
    );
  }
}
