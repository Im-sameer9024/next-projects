import { prisma } from "@/config/prisma";
import { cookieOptions } from "@/constants";
import { registerEmailTemplate } from "@/shared/templates/registerEmailTemplate";
import { asyncHandler } from "@/shared/utils/async-handler";
import {
  ComparePassword,
  DecodeToken,
  GenerateAccessToken,
  GenerateRefreshToken,
  HashedPassword,
} from "@/shared/utils/helpers";
import { SendResponse } from "@/shared/utils/response";
import { SendEmail } from "@/shared/utils/send-email";
import type { CookieOptions, NextFunction, Request, Response } from "express";
import { FindUniqueUserByEmail } from "./auth.services";
import { logger } from "@/middlewares/logger.middleware";
import { Roles } from "@/generated/prisma/enums";

const SignUp = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password,role } = req.body;

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
      role:role
    },
  });

  const finalUser = await prisma.user.findFirst({
    where: {
      id: newUser.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

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

const LogIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await FindUniqueUserByEmail(email); //------- auth services ------

  if (!user) {
    return SendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not Registered",
    });
  }

  const isPasswordValid = await ComparePassword(
    password,
    user.password as string,
  );

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const createdUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
    },
  });

  if (isPasswordValid) {
    const accessToken = await GenerateAccessToken(payload);
    const refreshToken = await GenerateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, cookieOptions as CookieOptions);

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        user: createdUser,
      },
    });
  }
});

const RefreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return SendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized User",
    });
  }

  let decode;
  const secretKey = process.env.REFRESH_TOKEN_SECRET as string;

  try {
    decode = await DecodeToken({
      token: refreshToken,
      secret: secretKey,
    });
  } catch (error) {
    return SendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid refresh token",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: decode.id,
    },
  });

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
  };

  const newAccessToken = await GenerateAccessToken(payload);

  const user = await prisma.user.findFirst({
    where: {
      id: existingUser.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
    },
  });

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

const LogOut = asyncHandler(async (req: Request, res: Response) => {
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
      secret: process.env.REFRESH_TOKEN_SECRET as string,
    });
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions as CookieOptions);

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged out successfully",
    });
  }

  res.clearCookie("refreshToken", cookieOptions as CookieOptions);

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged out successfully",
  });
});

const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = await GenerateAccessToken(payload);
  const refreshToken = await GenerateRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, cookieOptions as CookieOptions);

  if (user.role === Roles.TEACHER) {
    res.redirect(`${process.env.CLIENT_URL}/teacher}`);
  }

  res.redirect(`${process.env.CLIENT_URL}/user`);
});

export { SignUp, LogIn, RefreshAccessToken, LogOut, googleCallback };
