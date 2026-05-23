export declare const FindUniqueUserByEmail: (email: string) => Promise<{
    id: string;
    name: string;
    email: string;
    role: import("../../generated/prisma/enums").Roles;
    password: string | null;
    avatar: string | null;
    googleId: string | null;
    isVerified: boolean;
    verifyCode: string | null;
    verifyCodeExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const FindUniqueUserById: (id: string) => Promise<{
    id: string;
    name: string;
    email: string;
    role: import("../../generated/prisma/enums").Roles;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
//# sourceMappingURL=auth.services.d.ts.map