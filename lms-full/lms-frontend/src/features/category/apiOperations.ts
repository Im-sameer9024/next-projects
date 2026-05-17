import { apiConnector } from "@/services/apiConnector";
import { categoryApiEndpoints } from "@/services/apiEndPoints";

export const GetAllCategories = async () => {
  const response = await apiConnector({
    method: "GET",
    url: categoryApiEndpoints.GET_ALL_CATEGORIES,
  });
  return response.data;
};
