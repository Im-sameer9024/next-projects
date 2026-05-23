import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const HashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};
export const ComparePassword = async (password, hashedPassword) => {
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatch;
};
export const GenerateAccessToken = async (payload) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    };
    return jwt.sign(payload, secret, options);
};
export const GenerateRefreshToken = async (payload) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    };
    return jwt.sign(payload, secret, options);
};
export const DecodeToken = async ({ token, secret, }) => {
    return jwt.verify(token, secret);
};
//# sourceMappingURL=helpers.js.map