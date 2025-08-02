import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { User } from "@/app/Models/User";

// PATCH /api/users/[id] — Toggle admin status
export async function PATCH(req, { params }) {
    const { id } = params;
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: "your-db-name",
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
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

// DELETE /api/users/[id] — Delete a user
export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: "your-db-name",
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        await User.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
} 