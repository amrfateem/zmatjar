"use client";

import { RecoilRoot, atom } from "recoil";

export default function RecoidContextProvider({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
