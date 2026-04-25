import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLang, isSupportedLanguage } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const LANG_COOKIE = "preferred_lang";

const COUNTRY_TO_LANG: Record<string, string> = {
  NL: "nl", BE: "nl",
  DE: "de", AT: "de", CH: "de",
  FR: "fr", LU: "fr", MC: "fr",
  IT: "it", SM: "it",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es",
  PT: "pt", BR: "pt",
  PL: "pl",
  RO: "ro",
  EE: "et",
  LV: "lv",
  FI: "fi",
  SE: "sv",
  DK: "da",
  NO: "no",
  CZ: "cs",
  HU: "hu",
  GR: "el",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0] ?? "";

  if (isSupportedLanguage(firstSegment)) {
    return NextResponse.next();
  }

  // Determine best language
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  if (cookieLang && isSupportedLanguage(cookieLang)) {
    return NextResponse.redirect(new URL(`/${cookieLang}${pathname}`, request.url));
  }

  const country = (request as unknown as { geo?: { country?: string } }).geo?.country ?? "";
  const countryLang = COUNTRY_TO_LANG[country];
  if (countryLang && isSupportedLanguage(countryLang)) {
    return NextResponse.redirect(new URL(`/${countryLang}${pathname}`, request.url));
  }

  const acceptLang = request.headers.get("accept-language") ?? "";
  const browserLang = acceptLang.split(",")[0]?.split("-")[0]?.trim() ?? "";
  if (browserLang && isSupportedLanguage(browserLang)) {
    return NextResponse.redirect(new URL(`/${browserLang}${pathname}`, request.url));
  }

  return NextResponse.redirect(new URL(`/${defaultLang}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
