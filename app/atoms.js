"use client";
import { atom, selector } from "recoil";
import Items from "./data";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    if (typeof window === "undefined") {
      // Check if running on the server side (during SSR)
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
  default: Items,
});


export const selectedItemState =  (id) => selector({
  key: 'selectedItemState',
  get: ({ get }) => {
    const itemList = get(itemsState);
    return itemList.find((item) => item.id === id);
  },
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
  default: null,
  effects: [localStorageEffect("userLocationState")],
});

export const searchState = atom({
  key: "searchState",
  default: "",
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