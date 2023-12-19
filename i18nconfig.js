const localesData = require("./locales.js");

export const defaultLocale = localesData.defaultLocale;
export const locales = localesData.locales;

export const localeNames = {
  en: "English",
  ar: "العربية (Arabic)",
};

export const i18nConfig = {
  locales: locales,
  defaultLocale: defaultLocale,
  localeDetector: false,
};
