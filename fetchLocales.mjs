import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

export const fetchLocales = async () => {
  const [res, res2] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/page?jsonapi_include=1&fields[node--page]=field_default_language,field_slanguages`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-store", // Specify cache control header
        },
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/page?&fields[node--page]=field_default_location&jsonapi_include=1`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-store", // Specify cache control header
        },
      }
    ),
  ]);

  const [data, data2] = await Promise.all([res.json(), res2.json()]);

  const defaultMapLocation = data2.data[0].field_default_location;
  const defaultLocale = data.data[0].field_default_language;
  const locales = data.data[0].field_slanguages;

  // ${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/store-metadata.json?lang=${locale}

  const metaData = await Promise.all(
    locales.map(async (locale) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/store-metadata.json?lang=${locale}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-store", // Specify cache control header
          },
        }
      );
      const responseData = await response.json();
      return { [locale]: responseData };
    })
  );

  const mergedResponses = Object.assign({}, ...metaData);

  const pageData = await Promise.all(
    locales.map(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/page?jsonapi_include=1&fields[node--page]=field_logo,field_primary_color,field_telegram_chat_id,field_communication_language,field_metatags,field_image,field_gtm_id&include=field_logo,field_image`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-store", // Specify cache control header
          },
        }
      );
      const responseData = await response.json();
      return { responseData };
    })
  );

  const pageRespo = Object.assign({}, ...pageData);
  

  // Determine the current directory dynamically
  const filePath = path.join("./", "locales.js");

  const content = `
    module.exports = {
      defaultLocale: "${defaultLocale}",
      locales: ${JSON.stringify(locales)},
      defaultMapLocation: ${JSON.stringify(defaultMapLocation)},
      ${Object.entries(mergedResponses)
      .map(
        ([locale, response]) => `${locale}Meta: { 
            title: ${JSON.stringify(response[0].title.replace(/&amp;/g, '&'))},
            body: ${JSON.stringify(response[0].body)},
            logo: ${JSON.stringify(response[0].logo)},
          }`
      )
      .join(",\n")}
      ,pageData: { 
           gtm: ${JSON.stringify(pageRespo.responseData.data[0].field_gtm_id)},
            primaryColor: ${JSON.stringify(
        pageRespo.responseData.data[0].field_primary_color
      )},
            telegramChatId: ${JSON.stringify(
        pageRespo.responseData.data[0].field_telegram_chat_id
      )},
            communicationLanguage: ${JSON.stringify(
        pageRespo.responseData.data[0].field_communication_language
      )},
            metatags: ${JSON.stringify(
        pageRespo.responseData.data[0].field_metatags.robots
      )},
            image: ${JSON.stringify(
        pageRespo.responseData.data[0].field_image.uri.url
      )},
            logo: ${JSON.stringify(
        pageRespo.responseData.data[0].field_logo.uri.url
      )},
            
          }}`;

  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("File written successfully");
  } catch (error) {
    console.error("Error writing file:", error.message);
  }

  return { defaultLocale, locales };
};

// Run the function
fetchLocales();
