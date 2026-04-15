import { auth } from "@/shared/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { user } = req.auth || {};
  const pathname = req.nextUrl.pathname;

  // Public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (user) {
      return NextResponse.redirect(
        new URL(user.role === "ADMIN" ? "/admin" : "/user", req.url)
      );
    }
    return NextResponse.next();
  }

  // Not logged in
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin protection
  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/admin/:path*", "/user/:path*", "/login", "/signup"],
};