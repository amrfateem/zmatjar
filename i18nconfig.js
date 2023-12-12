import { fetchLocales } from "./locales";

// Define initial values
export let defaultLocale = "en";
export let locales = ["en", "ar"];

export const localeNames = {
  en: "English",
  ar: "العربية (Arabic)",
};

// Use an async IIFE to fetch the locales and update the variables
(async () => {
  const { defaultLocale: fetchedDefaultLocale, locales: fetchedLocales } = await fetchLocales();

  // Update the variables with the fetched values
  defaultLocale = fetchedDefaultLocale;
  locales = fetchedLocales;

})();
