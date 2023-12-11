"use client";
import { Button } from "flowbite-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, chargesState, countState, minimumOrderState, specialInstructionsState, sumState, totalState, } from "../../atoms";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

function Cart({params}) {
  const router = useRouter();
  const [cart, setCart] = useRecoilState(cartState);
  const [count, setCount] = useRecoilState(countState);
  const [sum, setSum] = useRecoilState(sumState);

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

  const t = useTranslations();
  unstable_setRequestLocale(params.locale)
  return (
    <div className="text-start m-0 mx-auto max-w-[460px] border-solid border-[#dfe2e7] border-[1px] h-full min-h-screen relative">
      <div className="header flex justify-end p-0 items-center text-center  shadow-custom h-11 border-b-2 w-full bg-white">
        <h2 className="p-3  w-full text-base font-semibold font-ITC-BK h-full">
        {t("cart.head")}
        </h2>
        <Button
          color={"bg-secondry"}
          theme={{
            size: "text-sm p-3",
          }}
          className="btn btn-secondary rounded-none btn h-11 p-3 bg-[#F5F5F5]"
          onClick={() => router.push(`/${params.locale}`)}
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
        </Button>
      </div>

      <div className="space-y-6 px-3 py-2  pt-3">
        {count == 0 ? (
          <p className=" font-ITC-BK">{t("cart.empty")}</p>
        ) : (
          Object.keys(cart).map((key) => {
            return (
              <div
                className="flex justify-between items-center border-b pb-2 "
                key={key}
              >
                <div className="flex items-center w-full">
                  <div className="flex flex-col">
                    <p className=" font-ITC-BK">{cart[key].title}</p>
                    <p className="text-gray-500 text-sm">
                      {t("currency")} {cart[key].quantity} x {cart[key].price}
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
                <p className=" font-ITC-BK w-36 text-end text-sm text-gray-500">
                  {t("currency")} {cart[key].quantity * cart[key].price}
                </p>
              </div>
            );
          })
        )}
      </div>
      {count == 0 ? null : (
        <div className="px-3 py-2 pb-24 ">
          <div>
            {/* Instructions textbox */}
            <div className="flex flex-col gap-2 pt-4 border-b pb-4">
              <label className=" font-ITC-BK">{t("cart.special_info")}</label>
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
              <p className=" font-ITC-BK">
              {t("cart.subtotal")} <span className="text-xs">{t("cart.vat")}</span>
              </p>
              <p className=" font-ITC-BK">{t("currency")} {Number(sum.toFixed(2))}</p>
            </div>
            <div className="flex justify-between items-center pb-2">
              <p className=" font-ITC-BK">{t("cart.delivery_charges")}</p>
              <p className=" font-ITC-BK">
                {charges == 0 ? "Free" : t("currency") +" "+ charges}
              </p>
            </div>
            <div className="flex justify-between items-center pt-3">
              <p className=" font-ITC-BK">
              {t("cart.total")} <span className="text-xs">{t("cart.vat")}</span>
              </p>
              <p className=" font-ITC-BK">{t("currency")} {Number(total.toFixed(2))}</p>
            </div>
          </div>
        </div>
      )}
      {count > 0 && minimum > sum && (
        <div className="items-start p-2 px-3 text-sm  text-start">
          <p>
          {t("minimum")} {minimum}
          </p>
        </div>
      )}
      {count == 0 ? null : (
        <div className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0  shadow-custom-up">
          <Button
            color={"bg-secondry"}
            className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
            onClick={() => {
              minimum > sum ? "" : router.push(`/${params.locale}/delivery-location`);
            }}
          >
            {t("cart.checkout")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Cart;
