// app/api/account/addresses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Address } from "@/models/address";

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

// GET /api/account/addresses?customerId=xxxx
export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");
    if (!customerId) {
      return NextResponse.json(
        { error: "Missing required query param: customerId" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const addresses = await Address.find({ customerId })
      .sort({ isDefault: -1, createdAt: 1 })
      .lean();

    return NextResponse.json({ addresses: addresses.map(shape) });
  } catch (err) {
    console.error("[GET /api/account/addresses]", err);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST /api/account/addresses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, ...fields } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing required field: customerId" },
        { status: 400 }
      );
    }

    const required = ["firstName", "lastName", "address1", "city", "province", "zip", "country", "phone"];

    for (const key of required) {
      if (!fields[key]) {
        return NextResponse.json(
          { error: `Missing required field: ${key}` },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();

    const existingCount = await Address.countDocuments({ customerId });
    const isDefault = existingCount === 0;

    const created = await Address.create({
      customerId,
      ...fields,
      isDefault,
    });

    return NextResponse.json({ address: shape(created) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/account/addresses]", err);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}

// PATCH /api/account/addresses/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fields = await request.json();

    // Prevent changing critical fields
    delete fields.customerId;
    delete fields.isDefault;
    delete fields.id;
    delete fields._id;

    await connectToDatabase();

    const updated = await Address.findByIdAndUpdate(id, fields, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address: shape(updated) });
  } catch (err) {
    console.error("[PATCH /api/account/addresses/:id]", err);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE /api/account/addresses/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const toDelete = await Address.findById(id).lean();
    if (!toDelete) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await Address.findByIdAndDelete(id);

    // If we deleted the default address, make the oldest one the new default
    if ((toDelete as any).isDefault) {
      const next = await Address.findOne({
        customerId: (toDelete as any).customerId,
      }).sort({ createdAt: 1 });

      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/account/addresses/:id]", err);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}