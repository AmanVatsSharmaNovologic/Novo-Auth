import { NextResponse, type NextRequest } from "next/server";

import { logInfo } from "@/lib/logging/console";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  isThemeName,
} from "@/lib/theme/themes";

/**
 * The middleware will ultimately coordinate session enforcement, CSRF protections,
 * and logging for both public and protected routes. For now it augments theme
 * persistence and logs traffic.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const themeCookie = request.cookies.get(THEME_COOKIE)?.value;
  const country = request.headers.get("x-vercel-ip-country") ?? undefined;

  if (!isThemeName(themeCookie)) {
    response.cookies.set(THEME_COOKIE, DEFAULT_THEME, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  logInfo({
    scope: "middleware",
    event: "request",
    context: {
      path: request.nextUrl.pathname,
      country,
      theme: themeCookie && isThemeName(themeCookie) ? themeCookie : DEFAULT_THEME,
    },
  });

  return response;
}

/**
 * Restrict middleware to the app paths we care about. This list will be refined
 * once protected routing is wired with NextAuth session checks.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


