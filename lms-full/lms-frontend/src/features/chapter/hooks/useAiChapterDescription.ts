"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { GenerateChapterDescription } from "../apiOperations";

interface GenerateChapterDescriptionPayload {
  courseTitle: string;
  chapterTitle: string;
}

export const useAiChapterDescription = () => {
  return useMutation({
    mutationFn: async ({ courseTitle, chapterTitle }: GenerateChapterDescriptionPayload) => {
      const response = await GenerateChapterDescription({
        courseTitle,
        chapterTitle,
      });

      // backend returns:
      // { success: true, data: "generated text" }

      return response?.data || "";
    },

    onError: (error) => {
      console.error("Generate Chapter Description Error:", error);

      toast.error("Failed to generate AI description");
    },

    retry: 1,

    networkMode: "always",
  });
};
