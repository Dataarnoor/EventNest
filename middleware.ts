import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow direct access to files in the uploads directory
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/uploads/:path*',
};
