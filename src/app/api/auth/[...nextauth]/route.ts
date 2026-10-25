import NextAuth , { type NextAuthOptions }  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/lib/model/Doctor";
import bcrypt from "bcryptjs";

// const handler = NextAuth({
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const doctor = await Doctor.findOne({ email: credentials?.email });
        if (!doctor) throw new Error("Doctor not found");

        const isMatch = await bcrypt.compare(
          credentials!.password,
          doctor.password
        );
        if (!isMatch) throw new Error("Incorrect password");

        return {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
    return token;
  },

  async session({ session, token }) {
    if (token.user) {
      session.user = token.user;  // <-- now correctly typed
    }
    return session;
  },
},

};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
