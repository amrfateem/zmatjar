"use client";
import { selectedItemState } from "@/app/atoms";
import React from "react";
import { useRecoilState } from "recoil";

function Item({ params }) {

    const item =  selectedItemState(params.id)



    console.log(item);
  return <div></div>;
}

export default Item;
