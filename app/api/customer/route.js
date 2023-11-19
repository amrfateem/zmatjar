import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  let url = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/customer`;

  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        data: {
          type: "node--customer",
          attributes: {
            title: data.name,
            field_country: data.country,
            field_email: data.email,
            field_telephone: data.phone,
          },
        },
      }),
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Basic YXBpOmFwaQ==`,
      },
    });

    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ messsage: error });
  }
}
