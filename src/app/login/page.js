"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setMsg("🔄 Logging in...");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res && !res.error) {
            setMsg("✅ Login successful! Redirecting...");
            setTimeout(() => router.push("/profile"), 1000);
        } else {
            setMsg("❌ Invalid email or password");
        }
    }

    async function handleGoogleLogin() {
        await signIn("google", { callbackUrl: "/profile" });
    }

    return (
        <div className="py-15">
            <section className="mt-8">
                <h1 className="text-center text-red-500 text-4xl font-bold mb-6">Login</h1>
                <form className="block max-w-xl mx-auto" onSubmit={handleFormSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        required
                        className="block w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                        className="block w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition"
                    >
                        Login
                    </button>
                    {msg && (
                        <p className="mt-4 text-center text-sm text-gray-600">{msg}</p>
                    )}
                    <div className="my-4 text-center text-gray-500">
                        — or login with —
                    </div>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="bg-gray-100 border px-4 py-2 rounded w-full hover:bg-gray-200 transition"
                    >
                        Login with Google
                    </button>
                </form>
            </section>
        </div>
    );
}
