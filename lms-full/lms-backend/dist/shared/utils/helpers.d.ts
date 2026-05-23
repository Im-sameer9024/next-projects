import type { PayloadProps } from "../../modules/auth/auth.js";
export declare const HashedPassword: (password: string) => Promise<string>;
export declare const ComparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const GenerateAccessToken: (payload: PayloadProps) => Promise<string>;
export declare const GenerateRefreshToken: (payload: PayloadProps) => Promise<string>;
export declare const DecodeToken: ({ token, secret, }: {
    token: string;
    secret: string;
}) => Promise<PayloadProps>;
//# sourceMappingURL=helpers.d.ts.map