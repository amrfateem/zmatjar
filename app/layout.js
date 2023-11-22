import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import RecoidContextProvider from "./recoilContextProvider";
import { drupal } from "./lib/drupal";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";

const inter = Inter({ subsets: ["latin"] });

function saveOrUpdateUTMParameters() {
  let host = "";
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
  .addInclude(["field_logo"])
  .addFields("node--page", [
    "title",
    "field_primary_color",
    "field_logo",
    "field_telegram_chat_id",
    "field_communication_language",
    "field_metatags",
    "field_image",
    "body",
  ]);

const page = await drupal.getResourceCollection("node--page", {
  params: param21.getQueryObject(),
});

let hostname = "";

if (typeof window !== "undefined") {
  hostname = window.location.hostname;
}

export const metadata = {
  title: page[0].title,
  description: page[0].body.value,
  icons: {
    icon: [
      {
        url:
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url,
      },
      new URL(
        process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url,
        process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url
      ),
    ],
    shortcut:
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url,
    apple: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url,
    other: {
      rel: "apple-touch-icon-precomposed",
      url: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url,
    },
  },
  url: hostname,
  image: {
    url: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_image.uri.url,
    alt: page[0].title,
  },

  theme_color: `#${page[0].field_primary_color}`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content={page[0].field_metatags.robots} />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL} />
        <link rel="shortlink" href={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL} />
        <link rel="icon" href={ process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url } type="image/x-icon" />
        <meta name="msapplication-TileColor" content={`#${page[0].field_primary_color}`} />
        <meta name="theme-color" content={`#${page[0].field_primary_color}`} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL} />
        <meta property="og:image" content={ process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + page[0].field_logo.uri.url }
        />
      </head>
      <body className={inter.className}>
        <style
          dangerouslySetInnerHTML={{
            __html: ` :root { --brand-color:  #${
              page[0].field_primary_color
                ? page[0].field_primary_color
                : "000000"
            }; --brand-color-bg:  #${
              page[0].field_primary_color
                ? page[0].field_primary_color
                : "000000"
            }45; }`,
          }}
        />
        <RecoidContextProvider>{children}</RecoidContextProvider>
      </body>
    </html>
  );
}
