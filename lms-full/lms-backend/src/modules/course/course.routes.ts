import { auth, isTeacher } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import express from "express";
import { CreateCourseSchema } from "./course.validation";
import {
  CreateCourse,
  GetCourseByTeacherId,
  UpdateSingleCourse,
  UploadThumbnail,
} from "./course.controllers";
import { AiCourseTitles } from "./ai.controllers";
import { upload } from "@/middlewares/multer.middleware";

const route = express.Router();

//------------------------------- TEACHER ROLE ROUTES -------------------------------------------------

route.post(
  "/create",
  auth,
  isTeacher,
  validate(CreateCourseSchema),
  CreateCourse,
);
route.patch("/update/:courseId", auth, isTeacher, UpdateSingleCourse);

route.get("/:courseId", auth, isTeacher, GetCourseByTeacherId);
route.post(
  "/upload-image",
  auth,
  isTeacher,
  upload.single("image"),
  UploadThumbnail,
);

// ai routes

route.post("/ai/title", auth, isTeacher, AiCourseTitles);

export default route;
