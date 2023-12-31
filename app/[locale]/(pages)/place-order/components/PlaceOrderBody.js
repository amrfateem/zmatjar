"use client";
import { bypassGeoState, cartState, chargesState, countState, manualAddressState, minimumOrderState, specialInstructionsState, storeLangState, sumState, telegramChatIdState, userLocationState, } from "../../../atoms";
import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useRecoilState, useRecoilValue } from "recoil";
import * as turf from "@turf/turf";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { addHours, addMilliseconds, getHours, getMinutes } from "date-fns";
import isValidPhoneNumber from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";



function PlaceOrderBody({ time, locale }) {
  const t = useTranslations();
  // Handling User error
  const router = useRouter();
  const [errorModal, setErrorModal] = useState(false);
  const [modalErrormsg, setModalErrormsg] = useState("");
  const [warning1, setWarning1] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [warning3, setWarning3] = useState(false);
  const [warning4, setWarning4] = useState(false);
  const minimumOrder = useRecoilValue(minimumOrderState);
  const cartError = t("place_order.order_problem_body_cart");
  const subTotalError = t("place_order.order_problem_body_subtotal");
  const [phoneError, setPhoneError] = useState(false);
  const [manualAddress, setManualAddress] = useRecoilState(manualAddressState);
  const bypassGeo = useRecoilValue(bypassGeoState);

  // States from this page
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [closingTime, setClosingTime] = useState(false);
  const [minTime, setMinTime] = useState("11:00");
  const [maxTime, setMaxTime] = useState("23:00");


  const serverTime = Date(time);
  const currentTime = new Date()
  const serverTimeCal = new Date(currentTime).getTime()
  let offset = new Date(currentTime).getTimezoneOffset();
  let offsetCal = new Date(currentTime).getTimezoneOffset() * 60000;

  let utc = addMilliseconds(serverTimeCal, offsetCal)

  const currentDubaiTime = addHours(new Date(utc), 4);


  const [deliveryTime, setDeliveryTime] = useState(
    addHours(new Date(utc), 1)
  );

  // console.log(getHours(currentDubaiTime), getMinutes(currentDubaiTime));

  let dubaiTime =
    String(getHours(currentDubaiTime) + 1).padStart(2, "0") + ":" + String(getMinutes(currentDubaiTime)).padStart(2, "0");
  const [selectedDate, setSelectedDate] = useState("");
  const [today, setToday] = useState(false);

  useEffect(() => {
    if (dubaiTime > minTime && dubaiTime < maxTime) {
      setMinTime(String(dubaiTime));
    }

    const checkTime = () => {
      if (dubaiTime >= maxTime || dubaiTime < minTime) {
        setShowTimePicker(true);
        setClosingTime(true);
        setWarning2(true);
      }
    };


    const hours = (getHours(currentDubaiTime) + 1).toString().padStart(2, "0");
    const minutes = getMinutes(currentDubaiTime).toString().padStart(2, "0");

    let ampm = hours >= 12 ? "PM" : "AM";
    let hoursFormatted = hours % 12 || 12;

    const now = new Date()

    // const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");


    setSelectedDate({ hours: Number(hoursFormatted), minutes: minutes, day: day, month: month, ampm: ampm, });
    setToday(true);

    checkTime(); // Call the function when the component mounts
  }, []);


  // Gets the correct time format and sends it back
  const handleTimeChange = (e) => {
    const [minhours, minminutes] = minTime.split(":").map(String);
    const currentDate = new Date();
    const OrderTime = new Date(
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
      }-${currentDate.getDate()}T${e.target.value}`
    );
    const minTimeNow = new Date(
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
      }-${currentDate.getDate()}T${minhours}:${minminutes}`
    );

    const selectedTime = e.target.value;
    const scheduledDateTime = OrderTime;

    const currentHour = String(currentDate.getHours()).padStart(2, "0");
    const currentMinute = String(currentDate.getMinutes()).padStart(2, "0");

    let currentTime = currentHour + ":" + currentMinute;

    let ampm = OrderTime.getHours() >= 12 ? "PM" : "AM";
    let hoursFormatted = OrderTime.getHours() % 12 || 12;

    if (selectedTime < minTime) {


      setWarning4(false);
      if (selectedTime > "00:00" && currentTime > "11:00") {
        setWarning1(true);
        setWarning2(false);

      } else {
        setWarning2(true);
        setWarning1(false);

      }

      setSelectedTime(selectedTime);
      if (e.target.checkValidity()) {
        // setWarning3(true);
        setWarning4(false);
        setWarning2(false);

        const year = scheduledDateTime.getUTCFullYear();
        const month = String(scheduledDateTime.getUTCMonth() + 1).padStart(2, "0");
        const day = String(scheduledDateTime.getUTCDate()).padStart(2, "0");
        const hours = String(scheduledDateTime.getUTCHours() + 1).padStart(2, "0");
        const minutes = String(scheduledDateTime.getUTCMinutes()).padStart(2, "0");
        const formattedDateTime = `${year}-${month}-${day}T${hours + ":" + minutes}:00`;

        setSelectedDate({ hours: Number(hoursFormatted), minutes: minutes, day: day, month: month, ampm: ampm, });
        setToday(true);

        setDeliveryTime(formattedDateTime);
      } else {
        setWarning3(false);
      }
    } else if (selectedTime >= minTime && selectedTime <= maxTime) {


      if (currentTime > maxTime) {
        setWarning1(true);
        setWarning2(false);
        setWarning3(false); setWarning4(false);


        setSelectedTime(selectedTime);

      } else if (selectedTime < currentTime) {
        setWarning1(true);
        setWarning2(false);
        setWarning3(false);
        setWarning4(false);

        setSelectedTime(selectedTime);
      }
      else {
        setSelectedTime(selectedTime);
        setWarning3(true);
        setWarning4(false);
        setWarning2(false);

        if (e.target.checkValidity()) {
          setWarning1(false);

        } else {
          setWarning1(true);

        }
        const year = scheduledDateTime.getUTCFullYear();
        const month = String(scheduledDateTime.getUTCMonth() + 1).padStart(2, "0");
        const day = String(scheduledDateTime.getUTCDate()).padStart(2, "0");
        const hours = String(scheduledDateTime.getUTCHours() + 1).padStart(2, "0");
        const minutes = String(scheduledDateTime.getUTCMinutes()).padStart(2, "0");
        const formattedDateTime = `${year}-${month}-${day}T${hours + ":" + minutes}:00`;
        setSelectedDate({ hours: Number(hoursFormatted), minutes: minutes, day: day, month: month, ampm: ampm, });
        setToday(true);
        setDeliveryTime(formattedDateTime);


      }



    } else if (currentTime < maxTime && selectedTime > maxTime) {
      setSelectedTime(selectedTime);
      setWarning4(true);
      setWarning3(false);
      setWarning1(false);
      setWarning2(false);



    } else if (selectedTime > maxTime && selectedTime < Date("24:00") && currentTime < maxTime) {


      setSelectedTime(selectedTime);
      setWarning4(false);
      setWarning2(false);
      setWarning3(true);
      setWarning1(false);

      const year = scheduledDateTime.getUTCFullYear();
      const month = String(scheduledDateTime.getUTCMonth() + 1).padStart(2, "0");
      const day = String(scheduledDateTime.getUTCDate() + 1).padStart(2, "0");
      const hours = String(scheduledDateTime.getUTCHours() + 1).padStart(2, "0");
      const minutes = String(scheduledDateTime.getUTCMinutes()).padStart(2, "0");
      const formattedDateTime = `${year}-${month}-${day}T${hours + ":" + minutes}:00`;

      setSelectedDate({ hours: Number(hoursFormatted), minutes: minutes, day: day, month: month, ampm: ampm, });
      setToday(false);
      setDeliveryTime(formattedDateTime);
    } else if (selectedTime > maxTime && selectedTime < Date("24:00") && currentTime > maxTime) {
      setSelectedTime(selectedTime);


      setWarning2(true);
      setWarning1(false);
      setWarning3(false);
      setWarning4(false);
    }

    // if (differenceInMinutes( OrderTime, minTimeNow ) > 1 && selectedTime > minTime ) {
    //   // If order is in late time during hours
    //   // setWarning1(true);
    //   setWarning2(false);
    //   setWarning3(false);
    //   
    //   setSelectedTime(selectedTime);
    //   const year = scheduledDateTime.getUTCFullYear();
    //   const month = String(scheduledDateTime.getUTCMonth() + 1).padStart( 2, "0" );
    //   const day = String(scheduledDateTime.getUTCDate()).padStart(2, "0");
    //   const hours = String(scheduledDateTime.getUTCHours()).padStart(2, "0");
    //   const minutes = String(scheduledDateTime.getUTCMinutes()).padStart( 2, "0" );
    //   const formattedDateTime = `${year}-${month}-${day}T${ hours + ":" + minutes }:00`;
    //   setDeliveryTime(formattedDateTime);

    // }
    // else if  (selectedTime < minTime && selectedTime < maxTime) {
    //   // setWarning2(true);
    //   setSelectedTime(selectedTime);

    //   setWarning3(true);
    //   

    //   const year = scheduledDateTime.getUTCFullYear();
    //   const month = String(scheduledDateTime.getUTCMonth() + 1).padStart( 2, "0" );
    //   const day = String(scheduledDateTime.getUTCDate()).padStart(2, "0");
    //   const hours = String(scheduledDateTime.getUTCHours()).padStart(2, "0");
    //   const minutes = String(scheduledDateTime.getUTCMinutes()).padStart( 2, "0" );
    //   const formattedDateTime = `${year}-${month}-${day}T${ hours + ":" + minutes }:00`;
    //   setDeliveryTime(formattedDateTime);
    // }
    // else if (selectedTime > maxTime && selectedTime < Date("00:00")) {
    //   setWarning1(false);
    //   setWarning2(true);
    //   setWarning3(true);
    //   setWarning4(true);

    //   setSelectedTime(selectedTime);
    //   

    //   const year = scheduledDateTime.getUTCFullYear();
    //   const month = String(scheduledDateTime.getUTCMonth() + 1).padStart( 2, "0" );
    //   const day = String(scheduledDateTime.getUTCDate()+1).padStart(2, "0");
    //   const hours = String(scheduledDateTime.getUTCHours()).padStart(2, "0");
    //   const minutes = String(scheduledDateTime.getUTCMinutes()).padStart( 2, "0" );
    //   const formattedDateTime = `${year}-${month}-${day}T${ hours + ":" + minutes }:00`;
    //   setDeliveryTime(formattedDateTime);
    // }
    // else {
    //   
    //   setWarning1(false);
    //   setWarning2(false);
    //   // setWarning3(true);
    //   setSelectedTime(selectedTime);
    //   const year = scheduledDateTime.getUTCFullYear();
    //   const month = String(scheduledDateTime.getUTCMonth() + 1).padStart( 2, "0" );
    //   const day = String(scheduledDateTime.getUTCDate()).padStart(2, "0");
    //   const hours = String(scheduledDateTime.getUTCHours()).padStart(2, "0");
    //   const minutes = String(scheduledDateTime.getUTCMinutes()).padStart( 2, "0" );
    //   const formattedDateTime = `${year}-${month}-${day}T${ hours + ":" + minutes }:00`;
    //   setDeliveryTime(formattedDateTime);
    // }
  };

  // Gets the current time and sends it back
  const getCurrentTime = () => {
    let hours;
    if (getHours(currentDubaiTime) >= 23) {
      hours = (getHours(currentDubaiTime)).toString().padStart(2, "0");

    } else {
      hours = (getHours(currentDubaiTime) + 1).toString().padStart(2, "0");


    }
    const minutes = getMinutes(currentDubaiTime).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  // Terms modal
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
  const [sending, setSending] = useState(false);

  const [sum, setSum] = useRecoilState(sumState);
  const [count, setCount] = useRecoilState(countState);

  // Total calculated
  const total = parseInt(subtotal) + parseInt(charges);

  // Shows the time picker
  const handleCheckboxChange = () => {
    setShowTimePicker(!showTimePicker);
    setWarning3(true);
  };

  // Sends the order through
  const handlePlaceOrder = async (e) => {
    setSending(true);
    e.preventDefault();

    // console.log(deliveryTime);

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
      coordinates: bypassGeo ? "" : `${location.lat}, ${location.lng}`,
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

    const currentLocation = [location.lng, location.lat];
    const isWithinPolygon = turf.booleanPointInPolygon(
      turf.point(currentLocation),
      turf.polygon([polygonCoords])
    );

    if (Object.keys(order).length == 0) {
      setErrorModal(true);
      setModalErrormsg(cartError);
      setSending(false);
    } else if (subtotal.toFixed(2) < minimumOrder) {
      setErrorModal(true);
      setModalErrormsg(subTotalError);
      setSending(false);
    } else if (!bypassGeo && !isWithinPolygon) {
      setErrorModal(true);
      setModalErrormsg("We are sorry, we don't deliver to your location");
      setSending(false);
    } else if (!isValidPhoneNumber(phone).isValid()) {
      setPhoneError(true);
      setSending(false);
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
        router.push(`/${locale}/thank-you`, undefined, { shallow: true });
      } catch (error) {
        setOrder([]);
        setSubtotal(0);
        setSum(0);
        setCount(0);
        console.error("Error:", error);
        router.push(`/${locale}/thank-you`, undefined, { shallow: true });
      }
    }
  };
  return (
    <div>
      <form onSubmit={(e) => handlePlaceOrder(e)}>
        <div className="space-y-6 px-3 py-2 pb-20">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK rtl:font-DIN-Bold">
              {t("place_order.name")} <span className="text-red-600">*</span>
            </label>
            <input
              required
              type="text"
              name="name"
              className="border-x border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK rtl:font-DIN-Bold">
              {t("place_order.phone")} <span className="text-red-600">*</span>
            </label>
            <IntlTelInput
              containerClassName="intl-tel-input"
              inputClassName="form-control"
              name="phone"
              defaultCountry="ae"
              separateDialCode={true}
              telInputProps={{
                required: true,

                className:
                  "border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry direction-fix",
              }}
              onPhoneNumberChange={(status, value, countryData, number, id) => {
                setPhone(number);
                setCountry(countryData.iso2);
                setCountryCode(countryData.iso2);
              }}
            />
            {phoneError && (
              <p className="text-red-600 text-xs">
                {t("place_order.phone_error")}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK rtl:font-DIN-Bold">
              {t("place_order.address")} <span className="text-red-600">*</span>
            </label>

            <input
              required
              name="address"
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK rtl:font-DIN-Bold">
              {" "}
              {t("place_order.email")}
            </label>
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
                className="form-checkbox border border-gray-300 rounded-md me-2 px-2 py-2 text-secondry focus:ring-secondry outline-none focus:border-secondry"
                onChange={handleCheckboxChange}
                checked={showTimePicker}
                disabled={closingTime}
              />
              <label className="text-sm font-ITC-BK rtl:font-DIN-Bold pb-2">
                {t("place_order.schedule")}
              </label>
            </div>

            {showTimePicker && (
              <>
                <input
                  type="time"
                  min={minTime}
                  max={maxTime}
                  defaultValue={getCurrentTime()}
                  value={selectedTime === "" ? getCurrentTime() : selectedTime}
                  onInput={handleTimeChange}
                  {...(showTimePicker && { required: true })}
                  className={`border rounded-md px-3 py-2 focus:ring-secondry outline-none focus:border-secondry w-full time-fix-input
                  ${warning1 || warning2 ? "border-red-600" : "border-gray-300"
                    }`}
                />
                {warning1 && (
                  <p
                    className={`text-xs font-ITC-BK rtl:font-DIN-Bold text-red-600`}
                  >
                    {t("place_order.schedule_warning_1")}
                  </p>
                )}
                {warning2 && (
                  <p
                    className={`text-xs font-ITC-BK rtl:font-DIN-Bold text-red-600`}
                  >
                    {t("place_order.schedule_warning_2")}
                  </p>
                )}
                {warning4 && (
                  <p
                    className={`text-xs font-ITC-BK rtl:font-DIN-Bold text-red-600`}
                  >
                    {t("place_order.schedule_warning_4")}
                  </p>
                )}
                {warning3 && (
                  <p
                    className={`text-xs font-ITC-BK rtl:font-DIN-Bold  ${warning1 || warning2 ? "text-red-600" : "text-black"
                      } `}
                  >
                    {t("place_order.schedule_warning_3", {
                      day: today
                        ? t("place_order.today")
                        : t("place_order.tomorrow"),
                      date: selectedDate.day + "/" + selectedDate.month,
                      time:
                        selectedDate.hours +
                        ":" +
                        selectedDate.minutes +
                        " " +
                        selectedDate.ampm,
                    })}
                  </p>
                )}

                <p
                  className={`text-xs font-ITC-BK rtl:font-DIN-Bold ${!warning2 ? "text-red-600" : "text-black"
                    }`}
                ></p>
              </>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK rtl:font-DIN-Bold">
              {t("place_order.payment_method")}
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
              <label
                htmlFor="cash"
                className="ms-2 text-base font-ITC-BK rtl:font-DIN-Bold"
              >
                {t("place_order.method_cash")}
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
              <label
                htmlFor="card"
                className="ms-2 text-base font-ITC-BK rtl:font-DIN-Bold"
              >
                {t("place_order.method_card")}
              </label>
            </div>
          </div>

          {/* Acknowledge checkbox */}
          <div className="flex items-center space-y-1">
            <input
              type="checkbox"
              name="acknowledge"
              id="acknowledge"
              required
              className="form-checkbox border border-gray-300 rounded-md me-2 px-2 py-2 text-secondry focus:ring-secondry outline-none focus:border-secondry"
            />
            <label
              htmlFor="acknowledge"
              className="text-sm font-ITC-BK rtl:font-DIN-Bold m-0"
            >
              {t("place_order.terms_message")}{" "}
              <a
                className="text-secondry underline"
                onClick={() => setOpenModalTerms(true)}
              >
                {t("place_order.terms")}
              </a>{" "}
              {t("place_order.terms_tail")}{" "}
            </label>
          </div>
        </div>

        <div className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0 shadow-custom-up ">
          <Button
            disabled={sending}
            type="submit"
            className="uppercase w-full bg-secondry text-white font-ITC-BK rtl:font-DIN-Bold focus: focus:ring-secondry focus:border-transparent"
          >
            {sending
              ? t("place_order.confirming_order")
              : t("place_order.confirm_order")}
          </Button>
        </div>
      </form>
      <Modal
        show={openModalTerms}
        onClose={() => setOpenModalTerms(false)}
        dismissible
        className="w-full p-0 font-ITC-BK rtl:font-DIN-Bold"
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
          <h2 className="px-6 py-2 w-full text-base font-bold font-ITC-bold rtl:font-DIN-Bold ">
            {t("place_order.terms_modal_head")}
          </h2>
          <Button
            theme={{
              size: "text-sm p-3",
            }}
            color={"bg-secondry"}
            className="btn btn-secondary self-end rounded-none btn bg-[#F5F5F5] h-11 p-3 focus:ring-2 focus:ring-secondry focus:border-transparent"
            onClick={() => setOpenModalTerms(false)}
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
        <Modal.Body>{t("place_order.terms_modal_body")}</Modal.Body>
      </Modal>

      <Modal
        show={errorModal}
        dismissible
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
          <h2 className="px-6 py-2 w-full text-base font-semibold rtl:font-extrabold font-ITC-BK rtl:font-DIN-Bold">
            {t("place_order.order_problem_head")}
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
            className="uppercase w-full bg-secondry text-white font-ITC-BK rtl:font-DIN-Bold focus: focus:ring-secondry focus:border-transparent "
            onClick={() => setErrorModal(false)}
          >
            {t("place_order.go_back")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PlaceOrderBody;
