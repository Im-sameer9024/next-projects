import express from "express";
import { CreateOrder, StripeWebhook } from "./stripe.controllers.js";
import { auth, isUser } from "../../middlewares/auth.middleware.js";
const route = express.Router();
route.post("/orders/:courseId", auth, isUser, CreateOrder);
export default route;
//# sourceMappingURL=stripe.routes.js.map