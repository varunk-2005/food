"use client";

import Header from "@/component/layout/Header";
import Hero from "@/component/layout/Hero";
import HomeMenu from "@/component/layout/HomeMenu";
import SectionHeaders from "@/component/layout/SectionHeaders";

export default function Home() {
  return (
    <div className="pt-28 bg-white min-h-screen">
      <Hero />
      <div className="my-12">
        <HomeMenu />
      </div>
      {/* About Section */}
      <div id="about" className="max-w-2xl mx-auto mt-16 mb-12 p-8 bg-gray-50 rounded-xl shadow-md">
        <SectionHeaders SubHeader="Our Story" MainHeader="About Us" />
        <div className="mt-4 text-gray-800 text-lg leading-relaxed">
          <p>
            At <span className="text-red-600 font-bold">ST Pizza</span>, we&rsquo;re all about bold flavors and fresh ingredients. Nestled in the heart of the city, ST Pizza serves handcrafted pizzas made with love &mdash; from our perfectly chewy crusts to our zesty, house-made sauces. Whether you&apos;re craving a classic Margherita or an adventurous fusion like Tandoori Paneer or BBQ Chicken Jalape&ntilde;o, we&rsquo;ve got something to satisfy every craving.
          </p>
        </div>
      </div>
      {/* Contact Section */}
      <div id="contact" className="max-w-2xl mx-auto mb-16 p-8 bg-white rounded-xl shadow-md border border-gray-100">
        <SectionHeaders SubHeader="Contact" MainHeader="Get in Touch" />
        <div className="mt-4 text-gray-800 text-lg">
          <p>Email: <a href="mailto:info@stpizza.com" className="text-red-600 hover:underline">info@stpizza.com</a></p>
          <p>Phone: <span className="text-black font-semibold">+91 12345 67890</span></p>
          <p>Address: <span className="text-black">123 Pizza Street, Food City</span></p>
        </div>
      </div>
    </div>
  );
}
