"use client";

import { useMutation } from "@tanstack/react-query";

import { generateCourseDescription } from "@/shared/ai/ai.services";

export const useAiCourseDescription = () => {
  return useMutation({
    mutationFn: async (title: string) => {
      return generateCourseDescription(title);
    },
  });
};
