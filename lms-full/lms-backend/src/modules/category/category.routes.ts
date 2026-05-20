import { validate } from '@/middlewares/validate.middleware';
import { auth, isTeacher } from "@/middlewares/auth.middleware";
import express from "express";
import { CreateCategory, GetAllCategories } from "./category.controllers";
import { CreateCategorySchema } from './category.validation';

const route = express.Router();

route.get("/get-all-categories", auth, GetAllCategories);
route.post("/create",auth,isTeacher,validate(CreateCategorySchema),CreateCategory)

export default route;
