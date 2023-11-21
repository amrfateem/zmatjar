"use client";
import { useEffect, useState } from "react";
import Contacts from "./Contacts";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chargesState,
  countState,
  minimumOrderState,
  storeLangState,
  sumState,
  telegramChatIdState,
} from "../atoms";
import { useRouter } from "next/navigation";

function Footer({
  charges,
  location,
  whatsapp,
  phone,
  minimum,
  telegramId,
  storeLang,
}) {
  const router = useRouter();
  const [offsetTop, setOffsetTop] = useState(0);
  const count = useRecoilValue(countState);
  const sum = useRecoilValue(sumState);

  const [deliveryCharges, setDeliveryCharges] = useRecoilState(chargesState);
  const [minimumOrder, setMinimumOrder] = useRecoilState(minimumOrderState);

  const [telegramChatId, setTelegramChatId] =
    useRecoilState(telegramChatIdState);
  const [storeLanguage, setStoreLanguage] = useRecoilState(storeLangState);

  setDeliveryCharges(charges ? charges : 0);
  setMinimumOrder(minimum ? minimum : 0);

  setTelegramChatId(telegramId ? telegramId : 0);
  setStoreLanguage(storeLang ? storeLang : "en");

  useEffect(() => {
    const handleScroll = () => {
      setOffsetTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="flex justify-center items-center ">
        <p className="text-start w-full p-4 text-sm line-normal font-ITC-BK">
          All prices are inclusive of VAT
        </p>
      </div>

      <a
        className={`flex justify-center items-center py-2 text-faded-0 text-sm bg-[#F5F5F5]  text-center ${
          count > 0 ? " pb-[140px]" : "pb-[70px]"
        }`}
        href={`https://www.zmatjar.com/?utm_content=powered-by&amp;utm_source=${window.location.hostname}&amp;utm_medium=business-storefront&amp;utm_campaign=business-partner`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>Powered by ZMatjar</p>
      </a>

      <div
        className={`flex flex-col justify-center text-center border border-solid bg-white z-20 border-[#cbd5e0] fixed bottom-0  w-full max-w-[460px] transition-all duration-500 ease-in-out ${
          offsetTop > 500 ? "" : "translate-y-full invisible"
        }`}
      >
        {count > 0 && minimum > sum && (
          <div className="items-start p-2 px-3 text-sm  text-start">
            <p>Sorry, Minimum order can not be less than AED {minimum}</p>
          </div>
        )}
        {count > 0 && (
          <div
            className="cart flex justify-between items-center  mx-3 my-2 px-4 py-2 text-white rounded-md cursor-pointer bg-secondry"
            onClick={() => {
              minimum > sum ? "" : router.push("/cart");
            }}
          >
            <div className="basket-txt font-ITC-BK text-xs uppercase">
              View basket
            </div>
            <div className="basket inline-block relative text-right">
              <span className="mr-8 text-xs">AED {Number(sum.toFixed(2))}</span>
              <svg
                viewBox="0 0 96 96"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current text-white w-6 h-6 absolute right-0 top-1"
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
              <span className=" transition-all duration-300 ease-in justify-center w-4 h-4 rounded-full text-on-primary bg-primary text-xs leading-4 absolute top-0 right-3 bg-white text-black text-center">
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
