"use client";
import { cartState, chargesState, countState, minimumOrderState, specialInstructionsState, storeLangState, sumState, telegramChatIdState, userLocationState, } from "@/app/atoms";
import { Button, Modal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRecoilState, useRecoilValue } from "recoil";
import * as turf from "@turf/turf";

function PlaceOrder() {
  // Router
  const router = useRouter();

  // Handling User error
  const [errorModal, setErrorModal] = useState(false);
  const [modalErrormsg, setModalErrormsg] = useState("");
  const [warning, setWarning] = useState(false);
  const minimumOrder = useRecoilValue(minimumOrderState);
  const cartError = "Your cart is empty";
  const subTotalError = "Your order subtotal is lower than the minimum order";

  // States from this page
  const [selectedTime, setSelectedTime] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(
    `${new Date().toISOString().split("T")[0]}T${String(
      (new Date().getUTCHours() + 1) % 24
    ).padStart(2, "0")}:${new Date()
      .getMinutes()
      .toString()
      .padStart(2, "0")}:00`
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");

  // States from local storage
  const charges = useRecoilValue(chargesState);
  const location = useRecoilValue(userLocationState);
  const [order, setOrder] = useRecoilState(cartState);
  const [subtotal, setSubtotal] = useRecoilState(sumState);
  const specialInfo = useRecoilValue(specialInstructionsState);
  const telegramChatId = useRecoilValue(telegramChatIdState);
  const storeLanguage = useRecoilValue(storeLangState);

  const [sum, setSum] = useRecoilState(sumState);
  const [count, setCount] = useRecoilState(countState);

  // Total calculated
  const total = parseInt(subtotal) + parseInt(charges);

  // Gets the correct time format and sends it back
  const handleTimeChange = (e) => {
    const currentDate = new Date().toISOString();
    const selectedTime = e.target.value;

    const combinedDateTime = `${currentDate.split("T")[0] }T${selectedTime}:00`;
    const scheduledDateTime = new Date(combinedDateTime);
    if (scheduledDateTime < currentDate) {
      // alert the user and trigger validation error
      setWarning(true);
    } else {
      setWarning(false);
      setSelectedTime(selectedTime);
      const year = scheduledDateTime.getUTCFullYear();
      const month = String(scheduledDateTime.getUTCMonth() + 1).padStart(2, "0");
      const day = String(scheduledDateTime.getUTCDate()).padStart(2, "0");
      const hours = String(scheduledDateTime.getUTCHours()).padStart(2, "0");
      const minutes = String(scheduledDateTime.getUTCMinutes()).padStart( 2, "0" );
      const formattedDateTime = `${year}-${month}-${day}T${hours+":"+minutes}:00`;
      setDeliveryTime(formattedDateTime);
    }
  };

  // Gets the current time and sends it back
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Shows the time picker
  const handleCheckboxChange = () => {
    setShowTimePicker(!showTimePicker);
  };

  // Sends the order through
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
      coordinates: `${location.lat}, ${location.lng}`,
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

    const polygonCoords = [
      [55.14743, 25.1245014],
      [55.0018611, 25.0025914],
      [55.0046077, 24.8955094],
      [55.1309505, 24.7833473],
      [55.3589168, 24.8132671],
      [55.6473079, 24.8780687],
      [55.8999934, 25.1443936],
      [55.9247127, 25.3232768],
      [55.836822, 25.5935836],
      [55.6198421, 25.6282578],
      [55.4715266, 25.5242049],
      [55.3232112, 25.4225424],
      [55.2133479, 25.2711297],
      [55.1501765, 25.196595],
      [55.14743, 25.1245014],
    ];

    const currentLocation = [location.lng.toFixed(6), location.lat.toFixed(6)];

    const isWithinPolygon = turf.booleanPointInPolygon(
      turf.point(currentLocation),
      turf.polygon([polygonCoords])
    );

    console.log(data);

    if (Object.keys(order).length == 0) {
      setErrorModal(true);
      setModalErrormsg(cartError);
      return;
    } else if (subtotal.toFixed(2) < minimumOrder) {
      setErrorModal(true);
      setModalErrormsg(subTotalError);
      return;
    } else if ( !isWithinPolygon ){
      setErrorModal(true);
      setModalErrormsg("We are sorry, we don't deliver to your location");
      return;

    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/place-order`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        setOrder([]);
        setSubtotal(0);
        setSum(0);
        setCount(0);
        router.push("/thank-you");
      } catch (error) {
        setOrder([]);
        setSubtotal(0);
        setSum(0);
        setCount(0);
        console.error("Error:", error);
        router.push("/thank-you");
      }
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
            theme={{
              size: "text-sm p-3",
            }}
            color={"bg-secondry"}
            className="btn btn-secondary rounded-none btn bg-[#F5F5F5] h-11 p-3"
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
          <div className="space-y-6 px-3 py-2 pb-20">
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
                onChange={(phone, country) => {
                  setPhone("+" + phone);
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
                  min="11:00"
                  max="23:00"
                  defaultValue={getCurrentTime()}
                  value={selectedTime === "" ? getCurrentTime() : selectedTime}
                  onInput={handleTimeChange}
                  {...(showTimePicker && { required: true })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry w-full"
                />
              )}
              {warning && (
                <p className="text-red-600 text-xs">
                  Can't enter a past time
                </p>
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
                  className="checked:text-secondry border-gray-300"
                  required
                />
                <label htmlFor="cash" className="ml-2 text-base font-ITC-BK">
                  Cash on Delivery
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  value="card on delivery"
                  className="checked:text-secondry border-gray-300"
                  name="payment"
                  required
                />
                <label htmlFor="card" className="ml-2 text-base font-ITC-BK">
                  Card on Delivery
                </label>
              </div>
            </div>

            {/* Acknowledge checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="acknowledge"
                id="acknowledge"
                required
                className="form-checkbox border border-gray-300 rounded-md px-2 py-2 text-secondry focus:ring-secondry outline-none focus:border-secondry"
              />
              <label htmlFor="acknowledge" className="text-sm font-ITC-BK">
                I acknowledge that I have read and agree to the{" "}
                <a
                  className="text-secondry underline"
                  onClick={() => setOpenModalTerms(true)}
                >
                  Terms and conditions
                </a>
              </label>
            </div>
          </div>

          <div className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0 shadow-custom-up ">
            <Button
              type="submit"
              className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent"
            >
              place order
            </Button>
          </div>
        </form>
      </div>
      <Modal
        show={openModalTerms}
        onClose={() => setOpenModalTerms(false)}
        closable={true}
        className="w-full p-0"
        style={{ height: "auto", margin: "0" }}
      >
        <Modal.Header>Terms and conditions</Modal.Header>
        <Modal.Body>Terms go here</Modal.Body>
      </Modal>

      <Modal
        show={errorModal}
        closable={false}
        position={"center"}
        popup={true}
        className="z-50 m-auto"
        onClose={() => setErrorModal(false)}
        theme={{
          content: {
            base: "relative h-full w-full p-4 h-auto",
            inner:
              "relative rounded-none bg-white shadow dark:bg-gray-700 flex flex-col max-w-[460px] max-h-[90vh] m-auto",
          },
          header: {
            close: {
              base: "ml-auto inline-flex items-center rounded-none bg-transparent p-1.5 text-sm text-brand hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white active-svg",
            },
          },
        }}
      >
        <div className="flex flex-col-reverse text-start items-center w-full h-full  flex-1 overflow-auto pt-0">
          <h2 className="px-6 py-2 w-full text-base font-semibold font-ITC-BK">
            There's a problem in your order
          </h2>
          <Button
            theme={{
              size: "text-sm p-3",
            }}
            color={"bg-secondry"}
            className="btn btn-secondary self-end rounded-none btn bg-[#F5F5F5] h-11 p-3 focus:ring-2 focus:ring-secondry focus:border-transparent"
            onClick={() => setErrorModal(false)}
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
        <Modal.Body>
          <p className="text-start">{modalErrormsg}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"bg-secondry"}
            className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
            onClick={() => setErrorModal(false)}
          >
            Go back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PlaceOrder;
