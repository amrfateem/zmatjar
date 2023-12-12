"use client";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";


function Header({ headerSrc }) {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.push(`/${newLocale}`)
  };
  let img = encodeURI(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + headerSrc.uri.url)
  return (
    <div
      className={`w-full h-64 bg-cover`}
      style={{
        backgroundImage: `url(${img})`
      }}
    >
      <button onClick={switchLocale} className="button text-white px-[10px] py-[5px]  mx-[5px] my-[10px] opacity-80 rounded-md text-center ltr:right-[10px] rtl:left-[10px] absolute bg-brand">
        {
          locale === 'en' ? 'عربي' : 'English'
        }
      </button>
    </div>
  );
}

export default Header;
