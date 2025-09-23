"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ProductPage() {
  const products = [
    {
      id: 1,
      name: "Duffle Bag Style",
      price: "$249",
      images: [
        "/images/duffle.jpg",
        "/images/duffle-1.jpg",
        "/images/duffle-2.jpg",
        "/images/duffle-4.jpg",
      ],
      description:
        "Handcrafted with premium buff leather, this duffle blends elegance with durability. A spacious interior lined with resilient skin features full-width pockets on both sides. Reinforced buckles and straps ensure safety, while rolled handles and a detachable shoulder strap guarantee comfort and versatility.",
      details: [
        { label: "Material", value: "100% Buff Leather" },
        { label: "Dimensions", value: "40 × 25 × 18 cm" },
        { label: "Color", value: "Charcoal Black" },
        { label: "Warranty", value: "2 Years" },
      ],
    },
    {
      id: 2,
      name: "Hikers & Bikers Backpack",
      price: "$199",
      images: ["/images/hikers.jpg", "/images/hikers.jpg"],
      description:
        "This superior hand crafted bag shows the attention to withstand the rigid weather and making them long-lasting investment worthy. This style gives a versatile look and promising durability.",
      details: [
        { label: "Material", value: "Fine Grain Leather" },
        { label: "Dimensions", value: "32 × 22 × 12 cm" },
        { label: "Color", value: "Deep Brown" },
        { label: "Warranty", value: "1 Year" },
      ],
    },
    {
      id: 3,
      name: "Harriet Unisex Backpack",
      price: "$179",
      images: ["/images/unisex.jpg", "/images/unisex.jpg"],
      description:
        "The leather rolled backpack for both men and women with compartments in vintage style.",
      details: [
        { label: "Material", value: "Smooth Leather" },
        { label: "Dimensions", value: "35 × 28 × 14 cm" },
        { label: "Color", value: "Ivory White" },
        { label: "Warranty", value: "1 Year" },
      ],
    },
  ];

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (productIndex: number, imageIndex: number) => {
    setCurrentProductIndex(productIndex);
    setCurrentImageIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const prevImage = () => {
    const images = products[currentProductIndex].images;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    const images = products[currentProductIndex].images;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, currentProductIndex]);

  return (
    <div className="relative min-h-screen">
      {/* Full-page background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/s.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* ABOUT / HERO SECTION */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 pt-10 pb-24 px-6 z-10">
        <h1 className="text-5xl font-extrabold tracking-widest mb-6 text-amber-100">
          DUKE OF LEATHER
        </h1>

        <div className="flex flex-col items-center mb-5">
          <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">D</span>
          </div>
          <div className="w-px h-10 bg-white mt-2 "></div>
        </div>
 <div className="w-full border-t border-white mb-10"></div>
        <h2 className="text-3xl font-bold tracking-wide mb-6 text-white">
          Crafted with Heritage, Designed for Life
        </h2>

        <p className="uppercase text-sm tracking-[0.1em] text-gray-200 max-w-3xl leading-relaxed">
          At <strong>Duke</strong>, we take pride in offering premium leather
          bags that embody the essence of Scandinavian design and the
          craftsmanship of Nepal. Each piece is meticulously handcrafted by
          skilled artisans, whose dedication and expertise ensure the highest
          quality leather. Sourced from ethically sustainable materials, our
          leather is durable yet soft, developing a unique patina that tells
          your story over time. <br />
          <br />
          Inspired by the stunning wilderness of Norway, our designs marry
          functionality with timeless elegance, perfect for the modern adventurer.
          With <strong>Duke</strong>, you embrace not just a bag but a legacy; a
          bridge between the robust craftsmanship of the Himalayas and the
          minimalist aesthetics of Scandinavian living. Choose your adventure
          with us and carry a piece of tradition wherever you go.
        </p>
         <div className="w-full border-t border-white mt-5 mb-10"></div>
      </section>

      {/* PRODUCT SECTIONS */}
      <div className="relative z-10 py-24 bg-white">
        {products.map((product, index) => {
          const imageOrder = index % 2 === 0 ? "lg:order-1" : "lg:order-2";
          const textOrder = index % 2 === 0 ? "lg:order-2" : "lg:order-1";

          return (
            <div
              key={product.id}
              className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24"
            >
              {/* Product Image */}
              <div className={`flex flex-col items-center ${imageOrder}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 160 }}
                  className="relative w-full max-w-[480px] aspect-square bg-white rounded-3xl shadow-xl border border-gray-200 p-6 cursor-pointer flex items-center justify-center"
                  onClick={() => openLightbox(index, 0)}
                >
                  <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-lg border border-gray-100 ${textOrder}`}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-2xl font-semibold text-red-700">
                  {product.price}
                </p>
                <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                  {product.details.map((d, i) => (
                    <div key={i}>
                      <p className="font-bold text-gray-900">{d.label}</p>
                      <p>{d.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* CONTACT FORM */}
        <section className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-lg border border-gray-200 mb-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Have a question or want to work with us? Send us a message below.
          </p>
          <form className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <textarea
              placeholder="Your Message"
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              className="w-full bg-red-700 text-white font-semibold py-4 rounded-xl hover:bg-red-800 transition"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {/* Left side */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider mb-4 text-amber-100">
              DUKE OF LEATHER
            </h1>
            <p className="text-sm mt-2">
              &copy; {new Date().getFullYear()} Duke of Leather. All rights
              reserved.
            </p>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="text-sm">
              <p>Email: info@dukeofleather.com</p>
              <p>Phone: +977-9800000000</p>
              <p>Address: Kathmandu, Nepal</p>
            </div>
            <div className="flex gap-4 mt-2 self-center">
              <a href="#" className="hover:text-amber-400 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {isLightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl font-semibold"
          >
            ✕
          </button>
          <button
            onClick={prevImage}
            className="absolute left-6 text-white text-4xl font-bold"
          >
            ‹
          </button>
          <div className="relative w-[90%] max-w-5xl h-[80vh] flex items-center justify-center">
            <Image
              src={products[currentProductIndex].images[currentImageIndex]}
              alt={products[currentProductIndex].name}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={nextImage}
            className="absolute right-6 text-white text-4xl font-bold"
          >
            ›
          </button>
        </motion.div>
      )}
    </div>
  );
}
