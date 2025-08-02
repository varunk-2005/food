"use client";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/component/SessionProviderWrapper";
import { useSession } from "next-auth/react";

export default function CartPage() {
    const { cart, setCart } = useContext(CartContext);
    const { data: session } = useSession();
    const user = session?.user;

    // Prefill address and details from user profile if available
    const [address, setAddress] = useState(user?.address || "");
    const [city, setCity] = useState(user?.city || "");
    const [postalCode, setPostalCode] = useState(user?.postalCode || "");
    const [phone, setPhone] = useState(user?.phone || "");

    useEffect(() => {
        if (user) {
            setAddress(user.address || "");
            setCity(user.city || "");
            setPostalCode(user.postalCode || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    const total = cart.reduce((sum, item) => {
        const base = item.basePrice || 0;
        const size = item.size ? item.size.price : 0;
        const extras = item.extras ? item.extras.reduce((s, e) => s + (e.price || 0), 0) : 0;
        return sum + base + size + extras;
    }, 0);

    return (
        <div className="max-w-3xl mx-auto py-20 px-4 min-h-screen bg-white">
            <h1 className="text-3xl font-extrabold mb-10 text-center text-black tracking-tight">Your Cart</h1>
            {cart.length === 0 ? (
                <div className="text-center text-gray-500 text-lg mt-24">Your cart is empty.</div>
            ) : (
                <>
                    <div className="mb-10 space-y-6">
                        {cart.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6 shadow hover:shadow-lg transition-all border border-gray-100">
                                <div className="flex-1">
                                    <div className="font-bold text-lg text-black mb-1">{item.name}</div>
                                    {item.size && <div className="text-sm text-gray-700">Size: <span className="font-semibold text-black">{item.size.name}</span> (₹{item.size.price})</div>}
                                    {item.extras && item.extras.length > 0 && (
                                        <div className="text-sm text-gray-700">Extras: <span className="font-semibold text-black">{item.extras.map(e => e.name).join(", ")}</span> (₹{item.extras.reduce((s, e) => s + (e.price || 0), 0)})</div>
                                    )}
                                    <div className="text-sm text-gray-700">Base Price: <span className="font-semibold text-black">₹{item.basePrice}</span></div>
                                </div>
                                <div className="font-bold text-2xl text-red-600">₹{(item.basePrice || 0) + (item.size ? item.size.price : 0) + (item.extras ? item.extras.reduce((s, e) => s + (e.price || 0), 0) : 0)}</div>
                                <button
                                    className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded-full px-4 py-1 text-sm font-semibold transition-colors duration-200"
                                    onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-black">Delivery Details</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-1 text-black">Address</label>
                                <input
                                    className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block font-semibold mb-1 text-black">City</label>
                                    <input
                                        className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block font-semibold mb-1 text-black">Postal Code</label>
                                    <input
                                        className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        value={postalCode}
                                        onChange={e => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-black">Phone</label>
                                <input
                                    className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-50 rounded-2xl shadow p-6 border border-gray-100">
                        <div className="text-2xl font-bold text-black">Total: <span className="text-red-600">₹{total}</span></div>
                        <button className="bg-red-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-black transition-colors duration-200 shadow-md w-full md:w-auto">Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
} 