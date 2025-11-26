import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const exclude = searchParams.get("exclude");

  if (!category) {
    return NextResponse.json({ message: "Category ID is required" }, { status: 400 });
  }

  try {
    const agent =
      process.env.NODE_ENV === "development"
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined;

    // 1️⃣ Try fetching from the category first
    let response = await axios.get(
      `https://leather.ct.ws/wp-json/wc/v3/products`,
      {
        params: {
          category: Number(category),
          per_page: 6,
          status: "publish",
        },
        auth: {
          username: process.env.CONSUMER_KEY!,
          password: process.env.CONSUMER_SECRET!,
        },
        httpsAgent: agent,
      }
    );

    let products = response.data.filter((p: any) => String(p.id) !== String(exclude));

    // 2️⃣ Fallback: if no similar products, get popular/random products
    if (products.length < 1) {
      response = await axios.get(
        `https://leather.ct.ws/wp-json/wc/v3/products`,
        {
          params: {
            per_page: 6,
            status: "publish",
            orderby: "popularity",
          },
          auth: {
            username: process.env.CONSUMER_KEY!,
            password: process.env.CONSUMER_SECRET!,
          },
          httpsAgent: agent,
        }
      );

      products = response.data.filter((p: any) => String(p.id) !== String(exclude));
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return NextResponse.json({ message: "Failed to fetch similar products" }, { status: 500 });
  }
}
