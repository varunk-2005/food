"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    postalCode: "",
    city: "",
    country: "",
    picture: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/login");
    } else {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        address: session.user.address || "",
        mobile: session.user.mobile || "",
        postalCode: session.user.postalCode || "",
        city: session.user.city || "",
        country: session.user.country || "",
        picture: session.user.picture || "",
      });
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setMsg("Saving...");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        setMsg("Profile updated successfully.");
        setEditMode(false);
      } else {
        setMsg("Failed to update profile.");
      }
    } catch (error) {
      setMsg("Error updating profile.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex items-start space-x-6">
        <div className="flex flex-col items-center">
          {userData.picture ? (
            <img
              src={userData.picture}
              alt="Profile Picture"
              className="w-32 h-32 rounded-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600">
              No Picture
            </div>
          )}
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded font-semibold"
          >
            Edit
          </button>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <label className="block font-semibold">Name:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              <p>{userData.name || "Not provided"}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Email:</label>
            <p className="bg-gray-200 rounded p-2">{userData.email}</p>
          </div>
          <div>
            <label className="block font-semibold">Mobile Number:</label>
            {editMode ? (
              <input
                type="text"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              <p>{userData.mobile || "Not provided"}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Address:</label>
            {editMode ? (
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              <p>{userData.address || "Not provided"}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block font-semibold">Postal Code:</label>
              {editMode ? (
                <input
                  type="text"
                  name="postalCode"
                  value={userData.postalCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              ) : (
                <p>{userData.postalCode || "Not provided"}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block font-semibold">City:</label>
              {editMode ? (
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              ) : (
                <p>{userData.city || "Not provided"}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block font-semibold">Country:</label>
            {editMode ? (
              <input
                type="text"
                name="country"
                value={userData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              <p>{userData.country || "Not provided"}</p>
            )}
          </div>
          <div className="mt-6">
            {editMode ? (
              <button
                onClick={handleSave}
                className="w-full bg-red-500 text-white px-4 py-3 rounded font-semibold"
              >
                Save
              </button>
            ) : null}
          </div>
          {msg && <p className="mt-4 text-center text-sm text-gray-600">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
