import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

function Contacts({ location, whatsapp, phone }) {
  const t = useTranslations("home");

  return (
    <>
      <a
        href={location}
        className="font-ITC-BK text-sm flex flex-col text-center items-center  gap-1 w-full text-faded-0"
        target="_blank"
      >
        <Image
          src={"svg/location.svg"}
          alt="location"
          width={21}
          height={21}
        ></Image>
        <span>{t("location")}</span>
      </a>
      <a
        href={`https://wa.me/${whatsapp}`}
        className=" font-ITC-BK text-sm flex flex-col text-center items-center gap-1 w-full text-faded-0"
        target="_blank"
      >
        <Image
          src={"svg/whatsapp.svg"}
          alt="whatsapp"
          width={21}
          height={21}
        ></Image>
        <span>{t("whatsapp")}</span>
      </a>
      <a
        href={`tel:${phone}`}
        className="font-ITC-BK text-sm flex flex-col text-center items-center gap-1 w-full text-faded-0 "
        target="_blank"
      >
        <Image src={"svg/call.svg"} alt="call" width={21} height={21}></Image>
        <span>{t("call")}</span>
      </a>
    </>
  );
}

export default Contacts;
