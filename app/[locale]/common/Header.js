"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { locales } from "../../../i18nconfig";
import Image from "next/image";

function Header({ headerSrc }) {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.push(`/${newLocale}`, undefined, { shallow: true });
  };
  let img = encodeURI(
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + headerSrc.uri.url
  );
  return (
    <div className={`w-full h-64 relative`}>
      <Image
        className="absolute top-0 w-full h-full"
        src={img}
        alt="Picture of the store"
        width={460}
        height={250}
      />

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
