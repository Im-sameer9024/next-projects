import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const pathname = req.nextUrl.pathname;

    // 🟢 Public routes
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup")
    ) {
      if (token) {
        return NextResponse.redirect(
          new URL(token.role === "ADMIN" ? "/admin" : "/user", req.url)
        );
      }
      return NextResponse.next();
    }

    // 🚫 Block root "/"
    if (pathname === "/") {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.redirect(
        new URL(token.role === "ADMIN" ? "/admin" : "/user", req.url)
      );
    }

    // 🔐 Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔐 Admin protection (FIXED)
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user", req.url));
    }

    // 🔐 Prevent admin from accessing user routes
    if (pathname.startsWith("/user") && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/", // important
    "/admin/:path*",
    "/user/:path*", // ✅ FIXED
    "/login",
    "/signup",
  ],
};