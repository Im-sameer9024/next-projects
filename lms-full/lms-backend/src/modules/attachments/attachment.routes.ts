import { auth, isTeacher } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";
import express from "express";
import { CreateAttachment, DeleteAttachment } from "./attachment.controllers";
import { validate } from "@/middlewares/validate.middleware";
import {
  CreateAttachmentSchema,
  DeleteAttachmentSchema,
} from "./attachment.validation";

const route = express.Router();

//------------------------------- TEACHER ROLE ROUTES -------------------------------------------------

route.post(
  "/create",
  auth,
  isTeacher,
  upload.single("file"),
  validate(CreateAttachmentSchema),
  CreateAttachment,
);
route.post(
  "/delete",
  auth,
  isTeacher,
  validate(DeleteAttachmentSchema),
  DeleteAttachment,
);

export default route;
