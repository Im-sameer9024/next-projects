import { Roles } from "../generated/prisma/enums.js";
import { DecodeToken } from "../shared/utils/helpers.js";
import { SendResponse } from "../shared/utils/response.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
const auth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return SendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Authorization header is required",
            });
        }
        const token = authHeader.replace("Bearer ", "");
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const decoded = await DecodeToken({
            token: token,
            secret: accessTokenSecret,
        });
        req.user = decoded;
        next();
    }
    catch (error) {
        // Token Expired
        if (error instanceof TokenExpiredError) {
            SendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Access token expired",
            });
            return;
        }
        // Invalid Token
        if (error instanceof JsonWebTokenError) {
            SendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Invalid access token",
            });
            return;
        }
        // Unknown Error
        SendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
const isUser = async (req, res, next) => {
    try {
        const role = req.user?.role;
        if (role !== Roles.USER) {
            return SendResponse(res, {
                statusCode: 401,
                success: false,
                message: "You are not authorized to access this route, It is for User",
            });
        }
        next();
    }
    catch (error) {
        SendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
const isTeacher = async (req, res, next) => {
    try {
        const role = req.user?.role;
        if (role !== Roles.TEACHER) {
            return SendResponse(res, {
                statusCode: 401,
                success: false,
                message: "You are not authorized to access this route , It is only for Teacher",
            });
        }
        next();
    }
    catch (error) {
        SendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
export { auth, isUser, isTeacher };
//# sourceMappingURL=auth.middleware.js.map