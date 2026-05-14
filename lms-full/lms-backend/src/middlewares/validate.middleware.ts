import { SendResponse } from "@/shared/utils/response";
import type { NextFunction, Request, Response } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedData = schema.parse(req.body);

      req.body = parsedData;

      next();
    } catch (error: unknown) {
      console.error("Validation Middleware Error:", error);

      // Zod Validation Error
      if (error instanceof ZodError) {
        const formattedErrors = error.flatten().fieldErrors;

        SendResponse(res, {
          statusCode: 400,
          success: false,
          message: "Validation Error",
          error: "Invalid Request Data",
          data: formattedErrors,
        });

        return;
      }

      // Unknown Server Error
      SendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Something went wrong",
      });

      return;
    }
  };
