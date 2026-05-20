import { auth, isTeacher } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import express from "express";
import { CreateChapterSchema } from "./chapter.validation";
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
} from "./chapter.controllers";

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
route.get("/get/:chapterId",auth, isTeacher, GetChapterById);

route.post("/mux/upload",auth,isTeacher,UploadChapterVideo)
route.post("/mux/save-video",auth,isTeacher,SaveChapterVideo)
route.post("/mux/delete-video",auth,isTeacher,DeleteChapterVideo)

route.post("/publish",auth,isTeacher,PublishChapter)
route.post("/unpublish",auth,isTeacher,UnPublishChapter)

route.post("/",ChapterVideoWebhook)

export default route;
