"use client";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartState,
  colStyleState,
  countState,
  sumState,
  searchState,
  modalDataState,
} from "../atoms";
import { Modal } from "flowbite-react";

function MainItems({ data }) {
  const colStyle = useRecoilValue(colStyleState);
  const [cart, setCart] = useRecoilState(cartState);
  const [count, setCount] = useRecoilState(countState);
  const [sum, setSum] = useRecoilState(sumState);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useRecoilState(modalDataState);

  const [searchTerm, setSearchTerm] = useRecoilState(searchState);

  const isItemInCart = (itemId) => {
    return cart[itemId] !== undefined;
  };

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

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const itemId = item.id; // Assuming there's an 'id' property in your item
      const updatedCart = {
        ...prevCart,
        [itemId]: {
          title: item.name,
          price: item.price,
          quantity: prevCart[itemId] ? prevCart[itemId].quantity + 1 : 1,
        },
      };
      // You can also perform any other logic here, like updating count or sum atoms
      return updatedCart;
    });

    setSum(
      (prevSum) => Number(prevSum.toFixed(2)) + Number(item.price.toFixed(2))
    );
    setCount((prevCount) => prevCount + 1);
  };

  const handleQuickView = (item) => {
    // Set modalData with the item data
    setModalData(item);

    const itemElement = document.getElementById(`item-${item.id}`);
    itemElement.scrollIntoView({ behavior: "smooth", block: "start" });

    const newUrl = `${window.location.pathname}?id=${item.id}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData(null);
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  return (
    <div>
      <div className="bg-[#F5F5F5]">
        {Object.entries(data)
          .filter(([category, itemsToRender]) =>
            itemsToRender.some((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map(([category, itemsToRender], index) => (
            <div key={index} id={`cat${index}`}>
              <h2 className="leading-6 text-xl font-extrabold mb-1 px-4 pb-2 pt-4 font-ITC-BK float-left border-b-2 border-b-secondry">
                {category}
              </h2>
              <div
                className={`flex flex-wrap shrink-0 bg-black-100 w-full py-4 px-1 gap-1 justify-start`}
              >
                {itemsToRender
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => a.price - b.price)
                  .map((item, index) => (
                    <div
                      className={`mx-2 bg-white mb-4 rounded-lg ${
                        colStyle === "grid" ? "w-[44%]" : "w-full"
                      }`}
                      id={`item-${item.id}`}
                      key={index}
                    >
                      <div
                        className={`product-item-selling h-full w-full shrink-0 bg-white rounded-lg border flex ${
                          colStyle === "grid"
                            ? "flex-col"
                            : "flex-row-reverse gap-1"
                        } ${isItemInCart(item.id) && " border-secondry "} ${
                          item.outOfStock && " border-gray-500 cursor-not-allowed pointer-events-auto opacity-50 "
                        }`}
                      >
                        <div className="product-item_content relative">
                          <Image
                            width={180}
                            height={180}
                            sizes="180px"
                            src={item.image}
                            alt={item.name}
                            onClick={() =>
                              item.outOfStock == false && handleQuickView(item)
                            }
                            className={` w-full pb-0 images-fix
                            ${
                              colStyle === "grid"
                                ? "rounded-t-lg"
                                : "rounded-r-lg"
                            }`}
                          ></Image>
                          <div
                            className={`absolute rounded-full bg-white px-1 border mx-2 cursor-pointer ${
                              colStyle === "grid"
                                ? " bottom-2 right-1 "
                                : " -bottom-5 right-1 mb-2"
                            }`}
                          >
                            {item.outOfStock == false ? (
                              isItemInCart(item.id) ? (
                                <div className="flex justify-between items-center gap-1 w-20">
                                  <button
                                    className="text-secondry font-ITC-BK text-sm  py-1 active-svg"
                                    onClick={() => handleDecrement(item.id)}
                                  >
                                    <svg
                                      height="24"
                                      width="24"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM7 13.5V10.5H17V13.5H7Z"></path>
                                    </svg>
                                  </button>
                                  <span className="font-ITC-BK text-sm text-secondry">
                                    {cart[item.id].quantity}
                                  </span>
                                  <button
                                    className=" font-ITC-BK text-sm  py-1 text-secondry  active-svg"
                                    onClick={() => handleIncrement(item.id)}
                                  >
                                    <svg
                                      height="24"
                                      width="24"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn btn-secondary btn-sm p-1 px-3 w-20"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add +
                                </button>
                              )
                            ) : (
                              <button className="btn btn-secondary text-xs btn-sm p-1 w-full">
                                Out of stock
                              </button>
                            )}
                          </div>
                        </div>
                        <div
                          className={`product-details h-full w-full flex flex-col p-3 text-center ${
                            colStyle === "grid"
                              ? "justify-between"
                              : "justify-between"
                          }`}
                        >
                          <h3 className="title mt-0 mb-2 line-clamp-2 text-start text-base leading-5 font-ITC-BK float-left font-bold" >
                            {item.name}
                          </h3>
                          <p className=" line-clamp-1 mb-2 text-faded-0 text-start text-sm leading-5 font-ITC-BK">
                            {item.description}
                          </p>
                          <div className="price float-left text-left text-secondry leading-none">
                            <span>AED </span>
                            <span>{item.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
      <div>
        <Modal
          theme={{
            content: {
              inner:
                "relative rounded-none bg-white shadow dark:bg-gray-700 flex flex-col max-w-[460px] max-h-[90vh] m-auto",
            },
          }}
          show={openModal}
          onClose={handleCloseModal}
          closable={true}
          position={"bottom-center"}
          className=" p-0 rounded-none "
          style={{
            height: "auto",
            bottom: "0",
            padding: "0",
            borderRadius: "0",
            margin: "0 auto",
          }}
        >
          <Modal.Header
            style={{
              borderRadius: "0",
              flexDirection: "column-reverse",
              alignItems: "center",
            }}
          >
            <div className="flex flex-col text-start items-center w-full h-full">
              <Image
                width={250}
                height={250}
                src={modalData?.image}
                alt={modalData?.name}
                className={`rounded-lg mb-3 w-full h-full`}
              ></Image>
              {modalData?.name}
              <p className="text-base leading-relaxed text-secondry">
                AED {modalData?.price}
              </p>
            </div>
          </Modal.Header>
          {modalData?.description && (
            <Modal.Body>
              <div className="">
                <p className="text-base leading-relaxe">
                  {modalData?.description}
                </p>
              </div>
            </Modal.Body>
          )}

          <Modal.Footer className="text-center items-center justify-center">
            {modalData?.outOfStock == false ? (
              isItemInCart(modalData?.id) ? (
                <div className="flex justify-between items-center gap-1 w-32">
                  <button
                    className=" font-ITC-BK text-sm px-1 py-2 text-secondry active-svg"
                    onClick={() => handleDecrement(modalData?.id)}
                  >
                    <svg height="24" width="24" viewBox="0 0 24 24">
                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM7 13.5V10.5H17V13.5H7Z"></path>
                    </svg>
                  </button>
                  <span className=" font-ITC-BK text-sm text-secondry">
                    {cart[modalData?.id].quantity}
                  </span>
                  <button
                    className=" font-ITC-BK text-sm px-1 py-2 text-secondry active-svg"
                    onClick={() => handleIncrement(modalData?.id)}
                  >
                    <svg height="24" width="24" viewBox="0 0 24 24">
                      <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-secondary rounded shadow-sm text-white btn-sm p-1 px-3 w-30 bg-secondry"
                  onClick={() => handleAddToCart(modalData)}
                >
                  Add to cart +
                </button>
              )
            ) : (
              <button
                className="btn btn-secondary bg-faded-0 rounded shadow-sm text-white btn-sm p-1 px-3 w-30"
                disabled
              >
                Out of Stock
              </button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default MainItems;
