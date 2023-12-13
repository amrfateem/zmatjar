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

const param21 = new DrupalJsonApiParams()
  .addInclude(["field_logo", "field_image"])
  .addFields("node--page", [
    "title",
    "field_primary_color",
    "field_primary_color",
    "field_logo",
    "field_telegram_chat_id",
    "field_communication_language",
    "field_metatags",
    "field_image",
    "field_gtm_id",
    "body",
  ]);

let pageData;

const queryString = param21.getQueryString({ encode: false });

try {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
      "/jsonapi/node/page?jsonapi_include=1&" +
      queryString
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  pageData = data.data;
} catch (error) {
  console.error(error);
}

export async function generateMetadata({ params: { locale } }) {
  let page;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/store-metadata.json?lang=${locale}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    page = data[0];
  } catch (error) {
    console.error(error);
  }

  return {
    title: page.title,
    description: page.body,
    icons: {
      icon: [
        {
          url:
            process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page.logo,
        },
        new URL(
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page.logo,
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page.logo
        ),
      ],
      shortcut:
        process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page.logo,
      apple: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page.logo,
      other: {
        rel: "apple-touch-icon-precomposed",
        url: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page.logo,
      },
    },
  };
}

export default function RootLayout({ children, params: { locale } }) {
  const messages = useMessages();
  const dir = isRtlLang(locale) ? "rtl" : "ltr";
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta name="robots" content={pageData[0].field_metatags?.robots} />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_MAIN_SITE} />
        <link rel="shortlink" href={process.env.NEXT_PUBLIC_MAIN_SITE} />
        <link
          rel="icon"
          href={
            process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
            pageData[0].field_logo.uri.url
          }
          type="image/x-icon"
        />
        <meta
          name="msapplication-TileColor"
          content={`#${pageData[0].field_primary_color}`}
        />
        <meta
          name="theme-color"
          content={`#${pageData[0].field_primary_color}`}
        />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_MAIN_SITE} />
        <meta
          property="og:image"
          content={
            process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
            pageData[0].field_image.uri.url
          }
        />

        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',"${pageData[0].field_gtm_id}");
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${pageData[0].field_gtm_id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ` :root { --brand-color:  #${pageData[0]?.field_primary_color}; --brand-color-bg:  #${pageData[0]?.field_primary_color}45; }`,
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
