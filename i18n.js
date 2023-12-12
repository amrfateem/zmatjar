import { getRequestConfig } from "next-intl/server";

// Create this configuration once per request and 
// make it available to all Server Components.
export default getRequestConfig(async ({ locale }) => ({
  // Load translations for the active locale.
  messages: (await import(`./messages/${locale}.json`)).default,
}));