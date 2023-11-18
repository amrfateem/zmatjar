import Image from "next/image";
import React from "react";

function Header({ headerSrc, color }) {
  return (
    <div
      className={`w-full h-64 bg-cover`}
      style={{
        backgroundImage: `url('${
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + headerSrc.uri.url
        }')`,
      }}
    >
      <button className="button text-white px-[10px] py-[5px]  mx-[5px] my-[10px] opacity-80 rounded-md text-center right-[10px] absolute bg-brand">
        عربي
      </button>
    </div>
  );
}

export default Header;
