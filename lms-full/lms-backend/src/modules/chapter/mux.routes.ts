import express from "express";
import { ChapterVideoWebhook } from "./chapter.controllers";

const route = express.Router();

route.post("/", ChapterVideoWebhook);

export default route;
