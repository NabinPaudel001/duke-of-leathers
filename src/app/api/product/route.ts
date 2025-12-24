export async function GET() {
  try {
    const url = "https://wp.dukeofleathers.no/wp-json/wc/v3/products";

    const authString =
      Buffer.from(
        `${process.env.consumer_key}:${process.env.consumer_secret}`
      ).toString("base64");

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      // important for vercel
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json(
        { error: "WooCommerce API error", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
