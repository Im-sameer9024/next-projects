import { useMutation } from "@tanstack/react-query";
import { GenerateCourseDescription, GenerateCourseTitles } from "../apiOperations";
import { toast } from "sonner";

export const useAiCourseTitles = () => {
  return useMutation({
    mutationFn: async (text: string) => {
      const response = await GenerateCourseTitles(text);

      return response?.data || [];
    },

    onError: (error) => {
      console.error("Generate Titles Error:", error);

      toast.error("Failed to generate titles");
    },

    retry: 1,

    networkMode: "always",
  });
};

export const useAiCourseDescription = () => {
  return useMutation({
    mutationFn: async (title: string) => {
      const response = await GenerateCourseDescription(title);

      return response?.data || "";
    },

    onError: (error) => {
      console.error("Generate Description Error:", error);

      toast.error("Failed to generate description");
    },

    retry: 1,

    networkMode: "always",
  });
};
