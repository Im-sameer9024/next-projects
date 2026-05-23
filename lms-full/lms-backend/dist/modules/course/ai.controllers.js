import { CourseTitlePrompt } from "@/constants";
import { asyncHandler } from "@/shared/utils/async-handler";
import { GenerateAiResult } from "../genai/genai.services";
import { SendResponse } from "@/shared/utils/response";
export const AiCourseTitles = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text || text.length < 3) {
        return SendResponse(res, {
            statusCode: 200,
            success: true,
            message: "No suggestions",
            data: [],
        });
    }
    const prompt = CourseTitlePrompt(text);
    const titles = await GenerateAiResult(prompt);
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "success",
        data: titles,
    });
});
//# sourceMappingURL=ai.controllers.js.map