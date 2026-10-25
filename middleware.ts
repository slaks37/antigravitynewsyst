import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Check if host matches cms subdomain (cms.newsystem.space, cms.localhost, etc.)
  const isCmsSubdomain =
    hostname.startsWith("cms.") ||
    hostname.includes("cms.newsystem.space");

  if (isCmsSubdomain) {
    // If accessing root of cms subdomain, rewrite to /admin
    if (url.pathname === "/") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }

    // If accessing any path on cms subdomain that doesn't already start with /admin, /api, /_next, etc.,
    // rewrite it to /admin/${path} (e.g. cms.newsystem.space/posts -> /admin/posts)
    const isPublicAsset =
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/brand") ||
      url.pathname.startsWith("/favicon") ||
      url.pathname.includes(".");

    if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") &&
      !isPublicAsset
    ) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
