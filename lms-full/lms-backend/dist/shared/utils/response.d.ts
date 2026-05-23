import type { ApiResponseType } from "../types/response.js";
import type { Response } from "express";
export declare const SendResponse: <T>(res: Response, { statusCode, success, message, data, error, pagination, }: {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
    pagination?: ApiResponseType["pagination"];
}) => Response;
//# sourceMappingURL=response.d.ts.map