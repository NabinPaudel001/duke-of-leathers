"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ProductPage() {
  const products = [
    {
      id: 1,
      name: "Mustang Rolled Leather Bag",
      price: "Contact For Price",
      images: [
        "/images/mustang-rolled.jpg",
        // "/images/duffle-1.jpg",
        // "/images/duffle-2.jpg",
        // "/images/duffle-4.jpg",
      ],
      description:
        "With its combination of luxurious and elegance leather, smart details and spacious capacity, this weekender bag is created for travelers who value both style and quality.",
      details: [
        { label: "Material", value: "100% Buff Leather" },
        { label: "Dimensions", value: "40 × 25 × 18 cm" },
        { label: "Color", value: "Brown" },
        { label: "Warranty", value: "2 Years" },
      ],
    },
    {
      id: 2,
      name: "Viking Style Backpack",
      price: "Contact For Price",
      images: ["/images/viking-style.jpg", "/images/hikers.jpg"],
      description:
        "This vintage inspired piece blends with minimal Scandinavian elegance with practical utility and, each pattern reflects the simplicity of Norwegian craftsmanship.",
      details: [
        { label: "Material", value: "Fine Grain Leather" },
        { label: "Dimensions", value: "32 × 22 × 12 cm" },
        { label: "Color", value: "Deep Brown" },
        { label: "Warranty", value: "1 Year" },
      ],
    },
    {
      id: 3,
      name: "Subhya Travel Bag",
      price: "Contact For Price",
      images: ["/images/Subhya-bag.jpg", "/images/unisex.jpg"],
      description:
        "Whether you're heading for a relax weekend getaway or a business trip, the Subhya travel bag is the perfect travel companion. With spacious capacity and a vivid exterior, it gives you both functionality and elegance when you're on the move.",
      details: [
        { label: "Material", value: "Smooth Leather" },
        { label: "Dimensions", value: "35 × 28 × 14 cm" },
        { label: "Color", value: "Ivory White" },
        { label: "Warranty", value: "1 Year" },
      ],
    },
    {
      id: 4,
      name: "Chelsea Women's Classic Bag",
      price: "Contact For Price",
      images: ["/images/chelsa.jpg", "/images/chelsa-1.jpg", "/images/chelsa-2.jpg", "/images/chelsa-3.jpg"],
      description:
        "This classic women's leather bag design reflect the combination of timeless style and subtle details.",
      details: [
        { label: "Material", value: "Smooth Leather" },
        { label: "Dimensions", value: "35 × 28 × 14 cm" },
        { label: "Color", value: "Ivory White" },
        { label: "Warranty", value: "1 Year" },
      ],
    },
    {
      id: 5,
      name: "Men's Classic Office Bag",
      price: "Contact For Price",
      images: ["/images/mens-classic.jpg", "/images/mens-classic-1.jpg", "/images/mens-classic-2.jpg", "/images/mens-classic-3.jpg", "/images/mens-classic-4.jpg"],
      description:
        "The vintage leather offers the quality and spacious capacity, it reflects the highland elegance and simplicity of Nordic style.",
      details: [
        { label: "Material", value: "Smooth Leather" },
        { label: "Dimensions", value: "35 × 28 × 14 cm" },
        { label: "Color", value: "Ivory White" },
        { label: "Warranty", value: "1 Year" },
      ],
    },
     {
      id: 6,
      name: "Henry Leather Vintage",
      price: "Contact For Price",
      images: ["/images/vintage.jpg", "/images/vintage-1.jpg", "/images/vintage-2.jpg", "/images/vintage-3.jpg", "/images/vintage-4.jpg"],
      description:
        "This vintage leather bag selection brings the best in real gems handmade pieces from our unique collection.",
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
<section className="relative flex flex-col items-center text-center max-w-6xl mx-auto space-y-10 pt-10 pb-24 px-6 z-10">
  {/* HEADING */}
  <h1 className="text-5xl font-extrabold tracking-widest mb-6 text-amber-100">
    DUKE OF LEATHER
  </h1>

  <div className="flex flex-col items-center mb-5">
    <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center">
      <span className="text-3xl text-white">D</span>
    </div>
    <div className="w-px h-10 bg-white mt-2"></div>
  </div>

  <div className="w-full border-t border-white mb-10"></div>

  {/* SUB HEADING */}
  <h2 className="text-3xl font-bold tracking-wide text-white mb-5">
    Discover Your Perfect Companion: Luxury Leather Bags for Every Adventure
  </h2>

  <p className="text-gray-200 max-w-3xl leading-relaxed tracking-[0.05em] mb-2">
    Embrace the essence of Scandinavian design with our premium leather bags, meticulously crafted for the modern Norwegian lifestyle. Whether you’re navigating the bustling office, hitting the trails, cruising on your bike, or heading out for a stylish weekend escape, our collection has something for everyone.
  </p>

  {/* GRID SECTION */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5 place-items-stretch">
    {/* Office Worker */}
    <div className="border border-white/40 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-semibold text-amber-200 mb-3">
        For the Office Worker
      </h3>
      <p className="text-gray-200 text-sm leading-relaxed">
       Elevate your professional game with our sophisticated leather briefcases and messenger bags. Designed with both style and functionality in mind, our bags seamlessly blend into your work environment, providing ample space for your laptop, documents, and essentials—all while exuding an air of timeless elegance.
      </p>
    </div>

    {/* Hiker */}
    <div className="border border-white/40 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-semibold text-amber-200 mb-3">For the Hiker</h3>
      <p className="text-gray-200 text-sm leading-relaxed">
        Adventure awaits with our rugged yet refined leather backpacks. Built to withstand the elements, these bags offer durability without sacrificing style. With ample storage for your hiking gear, water bottles, and snacks, you’ll be ready to explore Norway’s breathtaking landscapes in both comfort and flair.
      </p>
    </div>

    {/* Biker */}
    <div className="border border-white/40 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-semibold text-amber-200 mb-3">For the Biker</h3>
      <p className="text-gray-200 text-sm leading-relaxed">
       Rev up your ride with our sleek leather bags designed specifically for bikers. Our collections feature secure storage options and ergonomic designs that conform to your lifestyle, making them the perfect accessory for your next journey, whether it’s a daily commute or a weekend road trip.
      </p>
    </div>
  </div>

  {/* SECOND ROW — CENTERED TWO CARDS */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2 lg:w-2/3 mx-auto mb-0">
    {/* Stylist */}
    <div className="border border-white/40 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-semibold text-amber-200 mb-3">For the Stylist</h3>
      <p className="text-gray-200 text-sm leading-relaxed">
        Make a statement with our fashion-forward leather totes and clutches. Our bags are not just functional; they are stylish accessories that complement any outfit, turning heads wherever you go. Perfect for those who appreciate quality and elegance in every aspect of their lives.
      </p>
    </div>

    {/* Weekend Getaway */}
    <div className="border border-white/40 rounded-2xl p-6 text-center bg-white/5 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-semibold text-amber-200 mb-3">
        For Weekend Getaways
      </h3>
      <p className="text-gray-200 text-sm leading-relaxed">
        Pack up and go with our chic leather weekend bags, designed for spontaneous escapes. With spacious compartments and a stylish aesthetic, our bags help you carry everything you need for an adventure, all while making a bold statement about your refined taste.
      </p>
    </div>
  </div>

  {/* WHY CHOOSE SECTION */}
  <div className="w-full border-t border-white mt-10 mb-8"></div>

  <div className="max-w-3xl mx-auto text-center -mb-10">
    <h3 className="text-2xl font-semibold text-white mb-6">
      Why Choose Our Leather Bags
    </h3>

    {/* Subtle list display */}
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-300 text-sm tracking-wide">
      <li className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-all duration-300">
        <span className="block text-amber-200 font-semibold mb-2">
          Craftsmanship
        </span>
        Each bag is handcrafted from the finest materials, ensuring durability and longevity.
      </li>
      <li className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-all duration-300">
        <span className="block text-amber-200 font-semibold mb-2">
          Style & Functionality
        </span>
       Designed to meet your unique lifestyle needs, without compromising on aesthetics.
      </li>
      <li className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-all duration-300">
        <span className="block text-amber-200 font-semibold mb-2">
          Sustainability
        </span>
       We prioritize eco-friendly practices in our production process, crafting bags you can feel good about.
      </li>
    </ul>

    <p className="text-gray-300 mt-10 text-sm leading-relaxed max-w-2xl mx-auto">
      Elevate your everyday experience with our versatile leather bags tailored for the discerning Norwegian. Explore our collection today and find your perfect companion for work, play, and everything in between.{" "}
      <span className="font-semibold text-amber-200">
        Your adventure begins here.
      </span>
    </p>
  </div>
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
              <div className={` mx-4 flex flex-col items-center ${imageOrder}`}>
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
                className={`flex flex-col gap-6 p-8 ${textOrder}`}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <a id="#contact" href="#contact" className="text-2xl font-semibold text-red-700">
                  {product.price}
                </a>
                <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                  {product.description}
                </p>
                {/* <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                  {product.details.map((d, i) => (
                    <div key={i}>
                      <p className="font-bold text-gray-900">{d.label}</p>
                      <p>{d.value}</p>
                    </div>
                  ))}
                </div> */}
              </motion.div>
            </div>
          );
        })}

        {/* CONTACT FORM */}
        <section id="contact" className="max-w-4xl mx-auto mb-0">
          <div className="mx-4 bg-white p-10 rounded-3xl shadow-lg border border-gray-200">
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
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white  py-10">
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
