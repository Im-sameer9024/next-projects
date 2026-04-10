import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    username: string
    isVerified: boolean
    isAcceptingMessage: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      username: string
      isVerified: boolean
      isAcceptingMessage: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    username: string
    isVerified: boolean
    isAcceptingMessage: boolean
  }
}
