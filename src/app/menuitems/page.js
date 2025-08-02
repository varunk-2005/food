"use client";
import Tabs from "@/component/Tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EditableImage from "@/component/Icons/Editableimage";
import { toast } from "react-toastify";
import MenuItemSize from "@/component/layout/menuitemsize";

export default function MenuItemsPage() {
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const { status } = useSession();
    const [menuItem, setMenuItem] = useState({
        name: "",
        description: "",
        basePrice: "",
        image: "",
    });
    const [menuItems, setMenuItems] = useState([]);
    const [editId, setEditId] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [extraIngredients, setExtraIngredients] = useState([]);
    const [catagories, setCatagories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
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
        fetchMenuItems();
    }, []);

    async function fetchMenuItems() {
        const res = await fetch("/api/menuitems");
        if (res.ok) {
            const data = await res.json();
            setMenuItems(data.menuItems || data); // support both {menuItems:[]} and []
        }
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const data = { menuItem: { ...menuItem, sizes, extraIngredients, category: selectedCategory } };
        console.log("Submitting menu item:", data);
        let url = "/api/menuitems";
        let method = "POST";
        if (editId) {
            data.menuItem._id = editId;
            method = "PUT";
        }
        const savingPromise = fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (res) => {
            if (!res.ok) {
                let errorMsg = "Failed to save";
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.error || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }
            return res.json();
        });
        await toast.promise(savingPromise, {
            loading: editId ? "Updating..." : "Saving...",
            success: editId ? "Updated!" : "Saved!",
            error: (err) => err.message || "Failed to save",
        });
        setMenuItem({ name: '', description: '', basePrice: '', image: '' });
        setSizes([]);
        setExtraIngredients([]);
        setEditId(null);
        setSelectedCategory("");
        fetchMenuItems();
    }

    function handleEdit(item) {
        setMenuItem({
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            image: item.image,
        });
        setSizes(item.sizes || []);
        setExtraIngredients(item.extraIngredients || []);
        setEditId(item._id);
        setSelectedCategory(item.category || "");
    }

    function handleCancelEdit() {
        setMenuItem({ name: '', description: '', basePrice: '', image: '' });
        setSizes([]);
        setExtraIngredients([]);
        setEditId(null);
        setSelectedCategory("");
    }

    function handleChange(ev) {
        const { name, value } = ev.target;
        setMenuItem(prev => ({ ...prev, [name]: value }));
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;
        const promise = fetch(`/api/menuitems/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
            if (!res.ok) {
                let errorMsg = "Failed to delete";
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.error || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }
            return res.json();
        });
        await toast.promise(promise, {
            loading: "Deleting menu item...",
            success: "Menu item deleted!",
            error: (err) => err.message || "Failed to delete",
        });
        fetchMenuItems();
    }
    useEffect(() => {
        fetch('/api/catagories').then(res => res.json()).then(catagories => {
            setCatagories(catagories);
        });
    }, []);

    if (!userData) return <div className="mt-28 flex justify-center">Loading...</div>;

    return (
        <section className="min-h-[60vh] p-8 bg-white mt-28">
            <Tabs userData={userData} />
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-6 bg-gray-50 p-6 rounded-lg shadow">
                <div>
                    <EditableImage
                        link={menuItem.image}
                        setLink={img => setMenuItem(m => ({ ...m, image: img }))}
                        editMode={true}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Item Name</label>
                    <input
                        type="text"
                        name="name"
                        value={menuItem.name}
                        onChange={handleChange}
                        placeholder="Menu item name"
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Item Description</label>
                    <input
                        type="text"
                        name="description"
                        value={menuItem.description}
                        onChange={handleChange}
                        placeholder="Menu item description"
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Category</label>
                    <select name="category" value={selectedCategory} onChange={ev => setSelectedCategory(ev.target.value)} className="w-full border rounded px-3 py-2" required>
                        <option value="">Select a category</option>
                        {catagories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Base Price</label>
                    <input
                        type="number"
                        name="basePrice"
                        value={menuItem.basePrice}
                        onChange={handleChange}
                        placeholder="Base item price"
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <MenuItemSize name="Sizes" addLabel="Add Size" props={[sizes, setSizes]} />
                <MenuItemSize name="Extra Ingredients" addLabel="Add Extra Ingredient" props={[extraIngredients, setExtraIngredients]} />
                <div className="flex gap-4">
                    <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold transition">
                        {editId ? "Update" : "Save"}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancelEdit} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
            <div className="mt-10 flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-10 text-center">All Menu Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl justify-center">
                    {menuItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-gray-200 p-4 rounded-lg text-center hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-between aspect-square"
                        >
                            {item.image && (
                                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded mb-3" />
                            )}
                            <h4 className="font-semibold text-xl my-2">{item.name}</h4>
                            <p className="text-gray-500 text-sm mb-2 line-clamp-3">{item.description}</p>
                            <span className="text-gray-700 font-medium mb-2">₹{item.basePrice}</span>
                            <button
                                className="mt-auto bg-red-500 text-white rounded-full px-6 py-2 hover:bg-red-600 transition-colors duration-300"
                                onClick={() => handleEdit(item)}
                            >
                                Edit
                            </button>
                            <button
                                className="mt-2 bg-gray-300 text-red-700 rounded-full px-6 py-2 hover:bg-red-200 border border-red-300 transition-colors duration-300"
                                onClick={() => handleDelete(item._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}