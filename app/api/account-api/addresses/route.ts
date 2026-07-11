import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Address } from "@/models/address";
import { createShopifyCustomerAddress } from "@/lib/shopify-admin";

// Normalize GID → plain string so storage is consistent
function normalizeCustomerId(id: string) {
  if (!id) return id;
  return id.includes("gid://") ? id.split("/").pop()! : id;
}

function shape(a: any) {
  return {
    id: String(a._id),
    firstName: a.firstName,
    lastName: a.lastName,
    address1: a.address1,
    address2: a.address2 ?? "",
    city: a.city,
    province: a.province,
    zip: a.zip,
    country: a.country,
    phone: a.phone,
    isDefault: a.isDefault,
  };
}

// GET /api/account-api/addresses?customerId=xxx
export async function GET(request: NextRequest) {
  try {
    const raw = request.nextUrl.searchParams.get("customerId");
    if (!raw) {
      return NextResponse.json(
        { error: "Missing required query param: customerId" },
        { status: 400 },
      );
    }

    const customerId = normalizeCustomerId(raw);
    await connectToDatabase();

    const addresses = await Address.find({ customerId })
      .sort({ isDefault: -1, createdAt: 1 })
      .lean();

    return NextResponse.json({ addresses: addresses.map(shape) });
  } catch (err) {
    console.error("[GET /api/account-api/addresses]", err);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

// POST /api/account-api/addresses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId: rawId, ...fields } = body;

    if (!rawId) {
      return NextResponse.json(
        { error: "Missing required field: customerId" },
        { status: 400 },
      );
    }

    const customerId = normalizeCustomerId(rawId);

    const required = [
      "firstName",
      "lastName",
      "address1",
      "city",
      "province",
      "zip",
      "country",
      "phone",
    ];
    for (const key of required) {
      if (!fields[key]) {
        return NextResponse.json(
          { error: `Missing required field: ${key}` },
          { status: 400 },
        );
      }
    }

    await connectToDatabase();

    const existingCount = await Address.countDocuments({ customerId });
    const isDefault = existingCount === 0;

    const created = await Address.create({ customerId, ...fields, isDefault });

    // Mirror to Shopify customer address book (best-effort, non-blocking)
    try {
      const result = await createShopifyCustomerAddress(customerId, {
        firstName: fields.firstName,
        lastName: fields.lastName,
        address1: fields.address1,
        address2: fields.address2,
        city: fields.city,
        province: fields.province,
        zip: fields.zip,
        country: fields.country,
        phone: fields.phone,
      });
      if (result.success && result.addressId) {
        created.shopifyAddressId = result.addressId;
        await created.save();
      } else if (!result.success) {
        console.error("Shopify address mirror failed:", result.error);
      }
    } catch (syncErr) {
      console.error("Shopify address mirror threw:", syncErr);
    }

    return NextResponse.json({ address: shape(created) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/account-api/addresses]", err);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}
