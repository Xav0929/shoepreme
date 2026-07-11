import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/models/customer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawId = searchParams.get("customerId") ?? "";
  const customerId = rawId.includes("gid://") ? rawId.split("/").pop()! : rawId;

  console.log("check-status customerId:", customerId);

  if (!customerId) return NextResponse.json({ disabled: false });

  await connectToDatabase();
  const customer = await Customer.findOne({ shopifyCustomerId: customerId }).lean() as any;

  console.log("check-status result:", { customerId, disabled: customer?.disabled ?? false });

  return NextResponse.json({ 
    disabled: customer?.disabled ?? false,
    reason: customer?.disableReason ?? null,
  });
}