"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string;
  images: { src: string; alt: string }[];
  description: string;
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null); // Track which product is being added
  const router = useRouter();
  
  const { cart, loading: cartLoading, addToCart } = useCart();
  const items = cart?.items || [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("/api/product");
        setProducts(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const goToProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await addToCart(product.id, 1); // Add 1 quantity by default
      window.alert("🛒 Added to cart!");
    } catch (err) {
      console.error(err);
      window.alert("❌ Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading products...</p>;

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <section className="min-h-screen py-0 bg-gray-50">
        {/* Header */}

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

      <div className="max-w-6xl mx-auto px-4 pt-10">
      

        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={product.images[0]?.src || "/placeholder.png"}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover"
                  onClick={() => goToProduct(product.id)}
                />
              </div>
              <div className="p-6">
                <h2 
                  className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-red-700"
                  onClick={() => goToProduct(product.id)}
                >
                  {product.name}
                </h2>
                <p className="text-red-700 font-bold text-lg mb-3">
                  ${product.price}
                </p>
                <p
                  className="text-gray-700 text-sm line-clamp-3 mb-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                
                {/* Add to Cart Button */}
                <div className="flex gap-2">
                  <button
                    onClick={() => goToProduct(product.id)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    View Details
                  </button>
                  <button
                    disabled={addingToCart === product.id || cartLoading}
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                  >
                    {addingToCart === product.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}