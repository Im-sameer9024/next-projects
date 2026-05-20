"use client";

import puter from "./puter";

import {
  courseTitlePrompt,
  courseDescriptionPrompt,
  chapterDescriptionPrompt,
} from "./prompts";

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
        model: "gpt-4o-mini",
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
        model: "gpt-4o-mini",
      },
    );

    return getTextContent(response.message?.content) ?? "";
  } catch (error) {
    console.log("Description AI Error:", error);

    return "";
  }
};

/* -------------------------------------------------------------------------- */
/*                         CHAPTER DESCRIPTION                                 */
/* -------------------------------------------------------------------------- */

interface GenerateChapterDescriptionProps {
  courseTitle: string;

  chapterTitle: string;
}

export const generateChapterDescription = async ({
  courseTitle,
  chapterTitle,
}: GenerateChapterDescriptionProps): Promise<string> => {
  try {
    const response = await puter.ai.chat(
      chapterDescriptionPrompt({
        courseTitle,
        chapterTitle,
      }),

      {
        model: "gpt-4o-mini",
      },
    );

    return getTextContent(response.message?.content) ?? "";
  } catch (error) {
    console.log("Chapter Description AI Error:", error);

    return "";
  }
};
