"use client";
import { Button, Modal } from "flowbite-react";
import { useRecoilState } from "recoil";
import {
  cartState,
  countState,
  modalState,
  modalStateLocation,
  sumState,
} from "../atoms";

function Cart() {
  const [cart, setCart] = useRecoilState(cartState);
  const [count, setCount] = useRecoilState(countState);
  const [sum, setSum] = useRecoilState(sumState);
  const [modal, setModal] = useRecoilState(modalState);

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
    <div>
      <Modal
        className=""
        show={modal.isOpen}
        position={"center"}
        onClose={() => setModal({ isOpen: false })}
      >
        <Modal.Header>YOUR BASKET</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {count == 0 ? (
              <p className="text-sm font-ITC-BK">Your basket is empty</p>
            ) : (
              Object.keys(cart).map((key) => {
                return (
                  <div
                    className="flex justify-between items-center border-b"
                    key={key}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex flex-col">
                        <p className="text-sm font-ITC-BK">{cart[key].title}</p>
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
                          fill={"#b11f23"}
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
                          fill={"#b11f23"}
                          height="18"
                          width="18"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm font-ITC-BK w-36 text-end">
                      {cart[key].quantity * cart[key].price} AED
                    </p>
                  </div>
                );
              })
            )}
          </div>
          {count == 0 ? null : (
            <>
              <div>
                {/* Instructions textbox */}
                <div className="flex flex-col gap-2 mt-6 border-b pb-4">
                  <label className="text-sm font-ITC-BK">
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondry-0 focus:border-transparent"
                    rows={4}
                  ></textarea>
                </div>
              </div>
              <div>
                {/* Subtotal, delivery, total */}
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm font-ITC-BK">
                    Subtotal <span className="text-xs">(Inclusive of VAT)</span>
                  </p>
                  <p className="text-sm font-ITC-BK">{sum} AED</p>
                </div>
                <div className="flex justify-between items-center ">
                  <p className="text-sm font-ITC-BK">Delivery charges</p>
                  <p className="text-sm font-ITC-BK">Free</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm font-ITC-BK">Total</p>
                  <p className="text-sm font-ITC-BK">{sum} AED</p>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {count == 0 ? null : (
            <Button
              color="gray"
              className="uppercase w-full bg-secondry-0 text-white font-ITC-BK focus: focus:ring-secondry-0 focus:border-transparent"
              onClick={handleOpenModal}
            >
              Checkout
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cart;