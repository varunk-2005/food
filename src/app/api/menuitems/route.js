import { connectMongoDB } from "@/lib/mongodb";
import MenuItem from "@/app/Models/menuitems";
import { NextResponse } from "next/server";

console.log("MenuItems API loaded");

export async function POST(req) {
    try {
        console.log("POST request received");
        await connectMongoDB();
        const { menuItem } = await req.json();
        console.log("Received menuItem:", menuItem);
        const created = await MenuItem.create(menuItem);
        console.log("Created menu item:", created);
        return NextResponse.json({ menuItem: created });
    } catch (error) {
        console.log("Error in POST:", error.message);
        return NextResponse.json({ error: error.message || "Failed to save menu item" }, { status: 400 });
    }
}

export async function PUT(req) {
    try {
        console.log("PUT request received");
        await connectMongoDB();
        const { menuItem } = await req.json();
        console.log("Received menuItem:", menuItem);
        if (!menuItem._id) {
            return NextResponse.json({ error: "Missing menu item ID" }, { status: 400 });
        }
        const updated = await MenuItem.findByIdAndUpdate(menuItem._id, menuItem, { new: true });
        console.log("Updated menu item:", updated);
        if (!updated) {
            return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
        }
        return NextResponse.json({ menuItem: updated });
    } catch (error) {
        console.log("Error in PUT:", error.message);
        return NextResponse.json({ error: error.message || "Failed to update menu item" }, { status: 400 });
    }
}

export async function GET() {
    console.log("GET request received");
    await connectMongoDB();
    const menuItems = await MenuItem.find();
    console.log("Found menu items:", menuItems.length);
    return NextResponse.json({ menuItems });
}