import express from "express";
import { ChapterVideoWebhook } from "./chapter.controllers.js";
const route = express.Router();
route.post("/", ChapterVideoWebhook);
export default route;
//# sourceMappingURL=mux.routes.js.map