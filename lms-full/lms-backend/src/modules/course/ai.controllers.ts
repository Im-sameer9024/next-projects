import { CourseTitlePrompt } from "../../constants/index.js";

import { asyncHandler } from "../../shared/utils/async-handler.js";

import type { Request, Response } from "express";

import { GenerateAiResult } from "../genai/genai.services.js";

import { SendResponse } from "../../shared/utils/response.js";

export const AiCourseTitles = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);
