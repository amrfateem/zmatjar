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
  const  defaultLocale  = data.data[0].field_default_language;
  const  locales  = data.data[0].field_slanguages;


  return { defaultLocale, locales };
};
