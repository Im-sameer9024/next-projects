import { auth, isTeacher } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import express from "express";
import { CreateCourseSchema } from "./course.validation.js";
import { CreateCourse, DeleteCourseById, GetAllCourses, GetCourseByTeacherId, UpdateSingleCourse, UploadThumbnail, } from "./course.controllers.js";
import { AiCourseDescription, AiCourseTitles } from "./ai.controllers.js";
import { upload } from "../../middlewares/multer.middleware.js";
const route = express.Router();
//------------------------------- TEACHER ROLE ROUTES -------------------------------------------------
route.post("/create", auth, isTeacher, validate(CreateCourseSchema), CreateCourse);
route.patch("/update/:courseId", auth, isTeacher, UpdateSingleCourse);
route.get("/all", auth, isTeacher, GetAllCourses);
route.get("/:courseId", auth, isTeacher, GetCourseByTeacherId);
route.delete("/delete/:courseId", auth, isTeacher, DeleteCourseById);
route.post("/upload-image", auth, isTeacher, upload.single("image"), UploadThumbnail);
route.post("/ai/title", auth, isTeacher, AiCourseTitles);
route.post("/ai/description", auth, isTeacher, AiCourseDescription);
export default route;
//# sourceMappingURL=course.routes.js.map