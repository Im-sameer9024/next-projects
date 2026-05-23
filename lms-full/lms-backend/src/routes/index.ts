import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import courseRoutes from "../modules/course/course.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import attachmentRoutes from "../modules/attachments/attachment.routes.js";
import chapterRoutes from "../modules/chapter/chapter.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/course", courseRoutes);
routes.use("/category", categoryRoutes);
routes.use("/attachment",attachmentRoutes)
routes.use("/chapter",chapterRoutes)

export default routes;
