"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { userLocationState } from "./atoms";
import L from "leaflet";
import { useTranslations } from "next-intl";

const Map = ({grant}) => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [draggedPosition, setDraggedPosition] = useState(null);

  const RecenterAutomatically = ({ userLocation }) => {
    const map = useMap();
    if (userLocation) {
      map.setView(userLocation, map.getZoom());
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

  const t = useTranslations();


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
      zoom={14}
    >
      <Marker
        draggable={true}
        icon={L.divIcon({
          className: "active-svg leaflet-marker-icon leaflet-zoom-animated leaflet-interactive",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="45"
          height="51"  version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 324.2 367.8">
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
          iconSize: [45, 51],
          shadowSize: [50, 64],
          iconAnchor: [22, 58],
          shadowAnchor: [13, 72],
        })}
        position={{
          lat: userLocation.lat,
          lng: userLocation.lng,
        }}
        eventHandlers={eventHandlers}
      >
        <Tooltip  direction="top" offset={[0, -60]} opacity={1} permanent>
          <p className="text-[10px] text-center font-ITC-BK rtl:font-DIN-Bold">
          {t("delivery.pin")}
          </p>
        </Tooltip>
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
