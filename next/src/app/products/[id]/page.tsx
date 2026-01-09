"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "@/app/context/CartContext";
// ----------------------------------
// Types
// ----------------------------------
interface Product {
  id: number;
  name: string;
  price: string;
  images: { src: string; alt?: string }[];
  description: string;
  categories: { id: number; name: string }[];
}

// ----------------------------------
// Product Page
// ----------------------------------
export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const { cart, addToCart, loading: cartLoading } = useCart();
  const items = cart?.items || [];

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // ----------------------------------
  // Fetch product + similar products
  // ----------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      console.log("Fetching product with id:", id);
      try {
        const res = await axios.get<Product>(`/api/product/${id}`);
        setProduct(res.data);

        if (res.data.categories?.length > 0) {
          const catId = res.data.categories[0].id;
          const simRes = await axios.get<Product[]>(
            `/api/similar-products?category=${catId}&exclude=${id}`
          );
          setSimilarProducts(simRes.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----------------------------------
  // Total items in cart
  // ----------------------------------
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // ----------------------------------
  // Add to cart handler
  // ----------------------------------
async function handleAddToCart() {
  if (!product) return;

  console.log("Adding to cart:", {
    productId: product.id,
    quantity: quantity,
    requestedQuantity: quantity
  });

  setAdding(true);
  try {
    await addToCart(product.id, quantity); // Use the quantity state instead of hardcoded 1
    window.alert(`🛒 Added ${quantity} item(s) to cart!`);
  } catch (err) {
    console.error(err);
    window.alert("❌ Failed to add to cart");
  } finally {
    setAdding(false);
  }
}
  // ----------------------------------
  // UI States
  // ----------------------------------
  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading product...</p>;

  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  if (!product)
    return <p className="text-center py-10 text-gray-600">Product not found.</p>;

  // ----------------------------------
  // Render
  // ----------------------------------
  return (
    <section className="min-h-screen bg-gray-50">
      
      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 bg-white bg-[url('/images/s.webp')] bg-cover bg-center bg-no-repeat shadow-md py-4 px-6 flex justify-between items-center transition-all duration-300
            ${scrolled ? "max-w-7xl mx-auto" : "w-full"}`}>
      
        <div
          className="text-2xl font-bold cursor-pointer flex items-center justify-center"
          onClick={() => router.push("/")}
        >
          <Image src={"/logo.svg"} alt="Bull logo" width={30} height={30} className="object-contain" />
      
          <Image
            src="/duke-logo.svg"
            alt="Bull logo"
            width={80}
            height={42}
            className="object-contain mt-1"
            priority
          />
        </div>
      
        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
            />
          </svg>
      
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto px-4 pt-20">

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-md p-6 md:p-10">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src={product.images[0]?.src || "/placeholder.png"}
              alt={product.images[0]?.alt || product.name}
              className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-red-700 font-bold text-2xl mb-4">${product.price}</p>

            <div
              className="text-gray-700 leading-relaxed mb-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Quantity Selector */}
            <div className="mb-4 flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value, 10);
                  if (newQty > 0) setQuantity(newQty);
                }}
                placeholder="1"
                title="Quantity"
                aria-label="Quantity"
                className="w-20 border rounded-md px-2 py-1"
              />
            </div>

            <button
              disabled={adding || cartLoading}
              onClick={handleAddToCart}
              className="bg-red-700 text-white px-8 py-3 rounded-2xl hover:bg-red-800 transition w-fit disabled:opacity-50"
            >
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              You may also like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="cursor-pointer bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform"
                >
                  <div className="w-full h-64 overflow-hidden rounded-t-3xl">
                    <img
                      src={item.images[0]?.src || "/placeholder.png"}
                      alt={item.images[0]?.alt || item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 text-center flex flex-col justify-between h-32">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-red-700 font-bold text-lg mt-auto">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}