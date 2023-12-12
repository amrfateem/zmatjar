import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18nconfig";

console.log("defaultLocale", defaultLocale);

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false
});

export const config = {
  // Skip all paths that should not be internationalized.
  // This skips the folders "api", "_next" and all files
  // with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
