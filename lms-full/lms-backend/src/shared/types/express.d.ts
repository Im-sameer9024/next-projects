import type { PayloadProps } from "../../modules/auth/auth.js";

declare global {
  namespace Express {
    interface User extends PayloadProps {}
  }
}

export {};
