import { cloudinary } from "../../config/cloudinary.js";
import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { SendResponse } from "../../shared/utils/response.js";
import { UploadFileToCloudinary } from "../../shared/utils/upload.js";
export const CreateAttachment = asyncHandler(async (req, res) => {
    const file = req.file;
    const { name, courseId } = req.body;
    if (!file) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Doc file is required",
        });
    }
    const uploadDoc = await UploadFileToCloudinary(file);
    const createAttachment = await prisma.attachment.create({
        data: {
            name: name,
            attachment_doc: uploadDoc?.secure_url,
            attachment_public_id: uploadDoc?.public_id,
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
        message: "Attachment created successfully",
        data: createAttachment,
    });
});
export const DeleteAttachment = asyncHandler(async (req, res) => {
    const { courseId, attachmentId } = req.body;
    console.log(req.body, "in controller");
    const attachment = await prisma.attachment.findUnique({
        where: {
            id: attachmentId,
            courseId: courseId,
        },
    });
    if (!attachment) {
        return SendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Attachment not found",
        });
    }
    const deletedAttachment = await prisma.attachment.delete({
        where: {
            id: attachment.id,
            courseId: attachment.courseId,
        },
    });
    // delete attachment from cloudinary
    await cloudinary.uploader.destroy(attachment?.attachment_public_id, (error) => {
        if (error) {
            return SendResponse(res, {
                statusCode: 500,
                success: false,
                message: "Error deleting attachment",
            });
        }
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Attachment deleted successfully",
        data: deletedAttachment,
    });
});
//# sourceMappingURL=attachment.controllers.js.map