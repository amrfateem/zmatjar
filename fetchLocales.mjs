import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

export const fetchLocales = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/page?jsonapi_include=1&fields[node--page]=field_default_language,field_slanguages`,
    {
      method: "GET",
      headers: {
        "Cache-Control": "no-store", // Specify cache control header
      },
    }
  );

  const data = await res.json();
  const defaultLocale = data.data[0].field_default_language;
  const locales = data.data[0].field_slanguages;

  // Determine the current directory dynamically
  const filePath = path.join("./", "locales.js");

  const content = `
    module.exports = {
      defaultLocale: "${defaultLocale}",
      locales: ${JSON.stringify(locales)},
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
