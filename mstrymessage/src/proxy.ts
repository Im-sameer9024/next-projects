import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;

  if (
    (token &&
      (url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up"))) ||
    url.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.redirect(new URL("/sign-in", req.url));

}


export const config = {
    matcher:[
        "/sign-in",
        "/sign-up",
        "/",
        "/dashboard/:path*",
        "/verify/:path*"
    ]
}