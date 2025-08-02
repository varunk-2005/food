// File: src/app/api/catagories/route.js

import { Category } from "@/app/Models/Category";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { data } = await req.json();

        if (!data || !data.name || typeof data.name !== "string" || data.name.trim() === "") {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const existing = await Category.findOne({ name: data.name });
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const category = await Category.create({ name: data.name });
        return NextResponse.json({ category });

    } catch (err) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const categories = await Category.find();
        return NextResponse.json(categories);
    } catch (err) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectMongoDB();
        const { data } = await req.json();

        if (!data || !data._id || !data.name || data.name.trim() === "") {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const updated = await Category.findByIdAndUpdate(
            data._id,
            { name: data.name },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ category: updated });
    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { id } = await req.json();
        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: "Category deleted" });
    } catch (err) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}