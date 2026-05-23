import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Course
 *
 */
export type Course = Prisma.CourseModel;
/**
 * Model Category
 *
 */
export type Category = Prisma.CategoryModel;
/**
 * Model Attachment
 *
 */
export type Attachment = Prisma.AttachmentModel;
/**
 * Model Chapter
 *
 */
export type Chapter = Prisma.ChapterModel;
/**
 * Model MuxData
 *
 */
export type MuxData = Prisma.MuxDataModel;
/**
 * Model Purchase
 *
 */
export type Purchase = Prisma.PurchaseModel;
/**
 * Model StripeCustomer
 *
 */
export type StripeCustomer = Prisma.StripeCustomerModel;
/**
 * Model UserProgress
 *
 */
export type UserProgress = Prisma.UserProgressModel;
//# sourceMappingURL=client.d.ts.map