import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle API authentication and CORS
 */
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Handle CORS for API routes
  if (path.startsWith("/api/")) {
    // Get the origin from the request headers (if needed)
    const origin = request.headers.get("origin") || "";

    // Create a new response
    const response = NextResponse.next();

    // Set CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return response;
  }

  // Continue for non-API routes
  return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: "/api/:path*",
};