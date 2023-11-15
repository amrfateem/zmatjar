"use client";
import { Button, Modal } from "flowbite-react";
import { Suspense, useEffect, useMemo, useRef } from "react";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import L from "leaflet";
import "leaflet-defaulticon-compatibility";

function DeliveryLocation() {

  const MapContainer = dynamic(
    async () => import("react-leaflet").then((module) => module.MapContainer),
    {
      ssr: false, // Disable server-side rendering for this component
    }
  );
  const TileLayer = dynamic(
    async () => import("react-leaflet").then((module) => module.TileLayer),
    {
      ssr: false,
    }
  );
  const Marker = dynamic(
    async () => import("react-leaflet").then((module) => module.Marker),
    {
      ssr: false,
    }
  );
  const Popup = dynamic(
    async () => import("react-leaflet").then((module) => module.Popup),
    {
      ssr: false,
    }
  );

  const handleOpenModal = () => {
    setModal({ isOpen: false });
    setModalOrder({ isOpen: true });
  }




  useEffect(() => {
    if (modal.isOpen) {
      // Try to get user's location when the modal is open
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setUserLocation(null);
        }
      );
    }
  }, [modal.isOpen]);

  const handleConfirmLocation = () => {
    // Handle confirming the location here
  };

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPosition = marker.getLatLng();
          setMarkerPosition({ lat: newPosition.lat, lng: newPosition.lng });
        }
      },
    }),
    []
  );

  return (
    <Modal
      className=""
      show={modal.isOpen}
      position={'center'}
      onClose={() => setModal({ isOpen: false })}
    >
      <Modal.Header>CHOOSE THE DELIVERY LOCATION</Modal.Header>
      <Modal.Body>
        {userLocation ? (
          <Suspense fallback={<div>Loading...</div>}>
            <MapContainer
              center={userLocation}
              scrollWheelZoom={false}
              zoom={12}
              style={{ width: "100%", height: "400px" }}
            >
              <Marker draggable={true} eventHandlers={eventHandlers} position={userLocation}>
                <Popup>Your Location</Popup>
              </Marker>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=""
              />
            </MapContainer>
          </Suspense>
        ) : (
          <p>
            Unable to get your location. Please enable location services and try
            again.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="gray"
          className="uppercase w-full bg-secondry-0 text-white font-ITC-BK" onClick={handleOpenModal}
        >
          Confirm Location
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeliveryLocation;
