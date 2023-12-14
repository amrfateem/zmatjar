"use client";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const cartState = atom({
  key: "cartState",
  default: [],
  effects_UNSTABLE: [persistAtom], // Add the local storage effect
});

export const countState = atom({
  key: "countState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const sumState = atom({
  key: "sumState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const totalState = atom({
  key: "totalState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const colStyleState = atom({
  key: "colStyleState",
  default: "grid",
  effects_UNSTABLE: [persistAtom],
});

export const userLocationState = atom({
  key: "userLocationState",
  default: { lat: 0, lng: 0 },
  effects_UNSTABLE: [persistAtom],
});

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const chargesState = atom({
  key: "chargesState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const minimumOrderState = atom({
  key: "minimumOrderState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const specialInstructionsState = atom({
  key: "specialInstructionsState",
  default: "",
});

export const telegramChatIdState = atom({
  key: "telegramChatIdState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const storeLangState = atom({
  key: "storeLangState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const manualAddressState = atom({
  key: "manualAddressState",
  default: "",
});

export const bypassGeoState = atom({
  key: "bypassGeoState",
  default: false,
});
