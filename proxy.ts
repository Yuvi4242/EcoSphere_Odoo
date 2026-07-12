import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { checkRoleAccess } from "@/middleware/rbac";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard UI routes
  if (pathname.startsWith("/dashboard")) {
    const tokenCookie = request.cookies.get("token");
    const token = tokenCookie?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = verifyToken(token);
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");
      return response;
    }

    // Role-based route authorization check
    const hasAccess = checkRoleAccess(payload.role, pathname);
    if (!hasAccess) {
      // Redirect to main dashboard index if role doesn't have access to this sub-route
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Protect backend Node.js API routes (excluding public auth endpoints)
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const token = 
      request.headers.get("authorization")?.split(" ")[1] || 
      request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Standardize identity injection for downstream API routers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
    if (payload.department) {
      requestHeaders.set("x-user-department", payload.department);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};

