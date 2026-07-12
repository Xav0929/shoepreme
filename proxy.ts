import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: Request) {
  const req = request as NextRequest;
  const url = new URL(request.url);
  const { pathname } = url;

  // Admin cookie auth
  if (
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/fulfill-order") ||
    pathname.startsWith("/api/hero-slides") ||
    pathname.startsWith("/api/product-inventory") ||
    pathname.startsWith("/api/reserve")
  ) {
    const session = req.cookies.get("demo-admin-session");
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    try {
      const data = JSON.parse(decodeURIComponent(session.value));
      if (!data?.role) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Protect account-api routes
  if (pathname.startsWith("/api/account-api") || pathname.startsWith("/api/paymongo")) {
    const session = req.cookies.get("__Secure-authjs.session-token") 
      ?? req.cookies.get("authjs.session-token");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Protect account-api and paymongo routes
  if (
    pathname.startsWith("/api/account-api") ||
    pathname.startsWith("/api/paymongo")
  ) {
    const session =
      req.cookies.get("__Secure-authjs.session-token") ??
      req.cookies.get("authjs.session-token");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return auth(request as any);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/fulfill-order/:path*",
    "/api/hero-slides/:path*",
    "/api/product-inventory/:path*",
    "/api/reserve/:path*",
    "/api/account-api/:path*",
    "/api/paymongo/:path*",
    "/account",
    "/account/((?!preview|login|signup).*)",
  ],
};
