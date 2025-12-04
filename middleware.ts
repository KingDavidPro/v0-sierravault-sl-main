import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes (no auth required)
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/register-otp",
    "/forgot-password",
    "/forgot-password-otp",
    "/reset-password",
    "/about",
    "/features",
    "/verify",
    "/government",
    "/gov/login",
    "/gov/verify-otp",
    "/gov/help",
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - check for mock auth token
  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isGovDashboardRoute =
    pathname.startsWith("/gov/dashboard") ||
    pathname.startsWith("/gov/pending") ||
    pathname.startsWith("/gov/issue") ||
    pathname.startsWith("/gov/users") ||
    pathname.startsWith("/gov/roles") ||
    pathname.startsWith("/gov/audit") ||
    pathname.startsWith("/gov/settings")

  if (isDashboardRoute) {
    // Check for user token in localStorage (client-side check)
    // In a real app, this would be a secure httpOnly cookie
    const response = NextResponse.next()
    response.headers.set("x-middleware-cache", "no-cache")
    return response
  }

  if (isGovDashboardRoute) {
    // Check for gov token in localStorage (client-side check)
    const response = NextResponse.next()
    response.headers.set("x-middleware-cache", "no-cache")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
