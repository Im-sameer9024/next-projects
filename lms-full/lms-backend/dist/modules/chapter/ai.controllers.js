import { ChapterDescriptionPrompt } from "../../constants/index.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { SendResponse } from "../../shared/utils/response.js";
import { GenerateAiText } from "../genai/genai.services.js";
export const AiChapterDescription = asyncHandler(async (req, res) => {
    const { courseTitle, chapterTitle } = req.body;
    if (!courseTitle || !chapterTitle) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Course title and chapter title are required",
        });
    }
    const description = await GenerateAiText(ChapterDescriptionPrompt({
        courseTitle,
        chapterTitle,
    }));
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "success",
        data: description,
    });
});
//# sourceMappingURL=ai.controllers.js.map