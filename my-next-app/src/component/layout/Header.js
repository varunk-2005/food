import Link from "next/link";

export default function Header() {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 py-3">
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-red-600 font-bold text-2xl">ST PIZZA</Link>
          <Link href="/" className="text-gray-800 font-medium">Home</Link>
          <Link href="/menu" className="text-gray-800 font-medium">Menu</Link>
          <Link href="/about" className="text-gray-800 font-medium">About</Link>
          <Link href="/contact" className="text-gray-800 font-medium">Contact</Link>
        </nav>
        <nav className="flex items-center space-x-6">
          <Link href="/login" className="text-gray-800 font-medium">Login</Link>
          <Link
            href="/Register"
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            Register
          </Link>
        </nav>
      </header>
    </div>
  );
}
