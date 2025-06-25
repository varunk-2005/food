import Header from "@/component/layout/Header";
import Hero from "@/component/layout/Hero";
import HomeMenu from "@/component/layout/HomeMenu";
import SectionHeaders from "@/component/layout/SectionHeaders";
import Image from "next/image";
import Link from "next/link"; // ✅ Required import

export default function Home() {
  return (
    <>
      <Hero />
      <br/>
      <HomeMenu />
      <br/>
      <SectionHeaders SubHeader="Our Story" MainHeader="About Us" />
      <div className="max-w-2xl mx-auto ,t-4 text gray-500>">
      <p>At ST Pizza, we’re all about bold flavors and fresh ingredients. Nestled in the heart of the city, ST Pizza serves handcrafted pizzas made with love — from our perfectly chewy crusts to our zesty, house-made sauces. Whether you're craving a classic Margherita or an adventurous fusion like Tandoori Paneer or BBQ Chicken Jalapeño, we’ve got something to satisfy every craving.</p>
      </div>
      <SectionHeaders SubHeader="Don't Hesitate" MainHeader="Contact Us" />
      <h6 className="text-center z-10 ">+91 7200039941</h6>
    </>
  );
}


