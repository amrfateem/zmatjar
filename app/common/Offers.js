import Image from "next/image";
import React from "react";

function Offers() {
  return (
    <div className="container flex bg-[#F5F5F5] overflow-auto w-full py-4 px-2 gap-2 scrollbar-hide">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index}>
          <div className="offer-item w-72 min-w-[300px] px-2">
            <div className="offer-item_box bg-white py-3 items-center px-2 flex rounded-2xl shadow-custom">
              <div className="px-2">
                <div className="offer-item_icon flex items-center justify-center w-9 h-9 rounded-full bg-[#b11f2345] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill={"#b11f23"}
                    width={16}
                    height={16}
                  >
                    <path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0133.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 010 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path>
                  </svg>
                </div>
              </div>
              <div className="px-2 flex flex-col text-start font-ITC-BK ">
                <h3 className="offer-item_title text-sm font-semibold uppercase mb-1">
                  Welcome 10%
                </h3>
                <p className="offer-item_message text-xs text-faded-0">
                  Get 10% off your first 2 orders
                </p>
                <small className="text-black-300 text-xs line-normal block">
                  T&amp;C apply
                </small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Offers;
