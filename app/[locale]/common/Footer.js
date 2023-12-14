"use client";
import { useState, useEffect } from "react";
import Contacts from "./Contacts";
import { useRecoilState, useRecoilValue } from "recoil";
import { chargesState, countState, minimumOrderState, storeLangState, sumState, telegramChatIdState, } from "../atoms";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

function Footer({ charges, location, whatsapp, phone, minimum, telegramId, storeLang, }) {
  const router = useRouter();
  const locale = useLocale();
  const [offsetTop, setOffsetTop] = useState(0);
  const count = useRecoilValue(countState);
  const sum = useRecoilValue(sumState);
  const [isOverMinimum, setIsOverMinimum] = useState(false);

  const [deliveryCharges, setDeliveryCharges] = useRecoilState(chargesState);
  const [minimumOrder, setMinimumOrder] = useRecoilState(minimumOrderState);

  const [telegramChatId, setTelegramChatId] =
    useRecoilState(telegramChatIdState);
  const [storeLanguage, setStoreLanguage] = useRecoilState(storeLangState);

  setDeliveryCharges(charges ? charges : 0);
  setMinimumOrder(minimum ? minimum : 0);

  setTelegramChatId(telegramId ? telegramId : 0);
  setStoreLanguage(storeLang ? storeLang : "en");

  const url = new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL);
  const subdomain = url.host.split(".")[1];

  useEffect(() => {
    const handleScroll = () => {
      setOffsetTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const t = useTranslations();

  useEffect(() => {
    if (sum >= minimum) {
      setIsOverMinimum(false);
    }
  }, [sum, minimum]);

  const handleCart = () => {
    if (sum < Number(minimum)) {
      setIsOverMinimum(true);
    } else {
      setIsOverMinimum(false);
      router.push(`/${locale}/cart`, undefined, { shallow: true });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center ">
        <p className="text-start w-full p-4 text-sm line-normal font-ITC-BK rtl:font-DIN-Bold">
          {t("home.prices_vat")}
        </p>
      </div>

      <a
        className={`flex justify-center items-center py-2 text-faded-0 text-sm bg-[#F5F5F5] font-ITC-BK rtl:font-DIN-Bold text-center ${
          count > 0 ? " pb-[140px]" : "pb-[85px]"
        }`}
        href={`https://www.zmatjar.com/?utm_content=powered-by&utm_source=${subdomain}&utm_medium=business-storefront&utm_campaign=business-partner`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p> {t("home.powered_by")}</p>
      </a>

      <div
        className={`flex flex-col justify-center text-center border border-solid bg-white z-20 border-[#cbd5e0] fixed bottom-0  w-full max-w-[460px] transition-all duration-500 ease-in-out ${
          offsetTop > 500 ? "" : "translate-y-full invisible"
        }`}
      >
        {isOverMinimum && (
          <div className="items-start p-2 px-3 text-xs  text-start font-ITC-BK rtl:font-DIN-Bold">
            <p>
              {t("minimum")} {t("currency", { price: minimum })}
            </p>
          </div>
        )}
        {count > 0 && (
          <div
            className="cart flex justify-between items-center  mx-3 my-2 px-4 py-2 text-white rounded-md cursor-pointer bg-secondry"
            onClick={handleCart}
          >
            <div className="basket-txt font-ITC-BK rtl:font-DIN-Bold text-xs uppercase">
              {t("home.view_basket")}
            </div>
            <div className="basket inline-block relative ltr:text-right rtl:text-left font-ITC-BK rtl:font-DIN-Bold">
              <span className="me-8 text-xs">
                {t("currency", { price: Number(sum.toFixed(2)) })}
              </span>
              <svg
                viewBox="0 0 96 96"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current text-white w-6 h-6 absolute ltr:right-0 rtl:left-0 top-1"
              >
                <defs>
                  <clipPath id="clip-cart">
                    <rect width="96" height="96"></rect>
                  </clipPath>
                </defs>
                <g id="cart" clipPath="url(#clip-cart)">
                  <g id="pills" transform="translate(0 -116)">
                    <g id="Group_154" data-name="Group 154">
                      <path
                        id="Path_188"
                        data-name="Path 188"
                        d="M92,132H84.619a8.361,8.361,0,0,0-7.956,5.47L63.712,174.53A8.364,8.364,0,0,1,55.755,180H21.321a8.4,8.4,0,0,1-7.773-4.994l-8.925-21C2.387,148.746,6.445,143,12.4,143H57"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                      ></path>
                      <circle
                        id="Ellipse_335"
                        data-name="Ellipse 335"
                        cx="4.5"
                        cy="4.5"
                        r="4.5"
                        transform="translate(20 187)"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                      ></circle>
                      <circle
                        id="Ellipse_336"
                        data-name="Ellipse 336"
                        cx="4.5"
                        cy="4.5"
                        r="4.5"
                        transform="translate(49 187)"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                      ></circle>
                    </g>
                  </g>
                </g>
              </svg>
              <span className=" transition-all duration-300 ease-in justify-center w-4 h-4 rounded-full text-on-primary bg-primary text-xs leading-4 absolute top-0 ltr:right-3 rtl:left-3 bg-white text-secondry text-center">
                {count}
              </span>
            </div>
          </div>
        )}

        <div className="flex py-4 justify-center text-center    ">
          <Contacts location={location} whatsapp={whatsapp} phone={phone} />
        </div>
      </div>
    </>
  );
}

export default Footer;
