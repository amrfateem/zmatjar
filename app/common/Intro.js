import Image from "next/image";
import React from "react";

function Intro() {
  return (
    <div className="container bg-white p-4 mb-4">
      <div className="intro flex items-center">
        <div className="logo pr-4 ">
          <Image
            src={"/images/logo.jpg"}
            alt="logo"
            quality={100}
            width={64}
            height={64}
          ></Image>
        </div>
        <div className="details text-start pt-2">
          <h1 className="name font-extrabold text-2xl mb-1 leading-3 font-ITC-bold">
            ZMatjar
          </h1>
          <small className="category leading-6  text-xs font-ITC-BK text-secondry-0">
            Desserts . Sandwiches . Chocolate
          </small>
        </div>
      </div>
      <div className="location text-start pt-4 text-sm">
        <p className="text-faded-0 font-ITC-BK">Dtech, Dubai Silicon Oasis, Dubai</p>
      </div>
    </div>
  );
}

export default Intro;
