import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/app/Models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectMongoDB();
                const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });
                if (!user) throw new Error("No user found");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid credentials");

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || "",
                    picture: user.image || "",
                    address: user.address || "",
                    city: user.city || "",
                    postalCode: user.postalCode || "",
                    phone: user.phone || "",
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            await connectMongoDB();

            // ✅ Google login - create user if not found
            if (account?.provider === "google") {
                const existingUser = await User.findOne({ email: token.email });

                if (!existingUser) {
                    const newUser = await User.create({
                        email: token.email,
                        name: token.name || "",
                        image: token.picture || "",
                    });

                    token.id = newUser._id.toString();
                    token.name = newUser.name;
                    token.picture = newUser.image;
                } else {
                    token.id = existingUser._id.toString();
                    token.name = existingUser.name;
                    token.picture = existingUser.image;
                }
            }

            // ✅ Credentials login
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.picture;
                token.address = user.address || "";
                token.city = user.city || "";
                token.postalCode = user.postalCode || "";
                token.phone = user.phone || "";
            }

            return token;
        },

        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.address = token.address;
                session.user.city = token.city;
                session.user.postalCode = token.postalCode;
                session.user.phone = token.phone;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
