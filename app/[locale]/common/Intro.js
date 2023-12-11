import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

function Intro({ title, logo, business, branches }) {
  let branchesNames = [];
  const businessNames = business.map((item) => item.name).join(" .");
  branchesNames = branches.map((item) => ({
    address: item.field_address,
    map: item.field_location,
  }));

  return (
    <div className="container bg-white p-4 mb-4">
      <div className="intro flex items-center">
        <div className="logo pe-4  ">
          <Image
            src={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + logo.uri.url}
            alt="logo"
            quality={100}
            width={64}
            height={64}
            className="rounded-md"
          ></Image>
        </div>
        <div className="details text-start pt-2">
          <h1 className="name font-extrabold text-2xl mb-1 leading-3 font-ITC-bold">
            {title}
          </h1>
          <small className="category leading-6 text-xs font-ITC-BK text-brand">
            {businessNames}
          </small>
        </div>
      </div>
      {branchesNames.length > 0 && (
        <div className="location text-start pt-4 text-sm">
          {branchesNames.map((item, index) => (
            <p key={index} className="text-faded-0 font-ITC-BK pb-3">
              <a href={item.map.uri}>
                <FontAwesomeIcon icon={faLocationDot} size="xl" />
              </a>{" "}
              {item.address}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Intro;
