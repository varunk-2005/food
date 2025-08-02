"use client";

import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleformSubmit(ev) {
    ev.preventDefault();
    setMsg("Registering...");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg("✅ Registered successfully!");
    } else {
      setMsg(`❌ ${data.error}`);
    }
  }

  return (
    <div className="py-15">
      <section className="mt-8">
        <h1 className="text-center text-red-500 text-4xl">Register</h1>
        <form className="block max-w-xl mx-auto" onSubmit={handleformSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
            className="block w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
            className="block w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Register
          </button>

          {msg && (
            <p className="mt-4 text-center text-sm text-gray-600">{msg}</p>
          )}

          <div className="my-4 text-center text-gray-500">
            or login with provider
          </div>
          <button className="bg-gray-100 border px-4 py-2 rounded w-full">
            Login with Google
          </button>
        </form>
      </section>
    </div>
  );
}