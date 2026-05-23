import { auth, isTeacher } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import express from "express";
import { CreateChapterSchema } from "./chapter.validation.js";
import {
  ChapterVideoWebhook,
  CreateChapter,
  DeleteChapter,
  DeleteChapterVideo,
  GetChapterById,
  PublishChapter,
  SaveChapterVideo,
  UnPublishChapter,
  UpdateChapter,
  UploadChapterVideo,
} from "./chapter.controllers.js";
import { AiChapterDescription } from "./ai.controllers.js";

const route = express.Router();

route.post(
  "/create",
  auth,
  isTeacher,
  validate(CreateChapterSchema),
  CreateChapter,
);
route.delete("/delete", auth, isTeacher, DeleteChapter);
route.post("/update", auth, isTeacher, UpdateChapter);
route.get("/get/:chapterId", auth, isTeacher, GetChapterById);

route.post("/mux/upload", auth, isTeacher, UploadChapterVideo);
route.post("/mux/save-video", auth, isTeacher, SaveChapterVideo);
route.post("/mux/delete-video", auth, isTeacher, DeleteChapterVideo);

route.post("/publish", auth, isTeacher, PublishChapter);
route.post("/unpublish", auth, isTeacher, UnPublishChapter);
route.post("/ai/description", auth, isTeacher, AiChapterDescription);

route.post("/", ChapterVideoWebhook);

export default route;
