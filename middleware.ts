import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Public Paths: Login, Root, and Static Assets
  const isPublicAsset = path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/);
  if (path === '/login' || path === '/' || path === '/api/auth/login' || isPublicAsset) {
    return NextResponse.next();
  }

  // 2. Validate Token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login for pages, JSON 401 for API
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Optional: Decode token to check role (if accessing /admin)
  // Note: Middleware runs on Edge runtime, so we can't use 'jsonwebtoken' library directly if it relies on Node 'crypto'.
  // We'll rely on the API routes to do the heavy verification, but here we check existence.
  // For stricter edge-compatible JWT verification, we would need 'jose' library.
  // For now, simpler check: if trying to access admin pages, assume API will catch if token is invalid,
  // but let's check if the path is /admin and maybe hint at role?
  // We will assume the API route handles the deep security validation.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};