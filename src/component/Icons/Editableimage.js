import Image from "next/image";
import { useState } from "react";

const DEFAULT_AVATAR = (
    <svg viewBox="0 0 24 24" fill="none" className="w-24 h-24 text-gray-300" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#f3f4f6" />
        <circle cx="12" cy="10" r="4" fill="#d1d5db" />
        <ellipse cx="12" cy="17" rx="7" ry="4" fill="#d1d5db" />
    </svg>
);

export default function EditableImage({ link, setLink, editMode = true }) {
    const [uploading, setUploading] = useState(false);

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
            setLink(res.secure_url);
        } else {
            alert("Upload failed: " + (res.error?.message || "Unknown error"));
        }

        setUploading(false);
    }

    return (
        <div className="mb-4 relative">
            <label htmlFor="imageUploadInput" className="cursor-pointer group">
                {link ? (
                    <Image
                        src={link}
                        alt="Profile"
                        className={`w-24 h-24 rounded-full object-cover border-4 transition ${editMode ? "border-blue-400 group-hover:opacity-70" : "border-red-200"}`}
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
    );
}