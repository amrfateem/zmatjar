"use client";
import { Button } from "flowbite-react";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-x-[1px] h-screen">
      <div className="header flex justify-between items-center h-11 text-center shadow-custom border-b-2">
        <h2 className="px-3 py-2  w-full text-base font-semibold font-ITC-BK">
          THANK YOU
        </h2>
        <Link href="/">
          <Button
            theme={{
              size: "text-sm p-3",
            }}
            color={"bg-secondry"}
            className="btn btn-secondary rounded-none btn h-11 p-3 bg-[#F5F5F5]"
          >
            <svg width={21} height={21} version="1.1" className="active-svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" >
              <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
            </svg>
          </Button>
        </Link>
      </div>

      <div className="text-center m-auto py-40 ">
        <p>Your order has been placed successfully.</p>

        <p suppressHydrationWarning className="pt-4">
          Your order number is:{" "}
          {Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}
        </p>

        <p className="pt-4">
          Your order status is now <span className="font-bold">Processing</span>
          .
        </p>
      </div>

      <div className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0 shadow-custom-up ">
        <Link href="/">
          <Button
            type="submit"
            className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent"
          >
            place order
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default page;
