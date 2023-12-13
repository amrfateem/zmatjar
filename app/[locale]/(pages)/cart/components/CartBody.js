"use client";
import  { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartState,
  chargesState,
  countState,
  minimumOrderState,
  specialInstructionsState,
  sumState,
  totalState,
} from "../../../atoms";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

function CartBody() {
  const t = useTranslations();
  const [cart, setCart] = useRecoilState(cartState || []);
  const [count, setCount] = useRecoilState(countState || 0);
  const [sum, setSum] = useRecoilState(sumState || 0);
  const [isOverMinimum, setIsOverMinimum] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const [total, setTotal] = useRecoilState(totalState);

  const charges = Number(useRecoilValue(chargesState));
  const minimum = Number(useRecoilValue(minimumOrderState));

  const [specialInstructions, setSpecialInstructions] = useRecoilState(
    specialInstructionsState
  );

  setTotal(sum + charges);

  const handleIncrement = (itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: {
        ...prevCart[itemId],
        quantity: prevCart[itemId].quantity + 1,
      },
    }));

    setSum(
      (prevSum) =>
        Number(prevSum.toFixed(2)) + Number(cart[itemId].price.toFixed(2))
    );
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };

      if (updatedCart[itemId].quantity > 1) {
        updatedCart[itemId] = {
          ...updatedCart[itemId],
          quantity: updatedCart[itemId].quantity - 1,
        };
      } else {
        // If quantity is 1, remove the item from the cart
        const { [itemId]: removedItem, ...rest } = updatedCart;
        return rest;
      }
      return updatedCart;
    });

    setSum(
      (prevSum) =>
        Number(prevSum.toFixed(2)) - Number(cart[itemId].price.toFixed(2))
    );
    setCount((prevCount) => prevCount - 1);
  };

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
      router.push(`/${locale}/delivery-location`);
    }
  };

  return (
    <div>
      <div
        className="space-y-6 px-3 py-2  pt-3"
        suppressHydrationWarning={true}
      >
        {count == 0 ? (
          <p className="font-ITC-BK rtl:font-DIN-Bold">{t("cart.empty")}</p>
        ) : (
          Object.keys(cart).map((key) => {
            return (
              <div
                className="flex justify-between items-center border-b pb-2 "
                key={key}
              >
                <div className="flex items-center w-full">
                  <div className="flex flex-col">
                    <p className=" font-ITC-BK rtl:font-DIN-Bold">
                      {cart[key].title}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {t("currency", {
                        price: cart[key].price + "x" + cart[key].quantity,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="btn btn-secondary btn-sm active-svg"
                    onClick={() => handleDecrement(key)}
                  >
                    <svg height="18" width="18" viewBox="0 0 24 24">
                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM7 13.5V10.5H17V13.5H7Z"></path>
                    </svg>
                  </button>
                  <span className="mx-2">{cart[key].quantity}</span>
                  <button
                    className="btn btn-secondary btn-sm active-svg"
                    onClick={() => handleIncrement(key)}
                  >
                    <svg height="18" width="18" viewBox="0 0 24 24">
                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                    </svg>
                  </button>
                </div>
                <p className=" font-ITC-BK rtl:font-DIN-Bold w-36 text-end text-sm text-gray-500">
                  {t("currency", {
                    price: cart[key].quantity * cart[key].price,
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>
      {count == 0 ? null : (
        <div className="px-3 py-2 pb-24 " suppressHydrationWarning={true}>
          <div>
            {/* Instructions textbox */}
            <div className="flex flex-col gap-2 pt-4 border-b pb-4">
              <label className=" font-ITC-BK rtl:font-DIN-Bold">
                {t("cart.special_info")}
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2  resize-none focus:outline-none focus:ring-2 focus:ring-secondry focus:border-transparent"
                rows={4}
              ></textarea>
            </div>
          </div>
          <div>
            {/* Subtotal, delivery, total */}
            <div className="flex justify-between items-center  pt-4">
              <p className=" font-ITC-BK rtl:font-DIN-Bold">
                {t("cart.subtotal")}{" "}
                <span className="text-xs">{t("cart.vat")}</span>
              </p>
              <p className=" font-ITC-BK rtl:font-DIN-Bold">
                {t("currency", { price: Number(sum.toFixed(2)) })}
              </p>
            </div>
            <div className="flex justify-between items-center pb-2">
              <p className=" font-ITC-BK rtl:font-DIN-Bold">
                {t("cart.delivery_charges")}
              </p>
              <p className=" font-ITC-BK rtl:font-DIN-Bold">
                {charges == 0 ? t("free") : t("currency", { price: charges })}
              </p>
            </div>
            <div className="flex justify-between items-center pt-3">
              <p className=" font-ITC-BK rtl:font-DIN-Bold">
                {t("cart.total")}{" "}
                <span className="text-xs">{t("cart.vat")}</span>
              </p>
              <p className=" font-ITC-BK rtl:font-DIN-Bold">
                {t("currency", { price: Number(total.toFixed(2)) })}{" "}
              </p>
            </div>
          </div>
        </div>
      )}
      {isOverMinimum && (
        <div className="items-start p-2 px-3 text-xs  text-start font-ITC-BK rtl:font-DIN-Bold">
          <p>
            {t("minimum")} {t("currency", { price: minimum })}
          </p>
        </div>
      )}
      {count == 0 ? null : (
        <div
          className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0  shadow-custom-up"
          suppressHydrationWarning={true}
        >
          <Button
            color={"bg-secondry"}
            className="uppercase w-full bg-secondry text-white font-ITC-BK rtl:font-DIN-Bold focus: focus:ring-secondry focus:border-transparent "
            onClick={handleCart}
          >
            {t("cart.checkout")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CartBody;
