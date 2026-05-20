"use client";

import { useMutation } from "@tanstack/react-query";

import { generateChapterDescription } from "@/shared/ai/ai.services";

interface GenerateChapterDescriptionPayload {
  courseTitle: string;

  chapterTitle: string;
}

export const useAiChapterDescription =
  () => {
    return useMutation({
      mutationFn: async ({
        courseTitle,
        chapterTitle,
      }: GenerateChapterDescriptionPayload) => {
        return generateChapterDescription(
          {
            courseTitle,
            chapterTitle,
          },
        );
      },
    });
  };