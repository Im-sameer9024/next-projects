import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import courseRoutes from "@/modules/course/course.routes";
import categoryRoutes from "@/modules/category/category.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/course", courseRoutes);
routes.use("/category", categoryRoutes);

export default routes;
