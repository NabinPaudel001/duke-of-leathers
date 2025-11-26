import axios from "axios";
import https from "https";

export async function GET() {
  try {
    const response = await axios.get("https://leather.ct.ws/wp-json/wc/v3/products", {
      auth: {
        username: process.env.CONSUMER_KEY!,
        password: process.env.CONSUMER_SECRET!,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // <- allow self-signed cert
      }),
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error fetching products:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
