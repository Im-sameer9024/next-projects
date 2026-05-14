import type { ApiResponseType } from "@/types/response";
import type { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  {
    statusCode = 200,
    success = true,
    message,
    data,
    error,
    pagination,
  }: {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
    pagination?: ApiResponseType["pagination"];
  },
): Response => {
  const response: ApiResponseType<T> = {
    success,
    ...(message && { message }),
    ...(data && { data }),
    ...(error && { error }),
    ...(pagination && { pagination }),
  };

  return res.status(statusCode).json(response);
};
