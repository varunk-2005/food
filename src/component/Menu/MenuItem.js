import Image from "next/image";
import { useState, useContext, useMemo } from "react";
import { CartContext } from "../SessionProviderWrapper";

export default function MenuItem({ item }) {
  const { addToCart } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const basePrice = item.basePrice || 0;
  const sizePrice = selectedSize ? selectedSize.price : 0;
  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  const totalPrice = basePrice + sizePrice + extrasPrice;

  const handleAddToCart = () => {
    addToCart(item, selectedSize, selectedExtras);
    setShowPopup(false);
    setSelectedExtras([]);
    setSelectedSize(item.sizes?.[0] || null);
  };

  const handleExtraChange = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((e) => e !== extra)
        : [...prev, extra]
    );
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedExtras([]);
    setSelectedSize(item.sizes?.[0] || null);
  };

  return (
    <div className="bg-white p-5 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 min-w-[260px] max-w-xs mx-auto flex flex-col items-center">
      {item.image && (
        <Image src={item.image} alt={item.name} width={200} height={150} className="mx-auto rounded-xl mb-2 object-cover shadow" />
      )}
      <h4 className="font-bold text-xl my-3 text-black">{item.name}</h4>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>
      <button
        className="mt-auto bg-red-500 text-white rounded-full px-6 py-2 font-semibold hover:bg-black transition-colors duration-200 w-full"
        onClick={() => setShowPopup(true)}
      >
        Add to cart ₹{totalPrice}
      </button>
      {showPopup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 animate-fadeIn" onClick={handleClose}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={handleClose}>&times;</button>
            {item.image && (
              <Image src={item.image} alt={item.name} width={300} height={200} className="mx-auto rounded-xl mb-4 object-cover shadow" />
            )}
            <h3 className="text-2xl font-bold mb-2 text-center text-black">{item.name}</h3>
            <p className="text-gray-700 text-center mb-4">{item.description}</p>
            {item.sizes?.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold mb-2 text-black">Pick your size</div>
                <div className="flex flex-col gap-2">
                  {item.sizes.map((size, idx) => (
                    <label key={size.name} className="flex items-center gap-2 cursor-pointer text-black">
                      <input
                        type="radio"
                        name={`size-${item._id}`}
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                      />
                      <span>{size.name} ₹{size.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {item.extraIngredients?.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold mb-2 text-black">Add extras</div>
                <div className="flex flex-col gap-2">
                  {item.extraIngredients.map((extra, idx) => (
                    <label key={extra.name} className="flex items-center gap-2 cursor-pointer text-black">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra)}
                        onChange={() => handleExtraChange(extra)}
                      />
                      <span>{extra.name} ₹{extra.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              className="w-full bg-red-500 text-white rounded-full px-4 py-3 mt-2 font-semibold text-lg hover:bg-black transition-colors duration-200"
              onClick={handleAddToCart}
            >
              Add to cart ₹{totalPrice}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

