// File: src/app/api/upload/route.js

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");

        if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });

        const formData = new FormData();
        formData.set("file", blob, file.name);
        formData.set("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const res = await fetch(uploadURL, {
            method: "POST",
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            console.error("Cloudinary Error:", json);
            return new Response(JSON.stringify({ error: json.error?.message || "Upload failed" }), {
                status: 500,
            });
        }

        return new Response(JSON.stringify({ secure_url: json.secure_url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Upload Handler Error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
