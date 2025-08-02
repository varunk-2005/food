import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Category } from "@/app/Models/Category";

export async function GET(request, { params }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const { data } = await request.json();
        if (!data || !data.name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }
        const updated = await Category.findByIdAndUpdate(id, { name: data.name }, { new: true });
        if (!updated) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
} 