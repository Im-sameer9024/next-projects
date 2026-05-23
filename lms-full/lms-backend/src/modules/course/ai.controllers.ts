import {
  CourseDescriptionPrompt,
  CourseTitlePrompt,
} from "../../constants/index.js";

import { asyncHandler } from "../../shared/utils/async-handler.js";

import type { Request, Response } from "express";

import { GenerateAiResult, GenerateAiText } from "../genai/genai.services.js";

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

export const AiCourseDescription = asyncHandler(
  async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title || title.trim().length < 3) {
      return SendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Course title is required",
      });
    }

    const description = await GenerateAiText(CourseDescriptionPrompt(title));

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "success",
      data: description,
    });
  },
);
