import React from "react";
import { drupal } from "./drupal";

async function placeOrder({ props }) {

  const storeData = await drupal.getResource(
    "node--page",
    process.env.NEXT_PUBLIC_DRUPAL_PAGE_UUID,
    {
      params: {
        fields: {
          "node--page": "field_primary_color,title,field_logo",
        },
        include: "field_logo",
      },
      withCache: false,
    }
  );


  try {
    const response = await fetch(
      "https://staging-menu.digializer.com/place-order",
      {
        method: "POST",
        body: JSON.stringify({
          name: e.target.name.value,
          phone: phone,
          country: country,
          address: e.target.address.value,
          email: e.target.email.value,
          payment: e.target.payment.value,
          language: "en",
          time: selectedTime,
          order: order,
          subtotal: subtotal.toFixed(2),
          charges: charges,
          total: (subtotal + charges).toFixed(2),
          coordinates: `${location.lng}, ${location.lat}`,
          specialInfo: specialInfo,
          host: window.location.host,
          telegramChatId: "123456789",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return console.log(response);
  } catch (error) {
    return console.log(error);
  }
}

export default placeOrder;
