import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { User } from "@/app/Models/User";

export async function GET() {
    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: "your-db-name", // optional but recommended
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        const users = await User.find();
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await connectDB();
        await User.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

// PATCH /api/users/[id] — Toggle admin status
export async function PATCH(req, { params }) {
    const { id } = params;

    try {
        await connectDB();

        const user = await User.findById(id);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        user.admin = !user.admin;
        await user.save();

        return NextResponse.json({ success: true, admin: user.admin });
    } catch (error) {
        console.error("Error toggling admin:", error);
        return NextResponse.json({ error: "Failed to toggle admin" }, { status: 500 });
    }
}