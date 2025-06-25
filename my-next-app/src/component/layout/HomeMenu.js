import MenuItem from "../Menu/MenuItem";

export default function HomeMenu() {
  return (
    <section className="w-full px-4 md:px-16 py-5 bg-white overflow-hidden">
      <div className="relative flex items-center justify-center min-h-[200px]">
        {/* Left image */}
        <img
          src="/FAW-recipes-big-italian-salad-hero-83e6ea846722478f8feb1eea33158b00.jpg"
          alt="salad left"
          className="hidden md:block w-40 h-auto rounded-xl shadow-md absolute left-0 top-1/2 -translate-y-1/2"
        />

        {/* Center text */}
        <div className="text-center z-10">
          <h3 className="uppercase text-gray-600 leading-4">Check Out</h3>
          <h2 className="text-red-500 font-bold text-2xl mt-2">Menu</h2>
        </div>

        {/* Right image */}
        <img
          src="/FAW-recipes-big-italian-salad-hero-83e6ea846722478f8feb1eea33158b00.jpg"
          alt="salad right"
          className="hidden md:block w-40 h-auto rounded-xl shadow-md absolute right-0 top-1/2 -translate-y-1/2"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-3 gap-4">
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </section>
  );
}
