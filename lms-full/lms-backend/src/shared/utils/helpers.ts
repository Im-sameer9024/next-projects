import type { PayloadProps } from "../../modules/auth/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

export const HashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const ComparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatch;
};

export const GenerateAccessToken = async (
  payload: PayloadProps,
): Promise<string> => {
  const secret = process.env.ACCESS_TOKEN_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const GenerateRefreshToken = async (
  payload: PayloadProps,
): Promise<string> => {
  const secret = process.env.REFRESH_TOKEN_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const DecodeToken = async ({
  token,
  secret,
}: {
  token: string;
  secret: string;
}): Promise<PayloadProps> => {
  return jwt.verify(token, secret) as PayloadProps;
};
