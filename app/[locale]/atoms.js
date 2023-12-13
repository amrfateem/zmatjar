"use client";
import { atom } from "recoil";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    if (typeof window === "undefined") {
      // Running on the server side
      return;
    }

    const savedValue = localStorage.getItem(key);

    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      if (typeof window === "undefined") {
        // Running on the server side
        return;
      }

      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
  

export const cartState = atom({
  key: "cartState",
  default: [""],
  effects: [localStorageEffect("cartState")], // Add the local storage effect
});

export const countState = atom({
  key: "countState",
  default: 0,
  effects: [localStorageEffect("countState")],
});

export const sumState = atom({
  key: "sumState",
  default: 0,
  effects: [localStorageEffect("sumState")],
});

export const totalState = atom({
  key: "totalState",
  default: 0,
  effects: [localStorageEffect("totalState")],
});

export const colStyleState = atom({
  key: "colStyleState",
  default: "grid",
  effects: [localStorageEffect("colStyleState")],
});

export const userLocationState = atom({
  key: "userLocationState",
  default: { lat: 0, lng: 0 },
  effects: [localStorageEffect("userLocationState")],
});

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const chargesState = atom({
  key: "chargesState",
  default: 0,
  effects: [localStorageEffect("chargesState")],
});

export const minimumOrderState = atom({
  key: "minimumOrderState",
  default: 0,
  effects: [localStorageEffect("minimumOrderState")],
});

export const specialInstructionsState = atom({
  key: "specialInstructionsState",
  default: "",
});

export const telegramChatIdState = atom({
  key: "telegramChatIdState",
  default: "",
  effects: [localStorageEffect("telegramChatIdState")],
});

export const storeLangState = atom({
  key: "storeLangState",
  default: "",
  effects: [localStorageEffect("storeLangState")],
});

export const manualAddressState = atom({
  key: "manualAddressState",
  default: "",
});

export const bypassGeoState = atom({
  key: "bypassGeoState",
  default: false,
});
