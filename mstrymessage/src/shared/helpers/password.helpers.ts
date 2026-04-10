import bcrypt from "bcryptjs";

export const PasswordHashed = async(password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const PasswordCompare = async(password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
