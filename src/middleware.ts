import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we'll handle authentication on the client side
  // This will be replaced with proper server-side auth once the adapter issues are resolved
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
}; 