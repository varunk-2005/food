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
          // ✅ Use correct env var name
          if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("✅ Connected to MongoDB");
          }

          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password;

          console.log("🔍 Checking login for:", email);

          const user = await User.findOne({ email });
          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          console.log("👤 Found user:", user.email);

          const passwordOk = await bcrypt.compare(password, user.password);
          console.log("🔐 Password match:", passwordOk);

          if (!passwordOk) {
            console.log("❌ Invalid password");
            return null;
          }

          console.log("✅ Login success");

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
    signIn: "/login", // Custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
