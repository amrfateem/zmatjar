import { Inter } from "next/font/google";
import "./globals.css";

import RecoidContextProvider from "./recoilContextProvider";
import { drupal } from "./lib/drupal";

const inter = Inter({ subsets: ["latin"] });

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

// Call the function to save or update UTM parameters
saveOrUpdateUTMParameters();

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  document.cookie = cookie; // Set the cookie in the browser environment
}

const pageData = await drupal.getResource(
  "node--page",
  process.env.NEXT_PUBLIC_DRUPAL_PAGE_UUID,
  {
    params: {
      fields: {
        "node--page": "field_primary_color,title,field_logo",
      },
      include: "field_logo",
    },
    withCache: false,
  }
);

export const metadata = {
  title: pageData.title,
  description: "ZMatjar App",
  icons: {
    icon: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + pageData.field_logo.uri.url,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://demo.zmatjar.com/en" />
        <link rel="shortlink" href="https://demo.zmatjar.com/en" />
        <link rel="icon" href={ process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + pageData.field_logo.uri.url } type="image/x-icon" />
        <meta name="msapplication-TileColor" content={`#${pageData.field_primary_color}`} />
        <meta name="theme-color" content={`#${pageData.field_primary_color}`} />
      </head>
      <body className={inter.className}>
        <style
          dangerouslySetInnerHTML={{
            __html: ` :root {
                             --brand-color:  #${pageData.field_primary_color};
                             --brand-color-bg:  #${pageData.field_primary_color}45;
                           }`,
          }}
        />
        <RecoidContextProvider>{children}</RecoidContextProvider>
      </body>
    </html>
  );
}
