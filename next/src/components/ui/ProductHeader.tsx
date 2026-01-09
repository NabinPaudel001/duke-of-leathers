"use client";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function ProductHeader() {
  const { cart } = useCart();
  const router = useRouter();

  const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center mb-6">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        My Store
      </h1>

      <div
        className="relative cursor-pointer"
        onClick={() => router.push("/cart")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
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
  );
}
