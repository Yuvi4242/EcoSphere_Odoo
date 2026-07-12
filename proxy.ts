import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev",
  });
  const { pathname } = request.nextUrl;

  // 1. Any route under /admin requires role = "ADMIN"
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== 'ADMIN') {
      const appUrl = new URL('/app', request.url);
      appUrl.searchParams.set('unauthorized', 'true');
      return NextResponse.redirect(appUrl);
    }
  }

  // 2. Any route under /app requires user to be logged in (any role)
  if (pathname.startsWith('/app')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
