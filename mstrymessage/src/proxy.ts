import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  const isProtectedRoute = pathname.startsWith("/dashboard");

  // ✅ 1. If user is logged in & tries auth pages → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ 2. If user is NOT logged in & tries protected route → redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ 3. Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/api/:path*"
  ],
};