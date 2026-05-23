"use client";

import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";

import { generateCourseTitles } from "@/shared/ai/ai.services";

const getTitleSuggestions = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  );
};

export const useAiCourseTitles = (text: string) => {
  const searchText = text.trim();

  return useQuery({
    queryKey: ["ai-course-titles", searchText],

    queryFn: async () => {
      const titles = await generateCourseTitles(searchText);

      return getTitleSuggestions(titles);
    },

    enabled: searchText.length >= 3,

    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCourseTitleSuggestions = (title: string) => {
  const normalizedTitle = title.trim();

  const [debouncedTitle, debouncer] = useDebouncedValue(
    normalizedTitle,
    {
      wait: 600,
    },
    (state) => ({
      isPending: state.isPending,
    }),
  );

  const query = useAiCourseTitles(debouncedTitle);

  return {
    ...query,
    suggestions: normalizedTitle.length >= 3 ? (query.data ?? []) : [],
    isGenerating:
      normalizedTitle.length >= 3 &&
      (debouncer.state.isPending || query.isFetching),
  };
};





