import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const agent =
      process.env.NODE_ENV === "development"
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined;

    const response = await axios.get(
      `https://leather.ct.ws/wp-json/wc/v3/products/${id}`,
      {
        auth: {
          username: process.env.consumer_key!,
          password: process.env.consumer_secret!,
        },
        httpsAgent: agent,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
