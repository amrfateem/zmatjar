import { Inter } from "next/font/google";
import "./globals.css";

import RecoidContextProvider from "./recoilContextProvider";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { isRtlLang } from "rtl-detect";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

import { locales } from "@/i18nconfig";
import { unstable_setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { pageData } from "@/locales.js";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function saveOrUpdateUTMParameters() {
  if (typeof window !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search);

    // Define an array to store UTM parameters
    const utmParams = [];

    if (queryParams.has("utm_source")) {
      utmParams.push({
        key: "utm_source",
        value: queryParams.get("utm_source"),
      });
    }
    if (queryParams.has("utm_medium")) {
      utmParams.push({
        key: "utm_medium",
        value: queryParams.get("utm_medium"),
      });
    }
    if (queryParams.has("utm_campaign")) {
      utmParams.push({
        key: "utm_campaign",
        value: queryParams.get("utm_campaign"),
      });
    }
    if (queryParams.has("utm_term")) {
      utmParams.push({ key: "utm_term", value: queryParams.get("utm_term") });
    }
    if (queryParams.has("utm_content")) {
      utmParams.push({
        key: "utm_content",
        value: queryParams.get("utm_content"),
      });
    }

    // Loop through the UTM parameters and save each one in a separate cookie
    utmParams.forEach((param) => {
      setCookie(`${param.key}`, param.value, 30);
    });
  }
}

if (typeof window !== "undefined") {
  host = window.location.host;
}

// Call the function to save or update UTM parameters
saveOrUpdateUTMParameters();

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  document.cookie = cookie; // Set the cookie in the browser environment
}

export async function generateMetadata({ params: { locale } }) {
  const { [locale + "Meta"]: dynamicMeta } = await import("@/locales");
  return {
    title: dynamicMeta.title,
    description: dynamicMeta.body,
    icons: {
      icon: [
        {
          url: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + dynamicMeta.logo,
        },
        new URL(
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + dynamicMeta.logo,
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + dynamicMeta.logo
        ),
      ],
      shortcut: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + dynamicMeta.logo,
      apple: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + dynamicMeta.logo,
      other: {
        rel: "apple-touch-icon-precomposed",
        url: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + dynamicMeta.logo,
      },
    },
  };
}

export default function RootLayout({ children, params: { locale } }) {
  unstable_setRequestLocale(locale);

  const messages = useMessages();
  const dir = isRtlLang(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta name="robots" content={pageData.metatags} />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_MAIN_SITE} />
        <link rel="shortlink" href={process.env.NEXT_PUBLIC_MAIN_SITE} />
        <link
          rel="icon"
          href={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + pageData?.logo}
          type="image/x-icon"
        />
        <meta
          name="msapplication-TileColor"
          content={`#${pageData.primaryColor}`}
        />
        <meta name="theme-color" content={`#${pageData.primaryColor}`} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_MAIN_SITE} />
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + pageData?.image}
        />

        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',"${pageData.gtm}");
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${pageData.gtm}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ` :root { --brand-color:  #${pageData.primaryColor}; --brand-color-bg:  #${pageData.primaryColor}45; }`,
          }}
        />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <RecoidContextProvider>
            {children}
            <SpeedInsights />
          </RecoidContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
