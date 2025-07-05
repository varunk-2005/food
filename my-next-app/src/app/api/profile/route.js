import { getSession } from "next-auth/react";
import { connectToDB } from "../../../../utils/database";
import { User } from "../../Models/User";

export async function PUT(request) {
  try {
    const session = await getSession({ req: request });
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await request.json();
    const { name, address, mobile, picture, postalCode, city, country } = body;

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    user.name = name || user.name;
    user.address = address || user.address;
    user.mobile = mobile || user.mobile;
    user.picture = picture || user.picture;
    user.postalCode = postalCode || user.postalCode;
    user.city = city || user.city;
    user.country = country || user.country;

    await user.save();

    return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
  }
}
