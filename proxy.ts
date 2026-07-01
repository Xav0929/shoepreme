import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export async function proxy(request: Request) {
  return auth(request as any);
}

export const config = {
  matcher: ["/account", "/account/((?!preview|login|signup).*)"],
};
