import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Staff from "@/lib/models/Staff";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

// GET — return MongoDB staff + Shopify staff merged
export async function GET() {
  await connectDB();
  const dbStaff = await Staff.find().lean();

  // Fetch Shopify staff
  let shopifyStaff: any[] = [];
  try {
    const res = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!,
        },
        body: JSON.stringify({
          query: `{
            shop {
              staffMembers(first: 50) {
                edges {
                  node {
                    id
                    name
                    email
                    isOwner
                  }
                }
              }
            }
          }`,
        }),
      }
    );
    const json = await res.json();
    shopifyStaff = (json.data?.shop?.staffMembers?.edges ?? []).map((e: any) => ({
      id: `shopify-${e.node.id}`,
      username: e.node.email,
      name: e.node.name,
      role: e.node.isOwner ? "owner" : "staff",
      source: "shopify",
    }));
  } catch (err) {
    console.error("Failed to fetch Shopify staff:", err);
  }

  const localStaff = dbStaff.map((s: any) => ({
    id: s._id.toString(),
    username: s.username,
    role: s.role,
    createdAt: s.createdAt,
    source: "local",
  }));

  return NextResponse.json({ staff: [...shopifyStaff, ...localStaff] });
}

// POST — create new staff
export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password, role } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const existing = await Staff.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const staff = await Staff.create({ username, password: hashed, role });

  return NextResponse.json({ success: true, id: staff._id.toString() });
}