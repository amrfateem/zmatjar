"use client";
import { Button, Modal } from "flowbite-react";
import { useRecoilState } from "recoil";
import { cartState, countState, sumState } from "../../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

function Cart() {
  const router = useRouter();
  const [cart, setCart] = useRecoilState(cartState);
  const [count, setCount] = useRecoilState(countState);
  const [sum, setSum] = useRecoilState(sumState);

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

  const handleOpenModal = () => {
    setModal({ isOpen: false });
    setModalLocation({ isOpen: true });
  };

  return (
    <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px] h-screen">
      <div className="header flex justify-end p-0 items-center text-center  shadow-custom h-11 border-b-2">
        <h2 className="px-3 py-2 h-full w-full ">YOUR BASKET</h2>
        <Button
          color={process.env.NEXT_PUBLIC_THEME_COLOR}
          className="btn btn-secondary rounded-none btn bg-secondry-0 h-11"
          onClick={() => router.push("/")}
        >
          <FontAwesomeIcon icon={faX} fill="white" color="white" />
        </Button>
      </div>

      <div className="space-y-6 px-3 py-2  pt-4">
        {count == 0 ? (
          <p className=" font-ITC-BK">Your basket is empty</p>
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
                    <p className="text-xs text-gray-400">
                      {cart[key].quantity} x {cart[key].price} AED
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDecrement(key)}
                  >
                    <svg
                      fill={process.env.NEXT_PUBLIC_THEME_COLOR}
                      height="18"
                      width="18"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM7 13.5V10.5H17V13.5H7Z"></path>
                    </svg>
                  </button>
                  <span className="mx-2">{cart[key].quantity}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleIncrement(key)}
                  >
                    <svg
                      fill={process.env.NEXT_PUBLIC_THEME_COLOR}
                      height="18"
                      width="18"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                    </svg>
                  </button>
                </div>
                <p className=" font-ITC-BK w-36 text-end">
                  {cart[key].quantity * cart[key].price} AED
                </p>
              </div>
            );
          })
        )}
      </div>
      {count == 0 ? null : (
        <div className="px-3 py-2 ">
          <div>
            {/* Instructions textbox */}
            <div className="flex flex-col gap-2 pt-4 border-b pb-4">
              <label className=" font-ITC-BK">Special Instructions</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2  resize-none focus:outline-none focus:ring-2 focus:ring-secondry-0 focus:border-transparent"
                rows={4}
              ></textarea>
            </div>
          </div>
          <div>
            {/* Subtotal, delivery, total */}
            <div className="flex justify-between items-center pb-2 pt-4">
              <p className=" font-ITC-BK">
                Subtotal <span className="text-xs">(Inclusive of VAT)</span>
              </p>
              <p className=" font-ITC-BK">{sum} AED</p>
            </div>
            <div className="flex justify-between items-center pb-2">
              <p className=" font-ITC-BK">Delivery charges</p>
              <p className=" font-ITC-BK">Free</p>
            </div>
            <div className="flex justify-between items-center pt-3">
              <p className=" font-ITC-BK">Total</p>
              <p className=" font-ITC-BK">{sum} AED</p>
            </div>
          </div>
        </div>
      )}
      {count == 0 ? null : (
        <div className="button-checkout w-full max-w-[460px] p-4 fixed bottom-0">
          <Button
            color={process.env.NEXT_PUBLIC_THEME_COLOR}
            className="uppercase w-full bg-secondry-0 text-white font-ITC-BK focus: focus:ring-secondry-0 focus:border-transparent "
            onClick={() => router.push("/delivery-location")}
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
}

export default Cart;
