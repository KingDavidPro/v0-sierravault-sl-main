import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/static") ||
      pathname.match(/\.(png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/about",
    "/features",
    "/government",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid JWT:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Default allow
  return NextResponse.next();
}

// Use simple matcher
export const config = {
  matcher: ["/dashboard/:path*", "/:path*"],
};
