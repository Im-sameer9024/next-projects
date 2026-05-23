import type { NextFunction, Request, Response } from "express";
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            role?: string;
        };
    }
}
declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const isUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const isTeacher: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export { auth, isUser, isTeacher };
//# sourceMappingURL=auth.middleware.d.ts.map