import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n-config";

function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (preferred && locales.includes(preferred as Locale)) {
    return preferred as Locale;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".") // files with extensions (favicon, manifest, sw, etc.)
  ) {
    return;
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to the detected or default locale
  const locale = getLocaleFromHeaders(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|icons|.*\\..*).*)"],
};
