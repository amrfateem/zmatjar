import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  let url = `https://staging-menu.digializer.com/place-order`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email,
        country: data.country,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ messsage: error });
  }
}
