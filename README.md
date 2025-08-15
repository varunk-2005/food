# 🍕 Food Ordering App

A full-stack food ordering web application built with **Next.js**, **MongoDB**, **JWT Authentication**, and **Zustand** for state management.  
Users can sign up with email/password or Google OAuth, update their profile with an avatar (via Cloudinary), and browse/order menu items.

---

## 🚀 Features

- 🔐 **Authentication**
  - Email/Password login
  - Google OAuth with NextAuth
  - JWT-based protected API routes

- 👤 **User Profiles**
  - Upload profile picture using **Cloudinary**
  - Editable profile fields
  - "Not provided" placeholders for missing info

- 🍽️ **Menu Management**
  - Browse available menu items
  - Add / edit menu items (admin only)
  - Categories with simple UI

- 🖼️ **Image Uploads**
  - Cloudinary unsigned upload preset
  - EditableImage component with live preview

- ⚡ **State Management**
  - **Zustand** for global state
  - Authentication & profile synced across pages

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (React 18)**
- **Tailwind CSS**
- **Axios** for API calls

### Backend
- **Express.js** (for API routes under `/api/auth`)
- **MongoDB + Mongoose**
- **JWT** for secure authentication
- **Middleware** for protected routes

### Other Integrations
- **Cloudinary** for image hosting
- **NextAuth** (Google + Credentials provider)

---

## 📂 Project Structure


