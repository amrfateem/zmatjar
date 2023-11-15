"use client";
import { Button } from "flowbite-react";
import React, { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userLocationState } from "../../atoms";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import L from "leaflet";
import "leaflet-defaulticon-compatibility";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";

const MapWithNoSSR = React.lazy(() => import("../../map"));

function DeliveryLocation() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [localPosition, setLocalPosition] = useState(null);

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

  // const eventHandlers = {
  //   dragend: (e) => {
  //     const marker = e.target;
  //     const position = marker.getLatLng();
  //     setDraggedPosition(position);
  //     setUserLocation(position);
  //   },
  // };

  return (
    <div className="text-start m-0 mx-auto max-w-[460px] relative border-solid border-[#dfe2e7] border-[1px] h-screen">
      <div className="header flex justify-between items-center h-11 shadow border-b-2">
        <h2 className="px-3 py-2 ">CHOOSE THE DELIVERY LOCATION</h2>
        <Button
          color="#b11f23"
          className="btn btn-secondary rounded-none btn bg-secondry-0 h-11"
          onClick={() => router.push("/")}
        >
          <FontAwesomeIcon icon={faX} fill="white" color="white" />
        </Button>
      </div>
      {localPosition && (
        <Suspense fallback={<div>Loading...</div>}>
          <MapWithNoSSR />
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
          color="#b11f23"
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
