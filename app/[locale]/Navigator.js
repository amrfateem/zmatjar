"use client";
import { useEffect, useState } from "react";
import Header from "./common/Header";
import Intro from "./common/Intro";
import Contacts from "./common/Contacts";
import Footer from "./common/Footer";
import CartBody from "./(pages)/cart/components/CartBody";
import { useTranslations } from "next-intl";
import NavBar from "./common/NavBar";
import MostSelling from "./common/MostSelling";
import MainItems from "./common/MainItems";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import Body from "./(pages)/delivery-location/components/Body";
import PlaceOrderBody from "./(pages)/place-order/components/PlaceOrderBody";

function Navigator({ page, locale }) {
  const [currentView, setCurrentView] = useState("home");
  const t = useTranslations();

  let content;

  const handleCart = () => {
    setCurrentView("home");
    console.log("home");
  };

  const params1 = new DrupalJsonApiParams()
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
      "field_path",
    ])
    .addInclude(["field_category", "field_image"])
    .addFilter("langcode", locale)
    .addPageLimit(200);

  const queryString = params1.getQueryString({ encode: false });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
            `/${locale}/` +
            "/jsonapi/node/product?jsonapi_include=1&" +
            queryString,
          {
            cache: "no-cache",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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

  switch (currentView) {
    case "home":
      return (
        <div className="text-center m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px]">
          <Header headerSrc={page[0].field_image} />
          <Intro
            title={page[0].title}
            logo={page[0].field_logo}
            business={page[0].field_business}
            branches={page[0].field_branch}
          />
          <div className="flex py-4 justify-center text-center border-t-[1px]  border-solid border-[#edf2f7] shadow-custom">
            <Contacts
              location={page[0].field_location.uri}
              whatsapp={page[0].field_whatsapp}
              phone={page[0].field_phone}
            />
          </div>

          <NavBar categories={uniqueCategories} />

          {mostSellingProducts.length > 0 && (
            <MostSelling mostSelling={mostSellingProducts} />
          )}

          <MainItems data={sortedCategorizedMenu} />

          <Footer
            setView={setCurrentView}
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

    case "cart":
      return (
        <div className="text-start m-0 mx-auto max-w-[460px] border-solid border-[#dfe2e7] border-[1px] h-full min-h-screen relative">
          <div className="header flex justify-end p-0 items-center text-center  shadow-custom h-11 border-b-2 w-full bg-white">
            <h2 className="p-3  w-full text-base font-semibold rtl:font-extrabold font-ITC-BK rtl:font-DIN-Bold h-full">
              {t("cart.head")}
            </h2>
            <button
              color={"bg-secondry"}
              theme={{
                size: "text-sm p-3",
              }}
              onClick={handleCart}
              className="btn btn-secondary rounded-none btn h-11 p-3 bg-[#F5F5F5]"
            >
              <svg
                width={21}
                height={21}
                version="1.1"
                className="active-svg"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
              </svg>
            </button>
          </div>

          <CartBody setView={setCurrentView} />
        </div>
      );

    case "delivery":
      return (
        <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px] h-[100dvh] flex flex-col">
          {/* Header */}
          <div className="header flex justify-between items-center h-11 text-center shadow-custom border-b-2">
            <h2 className="py-2  w-full text-base font-semibold rtl:font-extrabold text font-ITC-BK rtl:font-DIN-Bold">
              {t("delivery.head")}
            </h2>
            <button
              color={"bg-secondry"}
              theme={{ size: "text-sm p-3" }}
              className="btn btn-secondary rounded-none btn h-11 p-3 bg-[#F5F5F5]"
              onClick={() => setCurrentView("home")}
            >
              <svg
                width={21}
                height={21}
                version="1.1"
                className="active-svg"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
              </svg>
            </button>
          </div>
          <div className="space-y-6 w-full h-full first-div-fix">
            <Body setView={setCurrentView} />
          </div>
        </div>
      );

    case "checkout":
      return (
        <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-x-[1px] h-screen">
          {/* Header */}
          <div className="header flex justify-between h-11 items-center text-center  shadow-custom border-b-2">
            <h2 className="px-3 py-2 w-full text-base font-semibold rtl:font-extrabold font-ITC-BK rtl:font-DIN-Bold">
              {t("place_order.head")}
            </h2>
            <button
              theme={{ size: "text-sm p-3" }}
              color={"bg-secondry"}
              className="btn btn-secondary rounded-none btn bg-[#F5F5F5] h-11 p-3"
              onClick={() => setCurrentView("home")}
            >
              <svg
                width={21}
                height={21}
                version="1.1"
                className="active-svg"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
              </svg>
            </button>
          </div>

          {/* Header end */}
          {/* Inputs name, phone, email, address, check box to aknowlege */}
          <PlaceOrderBody locale={locale} setView={setCurrentView} />
        </div>
      );
    case "thankyou":
      return (
        <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-x-[1px] h-screen">
          <div className="header flex justify-between items-center h-11 text-center shadow-custom border-b-2">
            <h2 className="px-3 py-2  w-full text-base font-semibold rtl:font-extrabold font-ITC-BK rtl:font-DIN-Bold">
              {t("thank_you.head")}
            </h2>
            <button
              theme={{ size: "text-sm p-3" }}
              onClick={() => setCurrentView("home")}
              color={"bg-secondry"}
              className="btn btn-secondary rounded-none btn h-11 p-3 bg-[#F5F5F5]"
            >
              <svg
                width={21}
                height={21}
                version="1.1"
                className="active-svg"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
              </svg>
            </button>
          </div>

          <div className="text-center m-auto py-40  font-ITC-BK rtl:font-DIN-Bold">
            <p>{t("thank_you.body")}</p>

            {/* <p suppressHydrationWarning className="pt-4">
            Your order number is:{" "}
            {Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}
          </p> */}

            <p className="pt-4">
              {t("thank_you.order_state_start")}{" "}
              <span className="font-bold">{t("thank_you.order_state")}</span>.
            </p>
          </div>

          <div className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0 shadow-custom-up ">
            <button
              type="submit"
              onClick={() => setCurrentView("home")}
              className="uppercase w-full p-3 rounded-md bg-secondry text-white font-ITC-BK rtl:font-DIN-Bold focus: focus:ring-secondry focus:border-transparent"
            >
              {t("thank_you.home_button")}
            </button>
          </div>
        </div>
      );
    default:
      content = null;
  }

  return { content };
}

export default Navigator;
