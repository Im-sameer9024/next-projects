import { useQuery } from "@tanstack/react-query";
import { GetAnalyticsData } from "./apiOperations";

export const useGetAnalyticsData = () => {
  return useQuery({
    queryKey: ["teacher-analytics"],
    queryFn: GetAnalyticsData,
  });
};
