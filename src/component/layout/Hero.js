import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full px-4 md:px-16 py-20 bg-white">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="max-w-xl text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            <span className="text-red-500">Pizza</span> makes life so much easier
          </h1>
          <p className="text-lg text-gray-700">
            We have been known as the best pizza place in India and have a good reputation
            throughout the world.
          </p>
        </div>
        <Image
          src="/default-pizza-outlets-13.avif"
          alt="Pizza"
          width={400}
          height={300}
          className="w-full md:w-[400px] rounded-xl shadow-xl object-cover"
        />
      </div>
    </section>
  );
}
