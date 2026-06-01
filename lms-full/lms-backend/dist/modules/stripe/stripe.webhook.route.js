import express from "express";
import { StripeWebhook } from "./stripe.controllers.js";
const route = express.Router();
route.post("/stripe/webhook", express.raw({
    type: "application/json",
}), StripeWebhook);
export default route;
//# sourceMappingURL=stripe.webhook.route.js.map