import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all staff dashboard routes from unauthorized access
  if (pathname.startsWith('/staff/dashboard')) {
    const staffToken =
      request.cookies.get('rite_plus_staff_token')?.value ||
      request.cookies.get('staff_token')?.value;

    if (!staffToken) {
      const loginUrl = new URL('/staff/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/staff/dashboard/:path*'],
};
