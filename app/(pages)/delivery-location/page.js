"use client";
import { Button, Modal, Tooltip } from "flowbite-react";
import { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userLocationState } from "../../atoms";
import * as turf from "@turf/turf";

import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Map = dynamic(() => import("../../map"), {
  ssr: false,
});

function DeliveryLocation() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [localPosition, setLocalPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmLocation, setconfirmLocation] = useState(false);
  const [confirmError, setconfirmError] = useState(false);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          // Geolocation granted
          grantLocation();
          setconfirmLocation(false);
        } else if (result.state === "prompt" || result.state === "denied") {
          // Check the actual geolocation status
          navigator.geolocation.getCurrentPosition(
            function (position) {
              setconfirmLocation(true);
              setDefaultPosition();
            },
            function (error) {
              // Geolocation denied or error
              setconfirmLocation(true);
              setDefaultPosition();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        }
      });
    }
  }, [trigger]);

  const [storeLocation, setStoreLocation] = useState("0,0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/page?&fields[node--page]=field_default_location&jsonapi_include=1`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStoreLocation(data.data[0].field_default_location)
        console.log(storeLocation);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const grantLocation = () => {
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalPosition({ lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setconfirmLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setconfirmLocation(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const [latitude, longitude] = storeLocation.split(",");
  const defaultPosition = { lat: latitude, lng: longitude };

  const setDefaultPosition = () => {
    setconfirmLocation(false);
    setconfirmError(false);
    setUserLocation(defaultPosition);
    setLocalPosition(defaultPosition);
    console.log(defaultPosition);
  };

  useEffect(() => {
    setUserLocation(defaultPosition);
    setLocalPosition(defaultPosition);
    setDefaultPosition();
  }, [storeLocation]);
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

  const currentLocation = [userLocation.lng, userLocation.lat];

  const isWithinPolygon = turf.booleanPointInPolygon(
    turf.point(currentLocation),
    turf.polygon([polygonCoords])
  );

  const handleConfirmLocation = () => {
    console.log(isWithinPolygon);
    if (isWithinPolygon) {
      router.push("/place-order");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px] h-[100dvh] flex flex-col">
      <div className="header flex justify-between items-center h-11 text-center shadow-custom border-b-2">
        <h2 className="py-2  w-full text-base font-semibold text font-ITC-BK">
          CHOOSE THE DELIVERY LOCATION
        </h2>
        <Button
          color={"bg-secondry"}
          theme={{
            size: "text-sm p-3",
          }}
          className="btn btn-secondary rounded-none btn h-11 p-3 bg-[#F5F5F5]"
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
      {localPosition && (
        <Suspense fallback={<div>Loading...</div>}>
          <Map grant={grantLocation} />
          <div className="icon-place absolute bottom-[12%] right-4 z-50 focus:z-50">
            <Tooltip
              id="toolrip"
              content="Pin my location"
              placement="left"
              trigger="hover"
              className="visible opacity-100 text-[10px] text-center tooltip-style"
              style="light"
            >
              <Button
                color={"bg-secondry"}
                className="uppercase bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent focus:z-50"
                onClick={() => grantLocation()}
              >
                <FontAwesomeIcon
                  icon={faLocationArrow}
                  style={{ color: "#ffffff" }}
                  size="lg"
                />
              </Button>
            </Tooltip>
          </div>
        </Suspense>
      )}
      {!localPosition && (
        <p>
          {/* Unable to get your location. Please enable location services and try
          again. */}
        </p>
      )}
      <div className="button-checkout w-full max-w-[458px] p-4 h-auto flex flex-col justify-end bg-white fixed bottom-0  shadow-custom-up z-500">
        <Button
          color={"bg-secondry"}
          className="uppercase w-full  text-white font-ITC-BK bg-secondry "
          onClick={handleConfirmLocation}
        >
          Confirm Location
        </Button>
      </div>

      <Modal
        show={showModal}
        closable={false}
        position={"center"}
        popup={true}
        className="z-50 m-auto"
        onClose={() => setShowModal(false)}
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
          <h2 className="px-6 py-2 w-full text-base font-bold font-ITC-bold ">
            We're not there yet
          </h2>
          <Button
            theme={{
              size: "text-sm p-3",
            }}
            color={"bg-secondry"}
            className="btn btn-secondary self-end rounded-none btn bg-[#F5F5F5] h-11 p-3 focus:ring-2 focus:ring-secondry focus:border-transparent"
            onClick={() => setShowModal(false)}
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
          <p className="text-start">
            The delivery location is still outside of our delivery area.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"bg-secondry"}
            className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
            onClick={() => setShowModal(false)}
          >
            Change Location
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={confirmLocation}
        closable={false}
        position={"center"}
        popup={true}
        className="z-50 m-auto"
        onClose={() => setconfirmLocation(false)}
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
          <h2 className="px-6 py-2 w-full text-base font-bold font-ITC-bold ">
            Share delivery location
          </h2>
          <Button
            theme={{
              size: "text-sm p-3",
            }}
            color={"bg-secondry"}
            className="btn btn-secondary self-end rounded-none btn bg-[#F5F5F5] h-11 p-3 focus:ring-2 focus:ring-secondry focus:border-transparent"
            onClick={() => setconfirmLocation(false)}
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
          <p className="text-start font-ITC-BK">
            To detect your location as a delivery location, kindly turn on your
            location settings.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"bg-secondry"}
            className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
            onClick={() => setconfirmLocation(false)}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
