"use client";
import { modalDataState, selectedItemState } from "@/app/[locale]/atoms";
import { Modal } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilState } from "recoil";

function Item({ params }) {
  const router  = useRouter();
  const [modalData, setModalData] = useRecoilState(modalDataState);


  return (
    <div>
      <Modal
        theme={{
          content: {
            inner:
              "relative rounded-none bg-white shadow dark:bg-gray-700 flex flex-col max-w-[460px] max-h-[90vh] m-auto",
          },
        }}
        onClose={() => router.back()}
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
          {modalData?.itemOutOfStock ? (
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
  );
}

export default Item;
