import { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/shared/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PasswordCompare } from "@/shared/helpers/password.helper";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("MISSING_FIELDS");
        }

        const email = (credentials.email as string).trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        if (!user.password) {
          throw new Error("NO_PASSWORD");
        }

        const isValid = await PasswordCompare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) {
          throw new Error("INVALID_PASSWORD");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          role: user.role,
          image: user.image || "",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.email = user?.email;
        token.name = user?.name;
        token.isVerified = user?.isVerified;
        token.role = user?.role;
        token.image = user?.image;
      }

      return token;
    },

    // attach token data to session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token?.id;
        session.user.email = token?.email;
        session.user.name = token?.name;
        session.user.isVerified = token?.isVerified;
        session.user.role = token?.role;
        session.user.image = token?.image;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};
