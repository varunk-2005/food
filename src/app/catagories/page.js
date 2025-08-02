"use client";

import Tabs from "@/component/Tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function CategoriesPage() {
    const [userData, setUserData] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState(null);
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setUserData(data.user);
            }
        }
        fetchProfile();
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await fetch("/api/catagories");
        if (res.ok) {
            const data = await res.json();
            setCategories(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = newCategoryName.trim();
        if (!name) return toast.error("Please enter a category name");

        const data = editCategory ? { _id: editCategory._id, name } : { name };

        const promise = fetch("/api/catagories", {
            method: editCategory ? "PUT" : "POST",
            body: JSON.stringify({ data }),
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to save category");
            return result;
        });

        toast.promise(promise, {
            loading: editCategory ? "Updating category..." : "Adding category...",
            success: editCategory ? "Category updated!" : "Category added!",
            error: (err) => err.message || "Failed",
        }).then(() => {
            fetchCategories();
            setEditCategory(null);
            setNewCategoryName("");
        });
    };

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        const promise = new Promise(async (resolve, reject) => {
            const res = await fetch(`/api/catagories/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                resolve();
            } else {
                reject();
            }
        });
        await toast.promise(promise, {
            loading: "Deleting category...",
            success: "Category deleted!",
            error: (err) => err.message || "Failed",
        }).then(() => {
            fetchCategories();
        });
    }
    return (
        <>
            <div className="mt-28">
                {userData && <Tabs userData={userData} />}
            </div>

            <section className="min-h-[60vh] p-8 bg-white mt-8">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h2>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-50 border p-6 rounded-lg shadow-sm flex flex-col gap-4"
                    >
                        <label className="text-lg font-medium text-gray-700">
                            {editCategory ? "Update category:" : "Add new category"}
                            {editCategory && (
                                <>
                                    : <b>{editCategory.name}</b>
                                </>
                            )}
                        </label>
                        <input
                            type="text"
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="border rounded px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                            required
                        />
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
                            >
                                {editCategory ? "Update" : "Add"}
                            </button>
                            {editCategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditCategory(null);
                                        setNewCategoryName("");
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-10">Existing Categories</h2>
                        <div className="flex flex-col gap-6 max-w-xl">
                            {categories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <span className="text-gray-800 font-semibold text-lg">{cat.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            className="px-4 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-full border border-blue-200 transition"
                                            onClick={() => {
                                                setEditCategory(cat);
                                                setNewCategoryName(cat.name);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-4 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-full border border-red-200 transition"
                                            onClick={() => handleDelete(cat._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
