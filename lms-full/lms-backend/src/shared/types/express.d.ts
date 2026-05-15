import type { PayloadProps } from "@/modules/auth/auth";

declare global {
  namespace Express {
    interface User extends PayloadProps {}
  }
}

export {};
