import * as runtime from "@prisma/client/runtime/index-browser";
export type * from "../models.js";
export type * from "./prismaNamespace.js";
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: new (secret: never) => typeof runtime.DbNull;
    JsonNull: new (secret: never) => typeof runtime.JsonNull;
    AnyNull: new (secret: never) => typeof runtime.AnyNull;
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Course: "Course";
    readonly Category: "Category";
    readonly Attachment: "Attachment";
    readonly Chapter: "Chapter";
    readonly MuxData: "MuxData";
    readonly Purchase: "Purchase";
    readonly StripeCustomer: "StripeCustomer";
    readonly UserProgress: "UserProgress";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly avatar: "avatar";
    readonly googleId: "googleId";
    readonly isVerified: "isVerified";
    readonly verifyCode: "verifyCode";
    readonly verifyCodeExpiry: "verifyCodeExpiry";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CourseScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly image: "image";
    readonly image_public_id: "image_public_id";
    readonly price: "price";
    readonly isPublished: "isPublished";
    readonly teacherId: "teacherId";
    readonly categoryId: "categoryId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const AttachmentScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly attachment_doc: "attachment_doc";
    readonly attachment_public_id: "attachment_public_id";
    readonly courseId: "courseId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AttachmentScalarFieldEnum = (typeof AttachmentScalarFieldEnum)[keyof typeof AttachmentScalarFieldEnum];
export declare const ChapterScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly isProcessingVideo: "isProcessingVideo";
    readonly videoUrl: "videoUrl";
    readonly isPublished: "isPublished";
    readonly isFree: "isFree";
    readonly courseId: "courseId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ChapterScalarFieldEnum = (typeof ChapterScalarFieldEnum)[keyof typeof ChapterScalarFieldEnum];
export declare const MuxDataScalarFieldEnum: {
    readonly id: "id";
    readonly assetId: "assetId";
    readonly playbackId: "playbackId";
    readonly chapterId: "chapterId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MuxDataScalarFieldEnum = (typeof MuxDataScalarFieldEnum)[keyof typeof MuxDataScalarFieldEnum];
export declare const PurchaseScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PurchaseScalarFieldEnum = (typeof PurchaseScalarFieldEnum)[keyof typeof PurchaseScalarFieldEnum];
export declare const StripeCustomerScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly stripeCustomerId: "stripeCustomerId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StripeCustomerScalarFieldEnum = (typeof StripeCustomerScalarFieldEnum)[keyof typeof StripeCustomerScalarFieldEnum];
export declare const UserProgressScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly isCompleted: "isCompleted";
    readonly chapterId: "chapterId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map