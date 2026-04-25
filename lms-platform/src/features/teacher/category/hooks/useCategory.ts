import { useQuery } from "@tanstack/react-query";
import { GetCourseCategories } from "../apiOperations";

export const useGetAllCategory = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: GetCourseCategories,
  });
};
