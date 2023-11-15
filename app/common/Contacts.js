import Image from "next/image";
import React from "react";

function Contacts() {
  return (
    <>
      <a
        href="https://goo.gl/maps/6Tyrp8ooZFfQZhL39"
        className="font-ITC-BK text-sm flex flex-col text-center items-center  gap-1 w-full text-faded-0"
        target="_blank"
      >
        <Image
          src={"svg/location.svg"}
          alt="location"
          width={21}
          height={21}
        ></Image>
        <span>Location</span>
      </a>
      <a
        href="https://wa.me/971502385613"
        className=" font-ITC-BK text-sm flex flex-col text-center items-center gap-1 w-full text-faded-0"
        target="_blank"
      >
        <Image
          src={"svg/whatsapp.svg"}
          alt="whatsapp"
          width={21}
          height={21}
        ></Image>
        <span>WhatsApp</span>
      </a>
      <a
        href="tel:0502385613"
        className="font-ITC-BK text-sm flex flex-col text-center items-center gap-1 w-full text-faded-0 "
        target="_blank"
      >
        <Image src={"svg/call.svg"} alt="call" width={21} height={21}></Image>
        <span>Call</span>
      </a>
    </>
  );
}

export default Contacts;