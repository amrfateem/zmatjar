"use client";
import {
  cartState,
  chargesState,
  specialInstructionsState,
  storeLangState,
  sumState,
  telegramChatIdState,
  userLocationState,
} from "@/app/atoms";
import placeOrder from "@/app/lib/placeOrder";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRecoilValue } from "recoil";

function PlaceOrder() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const charges = useRecoilValue(chargesState);
  const location = useRecoilValue(userLocationState);
  const order = useRecoilValue(cartState);
  const subtotal = useRecoilValue(sumState);
  const specialInfo = useRecoilValue(specialInstructionsState);
  const telegramChatId = useRecoilValue(telegramChatIdState);
  const storeLanguage = useRecoilValue(storeLangState);

  const total = parseInt(subtotal) + parseInt(charges);

  const handleTimeChange = (e) => {
    const currentDate = new Date();
    const selectedTime = e.target.value;
    setSelectedTime(selectedTime);
    const combinedDateTime = `${
      currentDate.toISOString().split("T")[0]
    }T${selectedTime}:00`;
    const scheduledDateTime = new Date(combinedDateTime);
    if (scheduledDateTime < currentDate) {
      // If so, set the date to the next day
      scheduledDateTime.setDate(currentDate.getDate() + 1);
    }
    const year = scheduledDateTime.getFullYear();
    const month = String(scheduledDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(scheduledDateTime.getDate()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day}T${selectedTime}:00`;
    setDeliveryTime(formattedDateTime);
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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let data = JSON.stringify({
      name: e.target.name.value,
      phone: phone,
      countryCode: countryCode.toLocaleUpperCase(),
      address: e.target.address.value,
      email: e.target.email.value,
      paymentMethod: e.target.payment.value,
      language: "en",
      communcationLanguage: storeLanguage,
      scheduledDelivery: deliveryTime,
      order: order,
      subtotal: subtotal.toFixed(2),
      charges: charges,
      total: total,
      coordinates: `${location.lng}, ${location.lat}`,
      specialInfo: specialInfo,
      host: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
      telegramChatId: telegramChatId,
    });

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: data,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://staging-menu.digializer.com/place-order",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      // router.push("/thank-you");
    } catch (error) {
      console.error("Error:", error);
      // router.push("/thank-you");
    }
  };

  return (
    <>
      <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-x-[1px] h-screen">
        <div className="header flex justify-between h-11 items-center text-center  shadow-custom border-b-2">
          <h2 className="px-3 py-2 w-full text-base font-semibold font-ITC-BK">
            PLACE ORDER
          </h2>
          <Button
            color={"bg-secondry"}
            className="btn btn-secondary rounded-none btn bg-[#F5F5F5] h-11"
            onClick={() => router.push("/")}
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
        {/* Inputs name, phone, email, address, check box to aknowlege */}
        <form onSubmit={(e) => handlePlaceOrder(e)}>
          <div className="space-y-6 px-3 py-2">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-ITC-BK">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                className="border-x border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-ITC-BK">
                Phone <span className="text-red-600">*</span>
              </label>
              <PhoneInput
                countryCodeEditable={false}
                inputProps={{
                  required: true,
                }}
                country={"ae"}
                onChange={(phone, country, e, data) => {
                  let phoneNum = phone.slice(country.dialCode.length);
                  setPhone(phoneNum);
                  setCountry(country.name);
                  setCountryCode(country.countryCode);
                }}
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
                name="address"
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-ITC-BK">Email</label>
              <input
                name="email"
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex ">
                <input
                  type="checkbox"
                  className="form-checkbox border border-gray-300 rounded-md mr-2 px-2 py-2 text-secondry focus:ring-secondry outline-none focus:border-secondry"
                  onChange={handleCheckboxChange}
                />
                <label className="text-sm font-ITC-BK pb-2">
                  Schedule delivery ?
                </label>
              </div>

              {showTimePicker && (
                <input
                  type="time"
                  min="09:00"
                  max="18:00"
                  defaultValue={getCurrentTime()}
                  value={selectedTime === "" ? getCurrentTime() : selectedTime}
                  onChange={handleTimeChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry w-full"
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
                  value="cash on delivery"
                  name="payment"
                  className="checked:text-secondry"
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
                  value="card on delivery"
                  className="checked:text-secondry"
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
                required
                className="form-checkbox border border-gray-300 rounded-md px-2 py-2 text-secondry focus:ring-secondry outline-none focus:border-secondry"
              />
              <p className="text-xs font-ITC-BK">
                I acknowledge that I have read and agree to the
                <a className="text-secondry" onClick={() => setOpenModal(true)}>
                  Terms and conditions
                </a>
              </p>
            </div>
          </div>

          <div className="button-checkout w-full max-w-[460px] p-4 fixed bottom-0">
            <button className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent p-3 rounded-lg ">
              place order
            </button>
          </div>
        </form>
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
