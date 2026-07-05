import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: Request) {
  const req = request as NextRequest;
  const url = new URL(request.url);
  const { pathname } = url;

  // Admin cookie auth
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
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

  return auth(request as any);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account",
    "/account/((?!preview|login|signup).*)",
  ],
};
