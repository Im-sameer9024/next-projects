"use client";

import puter from "@heyputer/puter.js";
import { chapterDescriptionPrompt, courseDescriptionPrompt, courseTitlePrompt } from "./prompts";

const PUTER_REQUEST_TIMEOUT_MS = 60_000;

const getTextContent = (content: unknown) => {
  return typeof content === "string" ? content : "";
};

const withTimeout = async <T>(promise: Promise<T>, label: string) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out. Please try again.`));
    }, PUTER_REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
};

/* -------------------------------------------------------------------------- */
/*                         COURSE TITLE GENERATOR                             */
/* -------------------------------------------------------------------------- */

export const generateCourseTitles = async (text: string): Promise<string[]> => {
  try {
    const response = await withTimeout(
      puter.ai.chat(courseTitlePrompt(text), {
        model: "gpt-4o-mini",
      }),
      "AI title generation",
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

export const generateCourseDescription = async (title: string): Promise<string> => {
  try {
    const response = await withTimeout(
      puter.ai.chat(courseDescriptionPrompt(title), {
        model: "gpt-4o-mini",
      }),
      "AI description generation",
    );

    return getTextContent(response.message?.content) ?? "";
  } catch (error) {
    console.log("Description AI Error:", error);

    throw error;
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
    const response = await withTimeout(
      puter.ai.chat(
        chapterDescriptionPrompt({
          courseTitle,
          chapterTitle,
        }),
        {
          model: "gpt-4o-mini",
        },
      ),
      "AI chapter description generation",
    );

    return getTextContent(response.message?.content) ?? "";
  } catch (error) {
    console.log("Chapter Description AI Error:", error);

    throw error;
  }
};
