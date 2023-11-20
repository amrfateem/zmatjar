"use client";
import { atom, selector } from "recoil";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    if (typeof window === "undefined") {
      return;
    }
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      if (typeof window === "undefined") {
        return;
      }
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const itemsState = atom({
  key: "itemsState",
  default: [],
});

export const categoriesState = atom({
  key: "categoriesState",
  default: [],
});

export const cartState = atom({
  key: "cartState",
  default: [],
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

export const modalState = atom({
  key: "modalState",
  default: {
    isOpen: false,
  },
});

export const modalDataState = atom({
  key: "modalDataState",
  default: null,
});

export const colStyleState = atom({
  key: "colStyleState",
  default: "grid",
  effects: [localStorageEffect("colStyleState")],
});

export const userLocationState = atom({
  key: "userLocationState",
  default: { lng: 55.296249, lat: 25.276987 },
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

export const filteredItemsState = selector({
  key: "filteredItemsState",
  get: ({ get }) => {
    const search = get(searchState);
    const allItems = get(itemsState); // Assume you have itemsState atom defined somewhere
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  },
});
