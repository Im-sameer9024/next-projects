"use client";

import puter from "./puter";

import { courseTitlePrompt, courseDescriptionPrompt } from "./prompts";

const getTextContent = (content: unknown) => {
  return typeof content === "string" ? content : "";
};

/* -------------------------------------------------------------------------- */
/*                         COURSE TITLE GENERATOR                             */
/* -------------------------------------------------------------------------- */

export const generateCourseTitles = async (text: string): Promise<string[]> => {
  try {
    const response = await puter.ai.chat(
      courseTitlePrompt(text),

      {
        model: "gpt-5-nano",
      },
    );

    const textResponse = getTextContent(response.message?.content);

    const cleaned = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.log("AI Title Error:", error);

    return [];
  }
};

/* -------------------------------------------------------------------------- */
/*                         COURSE DESCRIPTION                                 */
/* -------------------------------------------------------------------------- */

export const generateCourseDescription = async (
  title: string,
): Promise<string> => {
  try {
    const response = await puter.ai.chat(
      courseDescriptionPrompt(title),

      {
        model: "gpt-5-nano",
      },
    );

    return getTextContent(response.message?.content) ?? "";
  } catch (error) {
    console.log("Description AI Error:", error);

    return "";
  }
};
