import Image from "next/image";
import React from "react";

function Intro({ title, logo, business, address }) {
  const businessNames = business.map((item) => item.name).join(" .");

  return (
    <div className="container bg-white p-4 mb-4">
      <div className="intro flex items-center">
        <div className="logo pr-4 ">
          <Image
            src={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + logo.uri.url}
            alt="logo"
            quality={100}
            width={64}
            height={64}
          ></Image>
        </div>
        <div className="details text-start pt-2">
          <h1 className="name font-extrabold text-2xl mb-1 leading-3 font-ITC-bold">
            {title}
          </h1>
          <small className="category leading-6  text-xs font-ITC-BK text-brand">
            {businessNames}
          </small>
        </div>
      </div>
      <div className="location text-start pt-4 text-sm">
        <p className="text-faded-0 font-ITC-BK">{address}</p>
      </div>
    </div>
  );
}

export default Intro;
