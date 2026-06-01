import z from "zod";

export const SignUpValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(25, "Name must be at most 25 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  role: z.enum(["USER", "TEACHER"], { message: "Role is required" }),
});

export const LoginValidationSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export type SignUpSchemaValidationTypes = z.infer<typeof SignUpValidationSchema>;
export type LoginSchemaValidationTypes = z.infer<typeof LoginValidationSchema>;
