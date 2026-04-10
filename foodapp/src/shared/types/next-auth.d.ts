// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {

    interface User {
        role?:string;
    }
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}