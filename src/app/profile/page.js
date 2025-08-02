"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Tabs from "@/component/Tabs";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR = (
    <svg viewBox="0 0 24 24" fill="none" className="w-24 h-24 text-gray-300" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#f3f4f6" />
        <circle cx="12" cy="10" r="4" fill="#d1d5db" />
        <ellipse cx="12" cy="17" rx="7" ry="4" fill="#d1d5db" />
    </svg>
);

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    async function fetchProfile() {
        setLoading(true);
        const res = await fetch("/api/profile");
        if (res.ok) {
            const data = await res.json();
            setUserData(data.user);
        } else {
            setUserData(null);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
        }
    }, [status]);

    const handleChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function handleFileChange(ev) {
        const files = ev.target.files;
        if (files?.length !== 1) return;

        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        setUploading(true);
        const upload = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const res = await upload.json();

        if (res.secure_url) {
            setUserData((prev) => ({ ...prev, image: res.secure_url }));
        } else {
            alert("Upload failed: " + (res.error?.message || "Unknown error"));
        }

        setUploading(false);
    }

    const handleSave = async () => {
        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (res.ok) {
            alert("Profile updated");
            setEditMode(false);
            fetchProfile();
        } else {
            alert("Error saving profile");
        }
    };

    if (status === "loading" || loading)
        return <div className="flex justify-center items-center h-[60vh] text-lg">Loading...</div>;
    if (status === "unauthenticated") return null;
    if (!session)
        return <div className="flex justify-center items-center h-[60vh] text-lg">Please log in</div>;
    if (!userData)
        return <div className="flex justify-center items-center h-[60vh] text-lg">No profile data found.</div>;

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-8 mt-28">
            <Tabs userData={userData} />
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center">
                {/* Profile Image */}
                <div className="mb-4 relative">
                    <label htmlFor="imageUploadInput" className="cursor-pointer group">
                        {userData.image ? (
                            <Image
                                src={userData.image}
                                alt="Profile"
                                className={`w-24 h-24 rounded-full object-cover border-4 transition ${editMode ? "border-blue-400 group-hover:opacity-70" : "border-red-200"
                                    }`}
                                width={96}
                                height={96}
                            />
                        ) : (
                            <div className="w-24 h-24">{DEFAULT_AVATAR}</div>
                        )}
                        {editMode && (
                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow text-xs text-gray-600">
                                ✎
                            </div>
                        )}
                    </label>
                    {editMode && (
                        <input
                            type="file"
                            id="imageUploadInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    )}
                    {uploading && <div className="text-sm text-blue-500 mt-2">Uploading...</div>}
                </div>

                {/* Profile Fields */}
                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-gray-500 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={userData.email}
                            disabled
                            className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 cursor-not-allowed"
                        />
                    </div>
                    {["name", "phone", "address", "city", "postalCode"].map((field) => (
                        <div key={field}>
                            <label className="block text-gray-500 text-sm mb-1">
                                {field[0].toUpperCase() + field.slice(1)}
                            </label>
                            {editMode ? (
                                <input
                                    name={field}
                                    value={userData[field] || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            ) : (
                                <div className="text-gray-800 min-h-[2rem]">
                                    {userData[field] || <span className="text-gray-400">(not set)</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Save / Edit Buttons */}
                <div className="w-full flex justify-end mt-6">
                    {editMode ? (
                        <button
                            onClick={handleSave}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
