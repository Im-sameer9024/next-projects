import { validate } from "../../middlewares/validate.middleware.js";
import { auth, isTeacher } from "../../middlewares/auth.middleware.js";
import express from "express";
import { CreateCategory, GetAllCategories } from "./category.controllers.js";
import { CreateCategorySchema } from "./category.validation.js";
const route = express.Router();
route.get("/get-all-categories", auth, GetAllCategories);
route.post("/create", auth, isTeacher, validate(CreateCategorySchema), CreateCategory);
export default route;
//# sourceMappingURL=category.routes.js.map