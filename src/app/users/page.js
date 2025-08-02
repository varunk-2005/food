"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Tabs from "@/component/Tabs";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
            fetchUsers();
        }
    }, [status]);

    const fetchProfile = async () => {
        setProfileLoading(true);
        try {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setUserData(data.user);
            } else {
                setUserData(null);
            }
        } catch {
            setUserData(null);
        } finally {
            setProfileLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            const usersData = await res.json();
            setUsers(usersData);
        } catch (err) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        const res = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
        } else {
            alert("Failed to delete user");
        }
    };

    const handleToggleAdmin = async (userId) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
            });

            if (res.ok) {
                const updated = await res.json();
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u._id === userId ? { ...u, admin: updated.admin } : u
                    )
                );
            } else {
                alert("Failed to toggle admin status");
            }
        } catch (err) {
            alert("An error occurred while toggling admin status");
        }
    };

    return (
        <section className="min-h-[60vh] p-0 bg-gray-50">
            {/* Tabs section with light background and spacing */}
            <div className="w-full bg-gray-50 pb-2 flex flex-col items-center mt-28">
                {console.log("userData for Tabs:", userData)}
                <Tabs userData={userData || { admin: false }} />
            </div>

            <div className="max-w-2xl mx-auto">
                {loading && (
                    <div className="text-center text-gray-500 py-8 text-lg">Loading users...</div>
                )}
                {error && (
                    <div className="text-center text-red-500 py-8 text-lg">{error}</div>
                )}
                {!loading && !error && users.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-lg">No users found.</div>
                )}
                {!loading && !error && users.length > 0 &&
                    users.map((user) => (
                        <div key={user._id} className="mb-4 border p-4 rounded shadow-sm">
                            <h2 className="text-xl font-semibold">
                                {user.name || <span className='italic text-gray-400'>No Name</span>}
                            </h2>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="mt-2 flex gap-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.admin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {user.admin ? 'Admin' : 'User'}
                                </span>
                            </div>
                            <div className="mt-2 flex gap-4">
                                <button
                                    className="text-purple-600 hover:underline"
                                    onClick={() => handleToggleAdmin(user._id)}
                                >
                                    {user.admin ? "Remove Admin" : "Make Admin"}
                                </button>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}

