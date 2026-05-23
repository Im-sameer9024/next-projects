export declare const FindUniqueCourseById: (courseId: string, teacherId: string) => Promise<({
    attachments: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        attachment_doc: string | null;
        attachment_public_id: string | null;
    }[];
    chapters: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        isPublished: boolean;
        courseId: string;
        isProcessingVideo: boolean;
        videoUrl: string | null;
        isFree: boolean;
    }[];
    purchases: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    image: string | null;
    image_public_id: string | null;
    price: string | null;
    isPublished: boolean;
    teacherId: string;
    categoryId: string | null;
}) | null>;
export declare const DeleteUniqueCourseById: (courseId: string, teacherId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    image: string | null;
    image_public_id: string | null;
    price: string | null;
    isPublished: boolean;
    teacherId: string;
    categoryId: string | null;
}>;
export declare const FindAllCoursesByTeacherId: (teacherId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    image: string | null;
    image_public_id: string | null;
    price: string | null;
    isPublished: boolean;
    teacherId: string;
    categoryId: string | null;
}[]>;
//# sourceMappingURL=course.services.d.ts.map