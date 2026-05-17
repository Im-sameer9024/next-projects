export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // optional
  avatar?: string; // optional
  googleId?: string; // optional

  isVerified: boolean;
  verifyCode?: string; // optional
  verifyCodeExpiry?: Date; // optional

  role: Roles; // enum type (USER, ADMIN, etc.)

  courses: Course[]; // relation to Course[]

  createdAt: Date;
  updatedAt: Date;
}
