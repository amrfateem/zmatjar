import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="w-full h-64 bg-[url('/images/header/header-image.jpg')] bg-cover">
      <button className="button bg-[#b11f23] text-white px-[10px] py-[5px]  mx-[5px] my-[10px] opacity-80 rounded-md text-center right-[10px] absolute ">
        عربي
      </button>
    </div>
  );
}

export default Header;
