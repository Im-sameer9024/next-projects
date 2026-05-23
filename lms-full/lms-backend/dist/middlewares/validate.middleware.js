import { SendResponse } from "@/shared/utils/response";
import { ZodObject, ZodError } from "zod";
export const validate = (schema) => (req, res, next) => {
    try {
        const parsedData = schema.parse(req.body);
        req.body = parsedData;
        next();
    }
    catch (error) {
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
//# sourceMappingURL=validate.middleware.js.map