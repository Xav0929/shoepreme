import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getCustomerAddresses,
  createCustomerAddress,
} from "@/lib/customer-addresses";

export async function GET() {
  const session = await auth();
  if (!session?.shopifyAccessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const addresses = await getCustomerAddresses(session.shopifyAccessToken);
    return NextResponse.json({ addresses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.shopifyAccessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { setDefault, ...input } = await req.json();
  try {
    const address = await createCustomerAddress(
      session.shopifyAccessToken,
      input,
      !!setDefault,
    );
    return NextResponse.json({ address });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
