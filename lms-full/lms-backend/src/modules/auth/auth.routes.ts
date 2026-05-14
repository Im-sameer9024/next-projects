import express from "express";
import { LogIn, RefreshAccessToken, SignUp } from "./auth.controllers";
import { validate } from "@/middlewares/validate.middleware";
import {
  LoginValidationSchema,
  SignUpValidationSchema,
} from "./auth.validation";

const route = express.Router();

route.post("/signup", validate(SignUpValidationSchema), SignUp);
route.post("/login", validate(LoginValidationSchema), LogIn);
route.get("/refresh-token",RefreshAccessToken)

export default route;
