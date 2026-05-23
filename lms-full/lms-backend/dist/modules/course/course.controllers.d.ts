import type { Request, Response } from "express";
declare const CreateCourse: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const UpdateSingleCourse: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const GetCourseByTeacherId: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const DeleteCourseById: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const GetAllCourses: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const UploadThumbnail: (req: Request, res: Response, next: import("express").NextFunction) => void;
export { CreateCourse, UpdateSingleCourse, GetCourseByTeacherId, DeleteCourseById, GetAllCourses, UploadThumbnail };
//# sourceMappingURL=course.controllers.d.ts.map