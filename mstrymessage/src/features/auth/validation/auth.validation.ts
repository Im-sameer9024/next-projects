import z from "zod";

export const usernameValidation = z
  .string()
  .min(3, {
    message: "username should be at least 3 characters",
  })
  .max(20, {
    message: "username should be at most 20 characters",
  })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "username should only contain letters and numbers",
  })
  .trim();

export const passwordValidation = z
  .string()
  .min(6, {
    message: "Password should be at least 6 characters",
  })
  .max(20, {
    message: "Password should be at most 20 characters",
  })
  .trim();

export const emailValidation = z
  .string()
  .email({
    message: "Invalid email address",
  })
  .trim();

export const signupValidationSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export const signinValidationSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type SignUpSchemaProps = z.infer<typeof signupValidationSchema>;
export type SignInSchemaProps = z.infer<typeof signinValidationSchema>;
