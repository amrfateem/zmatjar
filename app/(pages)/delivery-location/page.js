"use client";
import { Button, Modal } from "flowbite-react";
import { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userLocationState } from "../../atoms";
import * as turf from "@turf/turf";

import dynamic from "next/dynamic";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";

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

  const [shareMessage, setShareMessage] = useState("");
  const [geoState, setGeoState] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          grantLocation();
          setconfirmLocation(false);
          alert("granted");
        } else if (result.state === "prompt") {
          setGeoState("prompt");
          setconfirmLocation(true);
          setShareMessage(
            "Please share your location to get the delivery location."
          );
          alert("prompt");
        } else if (result.state === "denied") {
          setGeoState("denied");
          setconfirmLocation(true);
          setShareMessage(
            "Turn on your location settings to allow us to detect your location"
          );
          alert("denied");
        }
        console.log(result.state);
      });
    }
  }, [trigger]);

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
          setLocalPosition(null);
          setconfirmError(true);
        }
      );
    }
  };

  const defaultPosition = {
    lat: 25.2048,
    lng: 55.2708,
  };

  const setDefaultPosition = () => {
    setconfirmLocation(false);
    setconfirmError(false);
    setUserLocation(defaultPosition);
    setLocalPosition(defaultPosition);
  };

  useEffect(() => {
    setUserLocation(defaultPosition);
    setLocalPosition(defaultPosition);
  }, []);
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

  const currentLocation = [
    userLocation.lng.toFixed(6),
    userLocation.lat.toFixed(6),
  ];

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
          <Map />
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
          <h2 className="px-6 py-2 w-full text-base font-semibold font-ITC-BK">
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
            onClick={() => setconfirmLocation(false)}
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
          <p className="text-start font-ITC-BK">{shareMessage}</p>
          {confirmError && (
            <p className="text-start text-red-500 font-ITC-BK">
              Location permission is blocked. Please allow it manually from your
              browser settings.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {geoState === "prompt" && (
            <>
              <Button
                color={"bg-secondry"}
                className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
                onClick={() => grantLocation()}
              >
                Get Permission
              </Button>
              <Button
                color={"bg-secondry"}
                className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
                onClick={() => setDefaultPosition()}
              >
                Deny
              </Button>
            </>
          )}
          {geoState === "denied" && (
            <>
              <Button
                color={"bg-secondry"}
                className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
                onClick={() => setDefaultPosition()}
              >
                Share manually
              </Button>
              <Button
                color={"bg-secondry"}
                className="uppercase w-full bg-secondry text-white font-ITC-BK focus: focus:ring-secondry focus:border-transparent "
                onClick={() => setTrigger((prev) => prev + 1)}
              >
                Turned on
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
