"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaMailBulk, FaTiktok } from "react-icons/fa";
import Contact from "@/components/ui/Contact";
import { FaMessage } from "react-icons/fa6";
import ProductsList from "@/components/ui/ProductsList";

export default function ProductPage() {
  const products = [
    {
      id: 1,
      name: "Mustang Rolled Leather Bag",
      price: "More Details",
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
      price: "More Details",
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
      price: "More Details",
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
      price: "More Details",
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
      price: "More Details",
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
      price: "More Details",
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
<section className="relative flex flex-col items-center text-center max-w-6xl mx-auto space-y-10 pt-10 pb-24 px-6 z-10 mb-10">
  {/* HEADING */}
  <h1 className="width-full font-extrabold tracking-widest mb-0 text-amber-100">
    <Image
      src="/duke-logo.svg"
      alt="Bull logo"
      width={280}
      height={72}
      className="object-contain mt-2"
      priority
    />
  </h1>

  <div className="flex flex-col items-center mb-5">
    <div className="w-20 h-20  flex items-center justify-center ">
      <Image src={"/logo.svg"} alt="Bull logo" width={75} height={70} className="object-contain mt-2" />
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
  
<div className="w-full border-t border-white mt-10 mb-0"></div>

</section>

      {/* PRODUCT SECTIONS */}
      <div className="relative z-10 py-24 bg-white">
          
              <ProductsList />
  
        {/* WHY CHOOSE SECTION */}
<section className="relative z-10 bg-black/60 py-20 px-6 mb-15">
  
  <div className="max-w-3xl mx-auto text-center mb-10">
    <div className="absolute inset-0 -z-10">
            <Image
              src="/images/s.webp"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
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
      Elevate your everyday experience with our versatile leather bags tailored for the discerning Norwegian.
      Explore our collection today and find your perfect companion for work, play, and everything in between.{" "}
      <span className="font-semibold text-amber-200">
        Your adventure begins here.
      </span>
    </p>
  </div>
  <h3 className="text-2xl text-center font-semibold text-white mb-6">
      Wide Range of Styles for Every Lifestyle
    </h3>

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
  </section>
        <Contact/>
      </div>

    {/* FOOTER */}
<footer className="bg-black text-white py-10">
  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-center gap-10 text-center md:text-left">
    {/* Left side */}
   <div className="flex flex-col items-center md:items-start">
  <div className="flex items-center mb-4 gap-0">
    {/* Circular Image */}
    <div className="rounded-full overflow-hidden">
      <Image
        src="/logo.svg"
        alt="Bull logo"
        width={60}
        height={64}
        className="object-cover w-full h-full block"
        priority
      />
    </div>

    {/* Rectangular Image */}
    <div className="">
      <Image
        src="/duke-logo.svg"
        alt="Duke logo"
        width={240}
        height={64}
        className="object-contain h-full block"
        priority
      />
    </div>
  </div>


      <p className="text-sm mt-2">
        &copy; {new Date().getFullYear()} Duke of Leather. All rights reserved.
      </p>
    </div>

    {/* Right side */}
    <div className="flex flex-col items-center md:items-end gap-4">
      <div className="text-sm text-center md:text-left">
        <p>
          Email:{" "}
          <a href="mailto:leathers.duke@gmail.com">leathers.duke@gmail.com</a>
        </p>
        <p>
          Phone: <a href="tel:+47-45423709">+47 45423709</a>
        </p>
        <p>
          Address: Fredrik Borgens veg 31,<br />
          <span className="ml-[64px] md:ml-[64px] ml-0">2040 Kløfta Norway</span>
        </p>
      </div>

      <div className="flex gap-4 mt-2 justify-center md:self-center">
        <a
          href="https://www.facebook.com/share/1CiUKWfDH9/"
          className="hover:text-amber-400 transition"
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="https://www.instagram.com/dukeofleathers"
          className="hover:text-amber-400 transition"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://www.tiktok.com/@duke.of.leathers?_t=ZN-90O6D1gyAKs&_r=1"
          className="hover:text-amber-400 transition"
        >
          <FaTiktok size={20} />
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
