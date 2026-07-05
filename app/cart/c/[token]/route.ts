// app/cart/c/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const key = req.nextUrl.searchParams.get("key");
  const shopifyCheckoutUrl = `https://shoepremekor.myshopify.com/cart/c/${token}${key ? `?key=${key}` : ""}`;
  return NextResponse.redirect(shopifyCheckoutUrl);
}
