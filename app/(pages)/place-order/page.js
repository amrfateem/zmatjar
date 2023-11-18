"use client";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PlaceOrder() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleCheckboxChange = () => {
    setShowTimePicker(!showTimePicker);
  };
  return (
    <>
      <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-x-[1px] h-screen">
        <div className="header flex justify-between h-11 items-center text-center  shadow-custom border-b-2">
          <h2 className="px-3 py-2 w-full">PLACE ORDER</h2>
          <Button
            color={process.env.NEXT_PUBLIC_THEME_COLOR}
            className="btn btn-secondary rounded-none btn bg-secondry-0 h-11"
            onClick={() => router.push("/")}
          >
            <FontAwesomeIcon icon={faX} fill="white" color="white" />
          </Button>
        </div>
        {/* Inputs name, phone, email, address, check box to aknowlege */}
        <div className="space-y-6 px-3 py-2">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">
              Name <span className="text-red-600">*</span>
            </label>{" "}
            <input
              required
              type="text"
              className="border-x border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">
              Phone <span className="text-red-600">*</span>
            </label>{" "}
            <PhoneInput
              inputProps={{
                required: true,
              }}
              country={"ae"}
              enableSearch={true}
              specialLabel=""
              inputStyle={{ width: "100%", height: "42px" }}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">
              Address <span className="text-red-600">*</span>
            </label>

            <input
              required
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">Email</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex ">
              <input
                type="checkbox"
                className="form-checkbox border border-gray-300 rounded-md mr-2 px-2 py-2 text-secondry-0 focus:ring-secondry-0 outline-none focus:border-secondry-0"
                onChange={handleCheckboxChange}
              />
              <label className="text-sm font-ITC-BK pb-2">
                Schedule delivery ?
              </label>
            </div>

            {showTimePicker && (
              <input
                type="time"
                min="09:00" max="18:00"
                defaultValue={getCurrentTime()}
                value={
                  selectedTime === "" ? getCurrentTime() : selectedTime
                }
                onChange={handleTimeChange}
                
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0 w-full"
              />
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">
              Select Payment Method:
            </label>

            <div className="flex items-center">
              <input
                type="radio"
                id="cash"
                value="cash"
                name="payment"
                className="checked:text-secondry-0"
                defaultChecked={true}
              />
              <label htmlFor="cash" className="ml-2">
                Cash on Delivery
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                value="card"
                className="checked:text-secondry-0"
                name="payment"
              />
              <label htmlFor="card" className="ml-2">
                Card on Delivery
              </label>
            </div>
          </div>

          {/* Acknowledge checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox border border-gray-300 rounded-md px-2 py-2 text-secondry-0 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
            <p className="text-xs font-ITC-BK">
              I acknowledge that I have read and agree to the{" "}
              <a className="text-secondry-0" onClick={() => setOpenModal(true)}>
                Terms and conditions
              </a>
            </p>
          </div>
        </div>
        <div className="button-checkout w-full max-w-[460px] p-4 fixed bottom-0">
          <Button
            color={process.env.NEXT_PUBLIC_THEME_COLOR}
            className="uppercase w-full bg-secondry-0 text-white font-ITC-BK focus: focus:ring-secondry-0 focus:border-transparent "
          >
            place order
          </Button>
        </div>
      </div>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        closable={true}
        className="w-full p-0"
        style={{ height: "auto", margin: "0" }}
      >
        <Modal.Header>Terms and conditions</Modal.Header>
        <Modal.Body>Terms go here</Modal.Body>
      </Modal>
    </>
  );
}

export default PlaceOrder;
