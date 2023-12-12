"use client";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartState,
  countState,
  modalDataState,
  searchState,
  sumState,
} from "../atoms";
import { Button, Modal } from "flowbite-react";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function MostSelling({ mostSelling }) {
  const t = useTranslations();
  const [cart, setCart] = useRecoilState(cartState);
  const [count, setCount] = useRecoilState(countState);
  const [sum, setSum] = useRecoilState(sumState);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useRecoilState(modalDataState);

  const search = useRecoilValue(searchState);

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

  const isItemInCart = (itemId) => {
    return cart[itemId] !== undefined;
  };

  const handleQuickView = (item) => {
    console.log(item);
    // Set modalData with the item data
    setModalData(item);

    const itemElement = document.getElementById(`most-selling-${item.id}`);
    // Check if the element exists before scrolling
    if (itemElement) {
      // Scroll to the top of the item
      itemElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const newUrl = `${window.location.pathname}?popular-id=${item.id}`;
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
    search.length == 0 && (
      <div className="Most Selling bg-[#F5F5F5] ">
        <h2 className="leading-6 text-xl font-extrabold mb-1 px-4 pb-2 pt-4 font-ITC-BK rtl:font-DIN-Bold float-left rtl:float-right">
          {t("home.most_selling")}
        </h2>
        <div className="flex shrink-0 bg-black-100 overflow-auto w-full py-4 px-2 gap-2 scrollbar-hide">
          {mostSelling.map((item, index) => (
            <div
              id={`most-selling-${item.id}`}
              className={`product-item-selling w-[220px] shrink-0 bg-white rounded-lg flex flex-col ${
                isItemInCart(item.id) && "border-secondry border"
              } ${item.outOfStock && "border-gray-500"} `}
              key={index}
            >
              <div className="product-item_content relative">
                <Image
                  width={200}
                  height={190}
                  src={item.image}
                  alt={item.name}
                  className={`rounded-t-lg w-full`}
                  onClick={() => {
                    handleQuickView(item);
                  }}
                ></Image>
                <div
                  className={`absolute  rounded-full bg-white  border mx-1 cursor-pointer bottom-2 right-1 `}
                >
                  {item.outOfStock == false && (
                    <button
                      className="btn btn-secondary btn-sm p-1 px-3 w-30 font-ITC-BK rtl:font-DIN-Bold"
                      onClick={() => handleQuickView(item)}
                    >
                      {t("home.order_now")}
                    </button>
                  )}
                </div>
              </div>
              <div className=" flex flex-col justify-between w-full h-full">
                <h3 className="title mt-0 mb-2 pt-1 px-2  text-start text-base leading-6 font-ITC-BK rtl:font-DIN-Bold float-left rtl:float-right font-bold">
                  {item.name}
                </h3>
                <p className=" px-2 line-clamp-2 text-faded-0 text-start mb-2 text-sm leading-6 font-ITC-BK rtl:font-DIN-Bold ">
                  {item.description}
                </p>
                <div className="price px-2 ltr:float-left rtl:float-right text-start pb-3 text-secondry">
                  <span>{t("currency", { price: item.price })} </span>
                </div>
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
            className="w-full p-0"
            style={{
              height: "auto",
              bottom: "0",
              padding: "0",
              borderRadius: "0",
            }}
          >
            <div className="flex flex-col text-start items-center w-full h-full font-ITC-BK rtl:font-DIN-Bold">
              <Button
                theme={{
                  size: "text-sm p-3",
                }}
                color={"bg-secondry"}
                className="btn btn-secondary self-end rounded-none btn bg-[#F5F5F5] h-11 p-3 focus:ring-2 focus:ring-secondry focus:border-transparent"
                onClick={handleCloseModal}
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
              <Image
                width={250}
                height={250}
                src={modalData?.image}
                alt={modalData?.name}
                className={`rounded-lg mb-3 m-5`}
              ></Image>
              {modalData?.name}
              <p className="text-base leading-relaxed text-secondry font-ITC-BK rtl:font-DIN-Bold">
                {t("currency", { price: modalData?.price })}
              </p>
            </div>
            {modalData?.description && (
              <Modal.Body>
                <div className="">
                  <p className="text-base leading-relaxe font-ITC-BK rtl:font-DIN-Bold">
                    {modalData?.description}
                  </p>
                </div>
              </Modal.Body>
            )}
            <Modal.Footer className="text-center items-center justify-center">
              {modalData?.outOfStock == false ? (
                isItemInCart(modalData?.id) ? (
                  <div className="flex justify-between items-center gap-1 w-20">
                    <button
                      className="text-secondry font-ITC-BK rtl:font-DIN-Bold text-sm px-1 py-2 active-svg"
                      onClick={() => handleDecrement(modalData?.id)}
                    >
                      <svg height="18" width="18" viewBox="0 0 24 24">
                        <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM7 13.5V10.5H17V13.5H7Z"></path>
                      </svg>
                    </button>
                    <span className="text-secondry font-ITC-BK rtl:font-DIN-Bold text-sm">
                      {cart[modalData?.id].quantity}
                    </span>
                    <button
                      className="text-secondry font-ITC-BK rtl:font-DIN-Bold text-sm px-1 py-2 active-svg"
                      onClick={() => handleIncrement(modalData?.id)}
                    >
                      <svg height="18" width="18" viewBox="0 0 24 24">
                        <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary bg-secondry rounded shadow-sm text-white btn-sm p-1 px-3 w-30 font-ITC-BK rtl:font-DIN-Bold"
                    onClick={() => handleAddToCart(modalData)}
                  >
                    {t("home.add_to_cart")}
                  </button>
                )
              ) : (
                <button
                  className="btn btn-secondary bg-faded-0 rounded shadow-sm text-white btn-sm p-1 px-3 w-30 font-ITC-BK rtl:font-DIN-Bold"
                  disabled
                >
                  {t("home.out_of_stock")}
                </button>
              )}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )
  );
}

export default MostSelling;
