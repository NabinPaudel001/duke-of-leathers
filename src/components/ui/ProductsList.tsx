"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const router = useRouter();

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

  const goToProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading products...</p>;

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <section className=" min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => goToProduct(product.id)}
              className="cursor-pointer bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={product.images[0]?.src || "/placeholder.png"}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-red-700 font-bold text-lg mb-3">
                  ${product.price}
                </p>
                <p
                  className="text-gray-700 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
