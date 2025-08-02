'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useContext } from "react";
import { CartContext } from "../SessionProviderWrapper";

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { cart } = useContext(CartContext);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
      <header className="w-full flex items-center justify-between px-8 py-4">
        {/* Left Nav */}
        <nav className="flex items-center space-x-8">
          <Link href="/" className="text-red-600 font-extrabold text-2xl tracking-wide hover:opacity-90 transition">ST PIZZA</Link>
          <Link href="/" className="text-black font-medium hover:text-red-600 transition">Home</Link>
          <Link href="/menu" className="text-black font-medium hover:text-red-600 transition">Menu</Link>
          <Link href="/" className="text-black font-medium hover:text-red-600 transition">About</Link>
          <Link href="/" className="text-black font-medium hover:text-red-600 transition">Contact</Link>
        </nav>

        {/* Right Nav */}
        <nav className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <>
              {cart && cart.length > 0 && (
                <button
                  className="bg-white border border-red-500 text-red-500 rounded-full px-5 py-2 font-semibold hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center gap-2 shadow-sm"
                  onClick={() => window.location.href = "/cart"}
                  style={{ minHeight: 44 }}
                >
                  🛒 Cart ({cart.length})
                </button>
              )}
              <Link href="/profile" className="text-black font-medium px-2 hover:underline">
                Hello, {user?.name?.split(" ")[0] || user?.email?.split("@")?.[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold hover:bg-black hover:text-white transition-colors duration-200 shadow-sm"
                style={{ minHeight: 44 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold hover:bg-black hover:text-white transition-colors duration-200 shadow-sm" style={{ minHeight: 44 }}>
                Login
              </Link>
              <Link href="/register" className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold hover:bg-black hover:text-white transition-colors duration-200 shadow-sm" style={{ minHeight: 44 }}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}
