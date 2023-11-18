"use client";
import Image from "next/image";
import {  useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cartState,
  countState,
  modalDataState,
  searchState,
  sumState,
} from "../atoms";
import { useRouter } from "next/navigation";
import { Button, Modal } from "flowbite-react";

function MostSelling({ mostSelling }) {
  const [cart, setCart] = useRecoilState(cartState);
  const [count, setCount] = useRecoilState(countState);
  const [sum, setSum] = useRecoilState(sumState);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useRecoilState(modalDataState);

  const search = useRecoilValue(searchState);

  const router = useRouter();

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
          name: item.name,
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
    // Set modalData with the item data
    setModalData(item);

    const itemElement = document.getElementById(`item-${item.id}`);
    // Check if the element exists before scrolling
    if (itemElement) {
      // Scroll to the top of the item
      itemElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

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
    search.length == 0 && (
      <div className="Most Selling bg-[#F5F5F5] ">
        <h2 className="leading-6 text-xl font-extrabold mb-1 px-4 pb-2 pt-4 font-ITC-BK float-left">
          Most Selling
        </h2>
        <div className="flex shrink-0 bg-black-100 overflow-auto w-full py-4 px-2 gap-2 scrollbar-hide">
          {mostSelling.map((item, index) => (
            <div
              id={`item-${item.id}`}
              className={`product-item-selling w-[220px] shrink-0 bg-white rounded-lg flex flex-col ${
                isItemInCart(item.id) && "border-secondry border"
              } `}
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
                  {item.inStock && (
                    <button
                      className="btn btn-secondary btn-sm p-1 px-3 w-30"
                      onClick={() => handleQuickView(item)}
                    >
                      Order Now
                    </button>
                  )}
                </div>
              </div>
              <div className=" flex flex-col justify-between w-full h-full">
                <h3 className="title mt-0 mb-2 pt-1 px-2  text-start text-base leading-6 font-ITC-BK float-left">
                  {item.name}
                </h3>
                <p className=" px-2 line-clamp-2 text-faded-0 text-start mb-2 ">
                  {item.description}
                </p>
                <div className="price px-2 float-left text-left pb-3 text-secondry">
                  <span>AED </span>
                  <span>{item.price}</span>
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
            <Modal.Body className="">
              <div className="">
                <p className="text-base leading-relaxe ">
                  {modalData?.description}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer className="text-center items-center justify-center">
              {modalData?.inStock ? (
                isItemInCart(modalData?.id) ? (
                  <div className="flex justify-between items-center gap-1 w-20">
                    <button
                      className="text-secondry font-ITC-BK text-sm px-1 py-2 active-svg"
                      onClick={() => handleDecrement(modalData?.id)}
                    >
                      <svg height="18" width="18" viewBox="0 0 24 24">
                        <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM7 13.5V10.5H17V13.5H7Z"></path>
                      </svg>
                    </button>
                    <span className="text-secondry font-ITC-BK text-sm">
                      {cart[modalData?.id].quantity}
                    </span>
                    <button
                      className="text-secondry font-ITC-BK text-sm px-1 py-2 active-svg"
                      onClick={() => handleIncrement(modalData?.id)}
                    >
                      <svg height="18" width="18" viewBox="0 0 24 24">
                        <path d="M12 2C17.5228 2 22 6.47725 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47725 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20ZM13.5 7V10.4999H17V13.5H13.5V17H10.5V13.5H7V10.4999H10.5V7H13.5Z"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary bg-secondry rounded shadow-sm text-white btn-sm p-1 px-3 w-30"
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
    )
  );
}

export default MostSelling;
