import { auth, isTeacher } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import express from "express";
import { CreateCourseSchema } from "./course.validation";
import { CreateCourse, DeleteCourseById, GetAllCourses, GetCourseByTeacherId, UpdateSingleCourse, UploadThumbnail, } from "./course.controllers";
import { AiCourseTitles } from "./ai.controllers";
import { upload } from "@/middlewares/multer.middleware";
const route = express.Router();
//------------------------------- TEACHER ROLE ROUTES -------------------------------------------------
route.post("/create", auth, isTeacher, validate(CreateCourseSchema), CreateCourse);
route.patch("/update/:courseId", auth, isTeacher, UpdateSingleCourse);
route.get("/all", auth, isTeacher, GetAllCourses);
route.get("/:courseId", auth, isTeacher, GetCourseByTeacherId);
route.delete("/delete/:courseId", auth, isTeacher, DeleteCourseById);
route.post("/upload-image", auth, isTeacher, upload.single("image"), UploadThumbnail);
export default route;
//# sourceMappingURL=course.routes.js.map