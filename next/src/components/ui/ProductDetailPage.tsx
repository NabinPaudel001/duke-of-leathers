"use client";

import { useCart } from "@/app/context/CartContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: string;
  images: { src: string; alt: string }[];
  description: string;
  categories: { id: number; name: string }[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // Fetch product details
        const response = await axios.get<Product>(`/api/product/${id}`);
        const productData = response.data;
        setProduct(productData);

        // Fetch similar products
        if (productData.categories?.length) {
          const categoryId = productData.categories[0].id;

          const similarResponse = await axios.get<Product[]>(
            `/api/similar-products?category=${categoryId}&exclude=${id}`
          );

          setSimilarProducts(similarResponse.data);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading product...</p>;

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-semibold">{error}</p>
    );

  if (!product)
    return (
      <p className="text-center py-10 text-gray-600">Product not found.</p>
    );

  return (
    <section className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-red-700 font-medium hover:underline"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-red-700"
          >
            🏠 Home
          </button>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-md p-6 md:p-10">
          {/* Product Image */}
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src={product.images[0]?.src || "/placeholder.png"}
              alt={product.images[0]?.alt || product.name}
              className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            <p className="text-red-700 font-bold text-2xl mb-4">
              ${product.price}
            </p>

            <div
              className="text-gray-700 leading-relaxed mb-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* 🛒 Add to Cart Button */}
            <button
              onClick={() => addToCart(Number(id), 1)}
              className="bg-red-700 text-white px-8 py-3 rounded-2xl hover:bg-red-800 transition w-fit"
            >
              🛒 Add to Cart
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.name}
                    </h3>

                    <p className="text-red-700 font-bold text-lg mt-auto">
                      ${item.price}
                    </p>
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
