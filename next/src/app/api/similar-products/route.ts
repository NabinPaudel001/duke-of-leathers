import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const exclude = searchParams.get("exclude");

  if (!category) {
    return NextResponse.json(
      { message: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const baseURL = "https://wp.dukeofleathers.no/wp-json/wc/v3/products";

    const authString = Buffer.from(
      `${process.env.consumer_key}:${process.env.consumer_secret}`
    ).toString("base64");

    // Fetch products by category
    const categoryRes = await fetch(
      `${baseURL}?category=${category}&per_page=6&status=publish`,
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!categoryRes.ok) {
      const err = await categoryRes.text();
      return NextResponse.json(
        { message: "WooCommerce API Error", details: err },
        { status: categoryRes.status }
      );
    }

    let products = await categoryRes.json();
    products = products.filter(
      (p: any) => String(p.id) !== String(exclude)
    );

    // If no similar products, fetch popular ones
    if (products.length < 1) {
      const fallbackRes = await fetch(
        `${baseURL}?per_page=6&status=publish&orderby=popularity`,
        {
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!fallbackRes.ok) {
        const err = await fallbackRes.text();
        return NextResponse.json(
          { message: "WooCommerce API Error", details: err },
          { status: fallbackRes.status }
        );
      }

      let fallbackProducts = await fallbackRes.json();
      products = fallbackProducts.filter(
        (p: any) => String(p.id) !== String(exclude)
      );
    }

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching similar products:", error);
    return NextResponse.json(
      { message: "Failed to fetch similar products", error: error.message },
      { status: 500 }
    );
  }
}
