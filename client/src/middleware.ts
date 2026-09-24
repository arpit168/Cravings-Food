import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("parleG")?.value;
  const path = request.nextUrl.pathname;

  // Paths that require authentication
  const protectedPaths = [
    "/customer/dashboard",
    "/customer/checkout",
    "/customer/orders",
    "/admin/dashboard",
    "/restaurant/dashboard",
    "/delivery/dashboard",
  ];

  const isProtectedPath = protectedPaths.some(p => path.startsWith(p));

  // If path is protected and there is no token, redirect to login
  if (isProtectedPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Paths that logged-in users shouldn't access
  const authPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPath = authPaths.some(p => path.startsWith(p));

  if (isAuthPath && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/admin/:path*",
    "/restaurant/:path*",
    "/delivery/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
