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

import { drupal } from "./lib/drupal";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import Head from "next/head";

const params = new DrupalJsonApiParams()
  .addFields("node--product", [
    "path",
    "title",
    "body",
    "field_price",
    "field_category",
    "field_image",
    "drupal_internal__nid",
    "body",
    "field_out_of_stock",
  ])
  .addInclude(["field_category", "field_image"])
  .addPageLimit(200);



const products = await drupal.getResourceCollection("node--product", {
  params: params.getQueryObject(),
});


const productsMapped = products.map((product) => {
  const itemId = product.drupal_internal__nid;
  const itemName = product.title;
  const itemCategories = product.field_category.map(
    (category) => category.name
  );

  const itemPrice = parseFloat(product.field_price);
  const itemDescription = product.body?.value || "";
  const itemImage = product.field_image?.uri?.url
    ? process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + product.field_image?.uri.url
    : "/svg/img-placeholder.svg";

  const itemOutOfStock =
    product.field_out_of_stock || product.field_out_of_stock !== null;

  return {
    id: itemId,
    name: itemName,
    categories: itemCategories,
    price: itemPrice,
    description: itemDescription,
    image: itemImage,
    outOfStock: itemOutOfStock,
    // Add other properties you need
  };
});

const allCategories = products.reduce((categories, product) => {
  return categories.concat(
    product.field_category
      .filter((category) => category.name !== "Most Selling") // Exclude 'Most Selling'
      .map((category) => category.name)
  );
}, []);

const uniqueCategories = Array.from(new Set(allCategories));

const mostSellingProducts = productsMapped.filter((product) =>
  product.categories.includes("Most Selling")
);

let categorizedMenu = {};

productsMapped.forEach((item) => {
  const hasMostSellingCategory = item.categories.some(
    (category) => category === "Most Selling"
  );

  if (!hasMostSellingCategory) {
    item.categories.forEach((category) => {
      if (!categorizedMenu[category]) {
        categorizedMenu[category] = [];
      }

      categorizedMenu[category].push({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        outOfStock: item.outOfStock,
      });
    });
  }
});

const params2 = new DrupalJsonApiParams().addInclude([
  "field_image",
  "field_business",
  "field_logo",
]);

const pageData = await drupal.getResource(
  "node--page",
  process.env.NEXT_PUBLIC_DRUPAL_PAGE_UUID,
  {
    params: params2.getQueryObject(),
  }
);

export default function Home() {
  return (
    <main className="text-center m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px]">
       <Head>
        <link
          rel="icon"
          href={
            process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
            pageData.field_logo.uri.url
          }
          type="image/x-icon"
        />
      </Head>
      <Header headerSrc={pageData.field_image} />
      <Intro
        title={pageData.title}
        logo={pageData.field_logo}
        business={pageData.field_business}
        address={pageData.field_address}
      />

      {/* Contacts */}
      <div className="flex py-4 justify-center text-center border-t-[1px]  border-solid border-[#edf2f7] shadow-custom">
        <Contacts
          location={pageData.field_location.uri}
          whatsapp={pageData.field_whatsapp}
          phone={pageData.field_phone}
        />
      </div>
      {/* End Contacts */}
      {/* 
      <Offers /> */}

      <NavBar categories={uniqueCategories} />

      {mostSellingProducts.length > 0 && (
        <MostSelling mostSelling={mostSellingProducts} />
      )}

      <MainItems data={categorizedMenu} />

      <Footer
        charges={pageData.field_delivery_charges}
        location={pageData.field_location.uri}
        whatsapp={pageData.field_whatsapp}
        phone={pageData.field_phone}
        minimum={pageData.field_minimum_order}
        telegramId={pageData.field_telegram_chat_id}
        storeLang={pageData.field_communication_language}
      />
    </main>
  );
}
