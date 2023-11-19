import React from "react";
import { drupal } from "./drupal";

async function placeOrder({ props }) {
  console.log(props);

    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        body: JSON.stringify({
          data: {
            type: "node--customer",
            attributes: {
              title: props.name,
              field_country: props.country,
              field_email: props.email,
              field_telephone: props.phone,
            },
          },
        }),
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Basic ${btoa("api:api")}`,
        },
      });
      if (!response.ok) {
        throw new Error("An error occurred while creating the post");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }

//   const customer = await drupal.createResource("node--customer", {
//     data: {
//       type: "node--customer",
//       attributes: {
//         title: props.name,
//         field_country: props.country,
//         field_email: props.email,
//         field_telephone: props.phone,
//       },
//     },
//   });

  //   const order = await drupal.createResource("node--order", {
  //     data: {
  //       attributes: {
  //         type: "order",
  //         title: props.name,
  //         field_name: props.name,
  //         field_phone: props.phone,
  //         field_country: props.country,
  //         field_address: props.address,
  //         field_email: props.email,
  //         field_payment_method: props.payment,
  //         field_delivery_time: props.time,
  //         field_order: props.order,
  //         field_subtotal: props.subtotal,
  //         field_delivery_charges: props.charges,
  //         field_total: props.total,
  //         field_location: props.location,
  //       },
  //     },
  //   });
  return (
    <div>
      <p>Order placed successfully</p>
    </div>
  );
}

export default placeOrder;
