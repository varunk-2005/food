import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import MenuItem from "@/app/Models/menuitems";

export async function GET(request, { params }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const item = await MenuItem.findById(id);
        if (!item) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        console.error("Error fetching menu item:", error);
        return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const { data } = await request.json();
        if (!data || !data.name) {
            return NextResponse.json({ error: "Menu item name is required" }, { status: 400 });
        }
        const updated = await MenuItem.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Menu item updated successfully" });
    } catch (error) {
        console.error("Error updating menu item:", error);
        return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const deleted = await MenuItem.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Menu item deleted successfully" });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
    }
} 