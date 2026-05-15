import express from "express";
import {
  googleCallback,
  LogIn,
  RefreshAccessToken,
  SignUp,
} from "./auth.controllers";
import { validate } from "@/middlewares/validate.middleware";
import {
  LoginValidationSchema,
  SignUpValidationSchema,
} from "./auth.validation";
import passport from "passport";

const route = express.Router();

route.post("/signup", validate(SignUpValidationSchema), SignUp);
route.post("/login", validate(LoginValidationSchema), LogIn);
route.get("/refresh-token", RefreshAccessToken);

route.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

route.get(
  "/callback/google",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback,
);

export default route;
