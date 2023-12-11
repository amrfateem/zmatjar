import { useTranslations } from "next-intl";
import Contacts from "./common/Contacts";
import Footer from "./common/Footer";
import Header from "./common/Header";
import Intro from "./common/Intro";
import MainItems from "./common/MainItems";
import MostSelling from "./common/MostSelling";
import NavBar from "./common/NavBar";
import Offers from "./common/Offers";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;



export default async function Home({ params }) {
  const params1 = new DrupalJsonApiParams()
    .addFields("node--product", [ "path", "title", "body", "field_price", "field_category", "field_image", "drupal_internal__nid", "body", "field_out_of_stock", "field_path", ])
    .addInclude(["field_category", "field_image"])
    .addPageLimit(200);

  const queryString = params1.getQueryString({ encode: false });

  let products;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
        `/${params.locale}/` +
        "/jsonapi/node/product?jsonapi_include=1&" +
        queryString,
      { next: { revalidate: 0 } },
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    products = data.data;
  } catch (error) {
    console.error(error);
  }

  const productsMapped = products.map((product) => {
    const itemId = product.drupal_internal__nid;
    const itemName = product.title;
    const itemCategories = product.field_category.map((category) => category);
    const itemPath = product.field_path;

    const itemPrice = parseFloat(product.field_price);
    const itemDescription = product.body?.value || "";
    const itemImage = product.field_image?.uri?.url
      ? process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + product.field_image?.uri.url
      : "/svg/img-placeholder.svg";

    let itemOutOfStock;

    if (product.field_out_of_stock === null) {
      itemOutOfStock = false;
    } else if (product.field_out_of_stock === false) {
      itemOutOfStock = false;
    } else {
      itemOutOfStock = true;
    }

    return {
      id: itemId,
      name: itemName,
      categories: itemCategories,
      price: itemPrice,
      description: itemDescription,
      image: itemImage,
      outOfStock: itemOutOfStock,
      path: itemPath,
      // Add other properties you need
    };
  });

  const allCategories = products
    .reduce((categories, product) => {
      return categories.concat(
        product.field_category
          .filter((category) => category.name !== "Most Selling")
          .map((category) => ({ name: category.name, weight: category.weight }))
      );
    }, [])
    .sort((a, b) => a.weight - b.weight)
    .map((category) => category.name);

  const uniqueCategories = Array.from(new Set(allCategories));

  const mostSellingProducts = productsMapped.filter((product) =>
    product.categories.some((category) => category.name === "Most Selling")
  );

  let categorizedMenu = {};
  let categoryWeights = {};

  productsMapped.forEach((item) => {
    const hasMostSellingCategory = item.categories.some(
      (category) => category.name === "Most Selling"
    );

    if (!hasMostSellingCategory) {
      item.categories.forEach((category) => {
        const categoryName = category.name;

        if (!categorizedMenu[categoryName]) {
          categorizedMenu[categoryName] = [];
        }

        categorizedMenu[categoryName].push({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          path: item.path,
          outOfStock: item.outOfStock,
        });

        // Store category weight information separately
        categoryWeights[categoryName] = category.weight;
      });
    }
  });

  // Sort categories based on their order
  const sortedCategories = Object.keys(categorizedMenu).sort(
    (a, b) => categoryWeights[a] - categoryWeights[b]
  );

  // Create a new object with sorted categories
  const sortedCategorizedMenu = {};
  sortedCategories.forEach((category) => {
    sortedCategorizedMenu[category] = categorizedMenu[category];
  });

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
        `/${params.locale}/` +
        "/jsonapi/node/page?jsonapi_include=1&" +
        pageQuery,
      { next: { revalidate: 0 } },
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    page = data.data;
  } catch (error) {
    console.error(error);
  }

  unstable_setRequestLocale(params.locale)
  return (
    <main className="text-center m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px]">
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
      {/* End Contacts */}
      {/* 
      <Offers /> */}

      <NavBar categories={uniqueCategories} />

      {mostSellingProducts.length > 0 && (
        <MostSelling mostSelling={mostSellingProducts} />
      )}

      <MainItems data={sortedCategorizedMenu} />

      <Footer
        locale={params.locale}
        charges={page[0].field_delivery_charges}
        location={page[0].field_location.uri}
        whatsapp={page[0].field_whatsapp}
        phone={page[0].field_phone}
        minimum={page[0].field_minimum_order}
        telegramId={page[0].field_telegram_chat_id}
        storeLang={page[0].field_comm_lang}
      />
    </main>
  );
}
