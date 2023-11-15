"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { userLocationState } from "./atoms";

const Map = () => {
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

  const eventHandlers = {
    dragend: (e) => {
      const marker = e.target;
      const position = marker.getLatLng();
      setDraggedPosition(position);
      setUserLocation(position);
    },
  };

  return (
    <MapContainer
      center={{
        lat: userLocation.lat || localPosition?.lat || 0,
        lng: userLocation.lng || localPosition?.lng || 0,
      }}
      className="space-y-6"
      scrollWheelZoom={false}
      attributionControl={false}
      zoom={12}
      style={{ width: "100%", height: "84dvh" }}
    >
      <Marker
        draggable={true}
        position={{
            lat: userLocation.lat || localPosition?.lat || 0,
            lng: userLocation.lng || localPosition?.lng || 0,
          }}
        eventHandlers={eventHandlers}
      >
        <Popup>Your Location</Popup>
      </Marker>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      ></TileLayer>
    </MapContainer>
  );
};

export default Map;
