import type { Request, Response } from "express";
export declare const CreateOrder: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const StripeWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=stripe.controllers.d.ts.map