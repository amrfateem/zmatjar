import { useTranslations } from "next-intl";
import Link from "next/link";
import PlaceOrderBody from "./components/PlaceOrderBody";
import { locales } from "@/i18nconfig";
import { unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function PlaceOrder({ params: { locale } }) {
  // Router
  const t = useTranslations();
  unstable_setRequestLocale(locale);

  return (
    <>
      <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-x-[1px] h-screen">
        {/* Header */}
        <div className="header flex justify-between h-11 items-center text-center  shadow-custom border-b-2">
          <h2 className="px-3 py-2 w-full text-base font-semibold rtl:font-extrabold font-ITC-BK rtl:font-DIN-Bold">
            {t("place_order.head")}
          </h2>
          <Link href={`/${locale}`}>
            <button
              theme={{
                size: "text-sm p-3",
              }}
              color={"bg-secondry"}
              className="btn btn-secondary rounded-none btn bg-[#F5F5F5] h-11 p-3"
            >
              <svg
                width={21}
                height={21}
                version="1.1"
                className="active-svg"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
              </svg>
            </button>
          </Link>
        </div>

        {/* Header end */}
        {/* Inputs name, phone, email, address, check box to aknowlege */}
        <PlaceOrderBody />
      </div>
    </>
  );
}

export default PlaceOrder;
