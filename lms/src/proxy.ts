import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isTeacherRoute = pathname.startsWith("/teacher");

  // ✅ 1. Allow auth pages if NOT logged in
  if (!token && isAuthPage) {
    return NextResponse.next();
  }

  // ✅ 2. Redirect logged-in users away from auth pages
  if (token && isAuthPage) {
    return token.role === "TEACHER"
      ? NextResponse.redirect(new URL("/teacher/analytics", req.url))
      : NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ 3. Protect teacher routes
  if (isTeacherRoute && token?.role !== "TEACHER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ 4. Protect all other routes
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/teacher/:path*", "/sign-in", "/sign-up"],
};
