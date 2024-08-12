import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  const isLoggedIn =
    token && (pathname === "/sign-in" || pathname === "/sign-up");

  const protectDashboard = !token && pathname === "/dashboard";

  if (isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (protectDashboard) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
