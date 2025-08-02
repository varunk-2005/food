import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/app/Models/User";

// GET: Fetch current user profile
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ error: "Not authenticated" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        await connectMongoDB();
        const user = await User.findOne({ email: session.user.email }).lean();
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(
            JSON.stringify({
                user: {
                    name: user.name || "",
                    email: user.email || "",
                    address: user.address || "",
                    phone: user.phone || "",
                    image: user.image || "",
                    city: user.city || "",
                    postalCode: user.postalCode || "",
                    admin: user.admin || false,
                },
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Profile GET error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// PUT: Update profile (excluding email, admin)
export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ error: "Not authenticated" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const data = await req.json();
        const { name, address, phone, image, city, postalCode } = data;
        await connectMongoDB();
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                ...(name && { name }),
                ...(address && { address }),
                ...(phone && { phone }),
                ...(image && { image }),
                ...(city && { city }),
                ...(postalCode && { postalCode }),
            },
            { new: true }
        );
        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(
            JSON.stringify({
                message: "Profile updated successfully",
                user: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    address: updatedUser.address,
                    phone: updatedUser.phone,
                    image: updatedUser.image,
                    city: updatedUser.city,
                    postalCode: updatedUser.postalCode,
                    admin: updatedUser.admin,
                },
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Profile update error:", error);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}