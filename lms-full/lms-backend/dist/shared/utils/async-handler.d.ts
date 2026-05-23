import type { NextFunction, Request, Response } from "express";
type AsyncHandlerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const asyncHandler: (fn: AsyncHandlerType) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=async-handler.d.ts.map