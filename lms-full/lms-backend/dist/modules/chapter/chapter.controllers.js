import mux from "../../config/mux.config.js";
import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { SendResponse } from "../../shared/utils/response.js";
export const CreateChapter = asyncHandler(async (req, res) => {
    const { title, courseId } = req.body;
    const chapter = await prisma.chapter.create({
        data: {
            title,
            course: {
                connect: {
                    id: courseId,
                },
            },
        },
    });
    return SendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Chapter created successfully",
        data: chapter,
    });
});
export const DeleteChapter = asyncHandler(async (req, res) => {
    const { chapterId, courseId } = req.body;
    const chapter = await prisma.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId,
        },
        include: {
            muxData: true,
        },
    });
    if (!chapter) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Chapter not found",
        });
    }
    if (chapter.muxData && chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData?.assetId);
        await prisma.muxData.delete({
            where: {
                chapterId: chapterId,
            },
        });
    }
    const deleteChapter = await prisma.chapter.delete({
        where: {
            id: chapterId,
            courseId: courseId,
        },
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter deleted successfully",
        data: deleteChapter,
    });
});
export const UpdateChapter = asyncHandler(async (req, res) => {
    const { chapterId, courseId, ...values } = req.body;
    const chapter = await prisma.chapter.findFirst({
        where: {
            id: chapterId,
            courseId: courseId,
        },
    });
    if (!chapter) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Chapter not found",
        });
    }
    const updateChapter = await prisma.chapter.update({
        where: {
            id: chapterId,
            courseId: courseId,
        },
        data: {
            ...values,
        },
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter updated successfully",
        data: updateChapter,
    });
});
export const PublishChapter = asyncHandler(async (req, res) => {
    const { chapterId, courseId } = req.body;
    if (!chapterId || !courseId) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Chapter id and course id is required",
        });
    }
    const chapter = await prisma.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId,
        },
    });
    if (!chapter) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Chapter not found",
        });
    }
    const muxData = await prisma.muxData.findUnique({
        where: {
            chapterId: chapterId,
        },
    });
    if (!chapter ||
        !muxData ||
        !chapter.title ||
        !chapter.description ||
        !chapter.videoUrl) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Chapter is not ready to publish",
        });
    }
    const publishedChapter = await prisma.chapter.update({
        where: {
            id: chapterId,
            courseId: courseId,
        },
        data: {
            isPublished: true,
        },
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter published successfully",
        data: publishedChapter,
    });
});
export const UnPublishChapter = asyncHandler(async (req, res) => {
    const { chapterId, courseId } = req.body;
    if (!chapterId || !courseId) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Chapter id and course id is required",
        });
    }
    const unpublishedChapter = await prisma.chapter.update({
        where: {
            id: chapterId,
            courseId: courseId,
        },
        data: {
            isPublished: false,
        },
    });
    const publishedChapterInCourse = await prisma.chapter.findMany({
        where: {
            courseId: courseId,
            isPublished: true,
        },
    });
    if (!publishedChapterInCourse.length) {
        await prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                isPublished: false,
            },
        });
    }
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter unpublished successfully",
        data: unpublishedChapter,
    });
});
export const GetChapterById = asyncHandler(async (req, res) => {
    const { chapterId } = req.params;
    if (!chapterId) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Chapter id is required",
        });
    }
    const chapter = await prisma.chapter.findUnique({
        where: {
            id: chapterId,
        },
        include: {
            muxData: true,
        },
    });
    if (!chapter) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Chapter not found",
        });
    }
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter fetch successfully",
        data: chapter,
    });
});
export const UploadChapterVideo = asyncHandler(async (req, res) => {
    const { chapterId } = req.body;
    const upload = await mux.video.uploads.create({
        new_asset_settings: {
            playback_policies: ["public"],
            passthrough: chapterId,
        },
        cors_origin: "*",
    });
    return SendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Chapter video upload successfully",
        data: {
            uploadUrl: upload.url,
            uploadId: upload.id,
        },
    });
});
export const DeleteChapterVideo = asyncHandler(async (req, res) => {
    const { chapterId } = req.body;
    const muxData = await prisma.muxData.findUnique({
        where: {
            chapterId: chapterId,
        },
    });
    if (!muxData) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Chapter video not found",
        });
    }
    await mux.video.assets.delete(muxData.assetId);
    await prisma.muxData.delete({
        where: {
            chapterId: chapterId,
        },
    });
    await prisma.chapter.update({
        where: {
            id: chapterId,
        },
        data: {
            videoUrl: null,
            isProcessingVideo: false,
        },
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter video deleted successfully",
    });
});
export const SaveChapterVideo = asyncHandler(async (req, res) => {
    const { uploadId, chapterId } = req.body;
    const upload = await mux.video.uploads.retrieve(uploadId);
    const assetId = upload.asset_id;
    console.log("------------------- upload--------------", upload);
    if (!assetId) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Asset id not found",
        });
    }
    // save assetId to chapter
    const muxData = await prisma.muxData.upsert({
        where: {
            chapterId: chapterId,
        },
        update: {
            assetId: assetId,
        },
        create: {
            assetId: assetId,
            chapterId: chapterId,
        },
    });
    await prisma.chapter.update({
        where: {
            id: chapterId,
        },
        data: {
            isProcessingVideo: true,
            videoUrl: null,
        },
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chapter video saved successfully",
        data: muxData,
    });
});
export const ChapterVideoWebhook = asyncHandler(async (req, res) => {
    const rawBody = req.body.toString("utf8");
    try {
        // ✅ Verify webhook signature
        await mux.webhooks.verifySignature(rawBody, req.headers, process.env.MUX_WEBHOOK_SECRET);
    }
    catch (error) {
        console.error("Invalid webhook signature:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid signature",
        });
    }
    const event = JSON.parse(rawBody);
    // ✅ Video processing completed
    if (event.type === "video.asset.ready") {
        const asset = event.data;
        const playbackId = asset.playback_ids?.[0]?.id;
        const assetId = asset.id;
        const chapterId = asset.passthrough;
        if (!playbackId) {
            return res.status(400).json({
                success: false,
                message: "PlaybackId not found",
            });
        }
        // ✅ Find existing muxData
        const existingMuxData = await prisma.muxData.findFirst({
            where: {
                assetId,
            },
        });
        // ✅ Create or update muxData
        const muxData = existingMuxData ??
            (chapterId
                ? await prisma.muxData.upsert({
                    where: {
                        chapterId,
                    },
                    update: {
                        assetId,
                    },
                    create: {
                        assetId,
                        chapterId,
                    },
                })
                : null);
        if (!muxData) {
            return res.status(200).json({
                success: true,
                message: "No muxData found",
            });
        }
        // ✅ Save playbackId
        await prisma.muxData.update({
            where: {
                id: muxData.id,
            },
            data: {
                playbackId,
            },
        });
        // ✅ Update chapter video url
        await prisma.chapter.update({
            where: {
                id: muxData.chapterId,
            },
            data: {
                videoUrl: playbackId,
                isProcessingVideo: false,
            },
        });
    }
    return res.status(200).json({
        received: true,
    });
});
//# sourceMappingURL=chapter.controllers.js.map