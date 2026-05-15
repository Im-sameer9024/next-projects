import ms, { type StringValue } from "ms";

const REFRESH_TOKEN_EXPIRES_IN = process.env
  .REFRESH_TOKEN_EXPIRES_IN as StringValue;

const maxAge = ms(REFRESH_TOKEN_EXPIRES_IN);

console.log(maxAge)

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge,
  path: "/",
};
