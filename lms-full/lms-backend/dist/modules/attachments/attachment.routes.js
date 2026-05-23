import { auth, isTeacher } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import express from "express";
import { CreateAttachment, DeleteAttachment } from "./attachment.controllers.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { CreateAttachmentSchema, DeleteAttachmentSchema, } from "./attachment.validation.js";
const route = express.Router();
//------------------------------- TEACHER ROLE ROUTES -------------------------------------------------
route.post("/create", auth, isTeacher, upload.single("file"), validate(CreateAttachmentSchema), CreateAttachment);
route.post("/delete", auth, isTeacher, validate(DeleteAttachmentSchema), DeleteAttachment);
export default route;
//# sourceMappingURL=attachment.routes.js.map