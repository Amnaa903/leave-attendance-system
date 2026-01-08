import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Login page allow karo
  if (path === '/login' || path === '/') {
    return NextResponse.next();
  }
  
  // API calls allow karo
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check token
  const token = request.cookies.get('token')?.value;
  
  // Agar token nahi hai to login page bhejo
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Agar token hai to aage jane do
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};