import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const isSecure = req.url.startsWith("https://");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
    salt: isSecure ? "__Secure-authjs.session-token" : "authjs.session-token",
  });

  console.log("Token in proxy",token)

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isTeacherRoute = pathname.startsWith("/teacher");

  // ✅ 1. If NOT logged in
  if (!token) {
    if (isAuthPage) return NextResponse.next();

    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ 2. If logged in & trying to access auth pages
  if (isAuthPage) {
    if (token.role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher/courses", req.url));
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ 3. TEACHER restrictions
  if (token.role === "TEACHER") {
    //  Block access to non-teacher routes
    if (!isTeacherRoute) {
      return NextResponse.redirect(new URL("/teacher/courses", req.url));
    }
  }

  // ✅ 4. USER restrictions
  if (token.role !== "TEACHER") {
    //  Block access to teacher routes
    if (isTeacherRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};