import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= maxRequests) return true;
  entry.count++;
  return false;
}

export async function proxy(request: Request) {
  const req = request as NextRequest;
  const url = new URL(request.url);
  const { pathname } = url;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  // Rate limit admin login — 5 attempts per minute
  if (pathname === "/api/admin/auth/login") {
    if (isRateLimited(`login:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in a minute." },
        { status: 429 }
      );
    }
  }

  // Rate limit all admin APIs — 60 per minute
  if (pathname.startsWith("/api/admin")) {
    if (isRateLimited(`admin:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }
  }

  // Rate limit account APIs — 30 per minute
  if (pathname.startsWith("/api/account-api")) {
    if (isRateLimited(`account:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }
  }

  // Admin cookie auth
  if (
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
    (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/validate") && !pathname.startsWith("/api/admin/auth")) ||
    pathname.startsWith("/api/fulfill-order") ||
    pathname.startsWith("/api/hero-slides") ||
    pathname.startsWith("/api/product-inventory") ||
    pathname.startsWith("/api/reserve")
  ) {
    const sessionToken = req.cookies.get("admin-session-token")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Verify token against MongoDB via internal API
    try {
      const verifyRes = await fetch(new URL("/api/admin/validate", req.url), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cookie": `admin-session-token=${sessionToken}`,
        },
        body: JSON.stringify({}),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData?.valid) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  }

  // Skip NextAuth check for admin routes entirely
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/fulfill-order") ||
    pathname.startsWith("/api/hero-slides") ||
    pathname.startsWith("/api/product-inventory") ||
    pathname.startsWith("/api/reserve")
  ) {
    return NextResponse.next();
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
