import type { ApiResponseType } from "../types/response.js";
import type { Response } from "express";

export const SendResponse = <T>(
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
    ...(message !== undefined && { message }),

    ...(data !== undefined && { data }),

    ...(error !== undefined && { error }),

    ...(pagination !== undefined && { pagination }),
  };

  return res.status(statusCode).json(response);
};
