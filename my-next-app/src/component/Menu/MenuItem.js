export default function MenuItem() {
  return (
        <div className="bg-gray-200 p-4 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
          <img src="\JTPSD2ONPYISBHIP4CJ5HDW55A_01.webp" alt="pizza" />
          <h4 className="font-semibold text-xl my-3">margarita Pizza</h4>
          <p className="text-gray-500 text-sm">
            A classic Italian pizza topped with fresh mozzarella, ripe tomatoes, basil leaves, and a drizzle of olive oil
          </p>
          <button className="mt-4 bg-red-500 text-white rounded-full px-6 py-2 hover:bg-red-600 transition-colors duration-300">
            Add to cart $12
          </button>
        </div>
  );
}

