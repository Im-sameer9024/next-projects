import z from "zod";
export declare const SignUpValidationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        USER: "USER";
        TEACHER: "TEACHER";
    }>;
}, z.core.$strip>;
export declare const LoginValidationSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.validation.d.ts.map