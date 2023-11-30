"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { userLocationState } from "./atoms";
import L from "leaflet";

const Map = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [localPosition, setLocalPosition] = useState(null);
  const [draggedPosition, setDraggedPosition] = useState(null);

  const RecenterAutomatically = ({ userLocation }) => {
    const map = useMap();
    if (userLocation) {
      map.setView(userLocation, 12);
    }
  };

  const eventHandlers = {
    dragend: (e) => {
      const marker = e.target;
      const position = marker.getLatLng();
      const map = marker._map;
      map.panTo(position);
      setDraggedPosition(position);
      setUserLocation(position);
    },
  };

  return (
    <MapContainer
      id="deliveryMap"
      center={{
        lat: userLocation.lat,
        lng: userLocation.lng,
      }}
      className="space-y-6 w-full h-full"
      scrollWheelZoom={false}
      attributionControl={false}
      zoom={12}
    >
      <Marker
        draggable={true}
        icon={L.divIcon({
          className: "active-svg",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="40"
          height="40"  version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 324.2 367.8">
          <style type="text/css">
            .st1{fill:#EBA721;}
            .st2{fill:none;}
          </style>
          <g>
            <g>
              <path class="st0" d="M323.7,162.1c0-88.5-71.2-160.4-159.4-161.6C74.9-0.7,2,69.9,0.5,159.3c-1,60.6,31.4,113.8,80,142.3    c29.5,17.3,56.5,38.8,79.9,63.8l1.7,1.9l1.7-1.9c23.7-25.2,51.1-46.6,80.8-64.3C292,272.9,323.7,221.2,323.7,162.1"/>
              <path class="st1" d="M293.1,162.1c0,72.3-58.6,130.9-130.9,130.9S31.3,234.4,31.3,162.1S89.8,31.2,162.1,31.2    S293.1,89.8,293.1,162.1"/>
              <line class="st2" x1="187.2" y1="128.8" x2="187.2" y2="134.3"/>
            </g>
          </g>
          </svg>`,
          iconUrl: "/images/marker.png",
          iconSize: [1, 1],
          iconAnchor: [40, 40],
        })}
        position={{
          lat: userLocation.lat,
          lng: userLocation.lng,
        }}
        eventHandlers={eventHandlers}
      >
        <Popup offset={[-20, -30]} autoClose={false}>
          Kindly drag the pin to the delivery location
        </Popup>
      </Marker>
      <RecenterAutomatically userLocation={userLocation} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      ></TileLayer>
    </MapContainer>
  );
};

export default Map;
