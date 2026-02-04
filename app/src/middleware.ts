import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"]

// Routes that are always allowed (webhooks, etc.)
const allowedRoutes = ["/api/webhooks", "/api/ai/process-email"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next()
  }

  // Allow webhook routes
  if (allowedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("token")?.value

  // Redirect to login if no token and accessing protected route
  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/conversations") || pathname.startsWith("/settings") || pathname.startsWith("/stats") || pathname.startsWith("/billing"))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if logged in and accessing auth pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
