import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
} from "@/lib/customer-addresses";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.shopifyAccessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const body = await req.json();
  const { id } = await params;

  try {
    if (body.setDefaultOnly) {
      const customer = await setDefaultCustomerAddress(
        session.shopifyAccessToken,
        decodeURIComponent(id),
      );
      return NextResponse.json({ customer });
    }

    const { setDefault, ...input } = body;
    const address = await updateCustomerAddress(
      session.shopifyAccessToken,
      decodeURIComponent(id),
      input,
      !!setDefault,
    );
    return NextResponse.json({ address });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.shopifyAccessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const deletedId = await deleteCustomerAddress(
      session.shopifyAccessToken,
      decodeURIComponent(id),
    );
    return NextResponse.json({ deletedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
