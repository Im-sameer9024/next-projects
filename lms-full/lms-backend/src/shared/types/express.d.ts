import type { PayloadProps } from "@/modules/auth/auth";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | PayloadProps;
    }
  }
}

export {};