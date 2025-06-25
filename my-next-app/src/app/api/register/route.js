import { User } from "../../Models/User";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🚀 Incoming body:", body);

    // ✅ Validate only email and password
    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await mongoose.connect(process.env.MONGO_URL);
    const createdUser = await User.create(body);

    return new Response(JSON.stringify(createdUser), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
