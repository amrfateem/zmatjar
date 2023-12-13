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
  

  // Determine the current directory dynamically
  const filePath = path.join("./", "locales.js");

  const content = `
    module.exports = {
      defaultLocale: "${defaultLocale}",
      locales: ${JSON.stringify(locales)},
      defaultMapLocation: ${JSON.stringify(defaultMapLocation)}
    };
  `;

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
