import express from "express";
import { googleCallback, LogIn, LogOut, RefreshAccessToken, SignUp, } from "./auth.controllers";
import { validate } from "@/middlewares/validate.middleware";
import { LoginValidationSchema, SignUpValidationSchema, } from "./auth.validation";
import passport from "passport";
import { auth } from "@/middlewares/auth.middleware";
const route = express.Router();
route.post("/signup", validate(SignUpValidationSchema), SignUp);
route.post("/login", validate(LoginValidationSchema), LogIn);
route.get("/refresh-token", RefreshAccessToken);
route.get("/logout", auth, LogOut);
route.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}));
route.get("/callback/google", passport.authenticate("google", {
    session: false,
}), googleCallback);
export default route;
//# sourceMappingURL=auth.routes.js.map