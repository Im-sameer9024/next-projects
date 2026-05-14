import { asyncHandler } from "@/utils/async-handler";
import type { NextFunction, Request, Response } from "express";

const SignUp = asyncHandler(
  async (req: Request, res: Response, nextNext: NextFunction) => {
    const { name, email, password } = req.body;
  },
);

export { SignUp };
