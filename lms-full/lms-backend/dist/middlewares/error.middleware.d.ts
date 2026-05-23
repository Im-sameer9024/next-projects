import type { NextFunction, Request, Response } from "express";
export declare const errorMiddleware: (err: Error & {
    statusCode?: number;
}, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map