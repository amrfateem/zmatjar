import Contacts from "./common/Contacts";
import Footer from "./common/Footer";
import Header from "./common/Header";
import Intro from "./common/Intro";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { unstable_setRequestLocale } from "next-intl/server";
import { locales } from "@/i18nconfig";
import Products from "./common/Products";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale);

  // PAGE DATE AND IT"S PARAMETERS

  const param21 = new DrupalJsonApiParams()
    .addInclude(["field_logo", "field_image", "field_branch", "field_business"])
    .addFields("node--page", [
      "title",
      "field_primary_color",
      "field_logo",
      "field_telegram_chat_id",
      "field_communication_language",
      "field_metatags",
      "field_image",
      "field_location",
      "field_gtm_id",
      "field_image",
      "field_business",
      "field_logo",
      "field_branch",
      "field_whatsapp",
      "field_phone",
      "field_delivery_charges",
      "field_minimum_order",
      "body",
    ]);
  let page;

  const pageQuery = param21.getQueryString({ encode: false });

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
        `/${locale}/` +
        "/jsonapi/node/page?jsonapi_include=1&" +
        pageQuery,
      {
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    page = data.data;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="text-center m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px]">
      <Header headerSrc={page[0].field_image} />
      <Intro
        title={page[0].title}
        logo={page[0].field_logo}
        business={page[0].field_business}
        branches={page[0].field_branch}
      />

      {/* Contacts */}
      <div className="flex py-4 justify-center text-center border-t-[1px]  border-solid border-[#edf2f7] shadow-custom">
        <Contacts
          location={page[0].field_location.uri}
          whatsapp={page[0].field_whatsapp}
          phone={page[0].field_phone}
        />
      </div>

      <Products locale={locale} />

      <Footer
        charges={page[0].field_delivery_charges}
        location={page[0].field_location.uri}
        whatsapp={page[0].field_whatsapp}
        phone={page[0].field_phone}
        minimum={page[0].field_minimum_order}
        telegramId={page[0].field_telegram_chat_id}
        storeLang={page[0].field_comm_lang}
      />
    </div>
  );
}
