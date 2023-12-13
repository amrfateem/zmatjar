"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { locales } from "../../../i18nconfig";

function Header({ headerSrc }) {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.push(`/${newLocale}`)
  };
  let img = encodeURI(
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + headerSrc.uri.url
  );
  return (
    <div
      className={`w-full h-64 bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {locales.length > 1 && (
        <button
          onClick={switchLocale}
          className="button text-white px-[10px] py-[5px]  mx-[5px] my-[10px] opacity-80 rounded-md text-center ltr:right-[10px] rtl:left-[10px] absolute bg-brand"
        >
          {locale === "en" ? "عربي" : "English"}
        </button>
      )}
    </div>
  );
}

export default Header;
