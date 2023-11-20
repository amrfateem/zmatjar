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

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalPosition({ lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocalPosition(null);
        }
      );
    }
  }, []);

  const polygonCoords = [
    [32.3745008, 31.1412759],
    [30.705398, 31.4648476],
    [29.6618818, 30.9592981],
    [29.1382939, 30.6557458],
    [28.6148382, 30.9351529],
    [27.8346887, 31.1576154],
    [26.7722645, 31.4215454],
    [25.1971019, 31.6362353],
    [25.0758282, 29.2257939],
    [25.0866796, 27.6740781],
    [28.5187161, 27.7027025],
    [33.5731129, 27.7138741],
    [32.5761938, 29.9568854],
    [32.3745008, 31.1412759],
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
    if (isWithinPolygon) {
      router.push("/place-order");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px] h-">
      <div className="header flex justify-between items-center h-11 text-center shadow-custom border-b-2">
        <h2 className="px-3 py-2  w-full text-base font-semibold font-ITC-BK">
          CHOOSE THE DELIVERY LOCATION
        </h2>
        <Button
          color={"bg-secondry"}
          className="btn btn-secondary rounded-none btn h-11 bg-[#F5F5F5]"
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
          Unable to get your location. Please enable location services and try
          again.
        </p>
      )}
      <div className="button-location w-full max-w-[460px] p-4 fixed bottom-0 z-500">
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
          },
        }}
      >
        <Modal.Header className="p-6">
          <div className="flex flex-col text-start items-center w-full h-full">
            <h2 className="text-center font-ITC-BK text-secondry">
              We're not there yet
            </h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className="text-start">
            The delivery location is still outside of our delivery area.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={"bg-secondry"}
            className="uppercase w-full  text-white font-ITC-BK bg-secondry "
            onClick={() => setShowModal(false)}
          >
            Change Location
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeliveryLocation;
