import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    isVerified: boolean;
    role: string;
    image: string;
  }

  interface Credentials {
    email: string;
    password: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      isVerified: boolean;
      role: string;
      image: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    isVerified: boolean;
    role: string;
    image: string;
  }
}
