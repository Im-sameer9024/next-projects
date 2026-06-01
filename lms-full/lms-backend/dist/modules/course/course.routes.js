import { auth, isTeacher, isUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import express from "express";
import { CreateCourseSchema } from "./course.validation.js";
import { CreateCourse, DashboardDataForUser, DeleteCourseById, GetAllCourses, GetAllCoursesForUser, GetAnalyticsForTeacher, GetCourseByTeacherId, GetProgressOfCourse, GetSingleCourseForUser, PublishedCourse, UnpublishedCourse, UpdateSingleCourse, UploadThumbnail, } from "./course.controllers.js";
import { AiCourseDescription, AiCourseTitles } from "./ai.controllers.js";
import { upload } from "../../middlewares/multer.middleware.js";
const route = express.Router();
//------------------------------- TEACHER ROLE ROUTES -------------------------------------------------
route.post("/create", auth, isTeacher, validate(CreateCourseSchema), CreateCourse);
route.patch("/update/:courseId", auth, isTeacher, UpdateSingleCourse);
route.get("/all", auth, isTeacher, GetAllCourses);
route.get("/analytics", auth, isTeacher, GetAnalyticsForTeacher);
route.get("/:courseId", auth, isTeacher, GetCourseByTeacherId);
route.delete("/delete/:courseId", auth, isTeacher, DeleteCourseById);
route.post("/upload-image", auth, isTeacher, upload.single("image"), UploadThumbnail);
route.patch("/publish/:courseId", auth, isTeacher, PublishedCourse);
route.patch("/unpublish/:courseId", auth, isTeacher, UnpublishedCourse);
//------------------------------- USER ROLE ROUTES -------------------------------------------------
route.get("/user/all-courses", auth, isUser, GetAllCoursesForUser);
route.post("/get-progress", auth, isUser, GetProgressOfCourse);
route.get("/user/dashboard-data", auth, isUser, DashboardDataForUser);
route.get("/user/:courseId", auth, isUser, GetSingleCourseForUser);
route.post("/ai/title", auth, isTeacher, AiCourseTitles);
route.post("/ai/description", auth, isTeacher, AiCourseDescription);
export default route;
//# sourceMappingURL=course.routes.js.map