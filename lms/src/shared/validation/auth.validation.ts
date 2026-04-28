import { z } from "zod";
import { actualRoles } from "../data/data";

export const SignUpSchemaValidation = z.object({
  name: z
    .string()
    .min(3, { message: "username should be at least 3 characters" })
    .max(20, { message: "username should be at most 20 characters" }),
  email: z.email(),
  password: z
    .string()
    .min(6, {
      message: "password should be at least 6 characters",
    })
    .max(18, {
      message: "password should be at most 18 characters",
    }),
  role: z.enum(actualRoles),
});

export const SignInSchemaValidation = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, {
      message: "password should be at least 6 characters",
    })
    .max(18, {
      message: "password should be at most 18 characters",
    }),
});

export type SignUpSchemaValidationTypes = z.infer<
  typeof SignUpSchemaValidation
>;

export type SignInSchemaValidationTypes = z.infer<
  typeof SignInSchemaValidation
>;
