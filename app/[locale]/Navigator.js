"use client";
import { useState } from "react";
import Header from "./common/Header";
import Intro from "./common/Intro";
import Contacts from "./common/Contacts";
import Products from "./common/Products";
import Footer from "./common/Footer";

function Navigator({ page, locale }) {
  const [currentView, setCurrentView] = useState("home");

  let content;

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
  return  ({content}) ;
}

export default Navigator;
