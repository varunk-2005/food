"use client";
import MenuItem from "../Menu/MenuItem";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomeMenu() {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    fetch("/api/menuitems")
      .then(res => res.json())
      .then(data => {
        const itemsArray = Array.isArray(data) ? data : data.menuItems;
        const bestSellers = Array.isArray(itemsArray) ? itemsArray.slice(-3) : [];
        setMenuItems(bestSellers);
      });
  }, []);
  return (
    <section className="w-full px-4 md:px-16 py-5 bg-white overflow-hidden">
      <div className="relative flex items-center justify-center min-h-[200px]">
        {/* Left image */}
        <Image
          src="/FAW-recipes-big-italian-salad-hero-83e6ea846722478f8feb1eea33158b00.jpg"
          alt="salad left"
          width={160}
          height={160}
          className="hidden md:block w-40 h-auto rounded-xl shadow-md absolute left-0 top-1/2 -translate-y-1/2"
        />

        {/* Center text */}
        <div className="text-center z-10">
          <h3 className="uppercase text-gray-600 leading-4">Check Out</h3>
          <h2 className="text-red-500 font-bold text-2xl mt-2">Our Best Sellers</h2>
        </div>

        {/* Right image */}
        <Image
          src="/FAW-recipes-big-italian-salad-hero-83e6ea846722478f8feb1eea33158b00.jpg"
          alt="salad right"
          width={160}
          height={160}
          className="hidden md:block w-40 h-auto rounded-xl shadow-md absolute right-0 top-1/2 -translate-y-1/2"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
