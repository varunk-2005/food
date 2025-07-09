import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "../../../Models/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (mongoose.connection.readyState === 0) {
            const mongoUrl =
              process.env.MONGODB_URI ||
              process.env.MONGO_URL ||
              process.env.NEXT_PUBLIC_MONGO_URL;
            if (!mongoUrl) throw new Error("MongoDB connection string is not defined");
            await mongoose.connect(mongoUrl);
            console.log("✅ Connected to MongoDB (Credentials)");
          }

          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password;

          const user = await User.findOne({ email });
          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          const passwordOk = await bcrypt.compare(password, user.password);
          if (!passwordOk) {
            console.log("❌ Invalid password");
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name || user.email,
            email: user.email,
            image: user.picture || null,
          };
        } catch (error) {
          console.error("🔥 Authorize error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image || null;

        try {
          if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("✅ Connected to MongoDB (JWT)");
          }

          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const newUser = await User.create({
              email: user.email,
              name: user.name || "Unnamed User",
              picture: user.image || "",
              password: randomPassword,
            });
            console.log("✅ Created new user (JWT):", newUser.email);
          }
        } catch (err) {
          console.error("❌ JWT DB sync error:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture || null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
