import { useQuery } from "@tanstack/react-query";
import { GetCategories } from "../apiOperations";



export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: GetCategories,
  });
};