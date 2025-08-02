import { User } from "../../Models/User";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    // Validate only email and password
    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (body.password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await connectMongoDB();
    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const createdUser = await User.create(body);
    return new Response(JSON.stringify({
      email: createdUser.email,
      name: createdUser.name,
    }), {
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