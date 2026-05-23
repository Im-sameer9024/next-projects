import { prisma } from "@/config/prisma";
import { cookieOptions } from "@/constants";
import { registerEmailTemplate } from "@/shared/templates/registerEmailTemplate";
import { asyncHandler } from "@/shared/utils/async-handler";
import { ComparePassword, DecodeToken, GenerateAccessToken, GenerateRefreshToken, HashedPassword, } from "@/shared/utils/helpers";
import { SendResponse } from "@/shared/utils/response";
import { SendEmail } from "@/shared/utils/send-email";
import { FindUniqueUserByEmail, FindUniqueUserById } from "./auth.services";
import { logger } from "@/middlewares/logger.middleware";
import { Roles } from "@/generated/prisma/enums";
const SignUp = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await FindUniqueUserByEmail(email); //---- auth service-----
    //---------------------- check user exits or not -------------
    if (existingUser) {
        if (existingUser.googleId) {
            return SendResponse(res, {
                statusCode: 400,
                success: false,
                message: "User already exists with google account",
            });
        }
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "User already exists",
        });
    }
    const hashedPassword = await HashedPassword(password);
    const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;
    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            avatar: avatarUrl,
            role: role,
        },
    });
    const finalUser = await FindUniqueUserById(newUser.id);
    SendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: finalUser,
    });
    await SendEmail({
        email: email,
        title: "Welcome to our platform",
        body: registerEmailTemplate(name),
    });
});
const LogIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await FindUniqueUserByEmail(email); //------- auth services ------
    if (!user) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not Registered",
        });
    }
    if (!user.password) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Please login with Google",
        });
    }
    const isPasswordValid = await ComparePassword(password, user.password);
    if (!isPasswordValid) {
        return SendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Invalid email or password",
        });
    }
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    };
    const createdUser = await FindUniqueUserById(user.id);
    const accessToken = await GenerateAccessToken(payload);
    const refreshToken = await GenerateRefreshToken(payload);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            user: createdUser,
        },
    });
});
const RefreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return SendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized User",
        });
    }
    let decode;
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    try {
        decode = await DecodeToken({
            token: refreshToken,
            secret: secretKey,
        });
    }
    catch (error) {
        return SendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Invalid refresh token",
        });
    }
    const existingUser = await FindUniqueUserById(decode.id);
    if (!existingUser) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not Found",
        });
    }
    // generate Access Token
    const payload = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser?.avatar,
    };
    const newAccessToken = await GenerateAccessToken(payload);
    const user = await FindUniqueUserById(existingUser.id);
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        data: {
            accessToken: newAccessToken,
            user: user,
        },
        message: "Refresh token is valid",
    });
});
const LogOut = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return SendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized User",
        });
    }
    try {
        await DecodeToken({
            token: refreshToken,
            secret: process.env.REFRESH_TOKEN_SECRET,
        });
    }
    catch (error) {
        res.clearCookie("refreshToken", cookieOptions);
        return SendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged out successfully",
        });
    }
    res.clearCookie("refreshToken", cookieOptions);
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
    });
});
const googleCallback = asyncHandler(async (req, res) => {
    const user = req.user;
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    };
    const accessToken = await GenerateAccessToken(payload);
    const refreshToken = await GenerateRefreshToken(payload);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    if (user.role === Roles.TEACHER) {
        return res.redirect(`${process.env.CLIENT_URL}/teacher`);
    }
    return res.redirect(`${process.env.CLIENT_URL}/user`);
});
export { SignUp, LogIn, RefreshAccessToken, LogOut, googleCallback };
//# sourceMappingURL=auth.controllers.js.map