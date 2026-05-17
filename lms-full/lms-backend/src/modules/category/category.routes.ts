import { auth, isTeacher } from "@/middlewares/auth.middleware";
import express from "express";
import { CreateCategory, GetAllCategories } from "./category.controllers";

const route = express.Router();

route.get("/get-all-categories", auth, GetAllCategories);
route.post("/create",auth,isTeacher,CreateCategory)

export default route;
