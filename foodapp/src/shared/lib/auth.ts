import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import NextAuth from "next-auth";

const { signIn, signOut, auth, handlers } = NextAuth(authOptions);

export { handlers, signIn, signOut, auth };
