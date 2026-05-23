import type { NextFunction, Request, Response } from "express";
declare const SignUp: (req: Request, res: Response, next: NextFunction) => void;
declare const LogIn: (req: Request, res: Response, next: NextFunction) => void;
declare const RefreshAccessToken: (req: Request, res: Response, next: NextFunction) => void;
declare const LogOut: (req: Request, res: Response, next: NextFunction) => void;
declare const googleCallback: (req: Request, res: Response, next: NextFunction) => void;
export { SignUp, LogIn, RefreshAccessToken, LogOut, googleCallback };
//# sourceMappingURL=auth.controllers.d.ts.map