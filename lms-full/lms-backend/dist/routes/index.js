import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import courseRoutes from "@/modules/course/course.routes";
import categoryRoutes from "@/modules/category/category.routes";
import attachmentRoutes from "@/modules/attachments/attachment.routes";
import chapterRoutes from "@/modules/chapter/chapter.routes";
const routes = Router();
routes.use("/auth", authRoutes);
routes.use("/course", courseRoutes);
routes.use("/category", categoryRoutes);
routes.use("/attachment", attachmentRoutes);
routes.use("/chapter", chapterRoutes);
export default routes;
//# sourceMappingURL=index.js.map