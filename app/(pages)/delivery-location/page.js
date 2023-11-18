"use client";
import { Button } from "flowbite-react";
import { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userLocationState } from "../../atoms";

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
  const [draggedPosition, setDraggedPosition] = useState(null);

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

  return (
    <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px] h-">
      <div className="header flex justify-between items-center h-11 text-center shadow-custom border-b-2">
        <h2 className="px-3 py-2  w-full">CHOOSE THE DELIVERY LOCATION</h2>
        <Button
          color={process.env.NEXT_PUBLIC_THEME_COLOR}
          className="btn btn-secondary rounded-none btn bg-secondry-0 h-11"
          onClick={() => router.push("/")}
        >
          <FontAwesomeIcon icon={faX} fill="white" color="white" />
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
          color={process.env.NEXT_PUBLIC_THEME_COLOR}
          className="uppercase w-full bg-secondry-0 text-white font-ITC-BK focus: focus:ring-secondry-0 focus:border-transparent "
          onClick={() => router.push("/place-order")}
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
}

export default DeliveryLocation;
