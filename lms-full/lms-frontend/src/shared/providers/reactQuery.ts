import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 🔁 Retry failed requests (good for unstable networks)
        retry: 2,

        // ⏱️ Time before data becomes stale
        staleTime: 1000 * 60 * 5, // 5 minutes

        // 🧠 Cache time (garbage collection)
        gcTime: 1000 * 60 * 30, // 30 minutes

        // 🚫 Avoid refetch on tab switch (optional)
        refetchOnWindowFocus: false,

        // 🔄 Refetch when reconnecting internet
        refetchOnReconnect: true,

        // 📡 Refetch on mount only if stale
        refetchOnMount: "always",

        // 🧩 Enable background updates
        refetchInterval: false,

        // ⚡ Reduce unnecessary re-renders
        structuralSharing: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};
