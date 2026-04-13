import { apiConnector } from "@/services/apiConnector";
import { categoryApiUrls } from "@/services/apiEndpoints";

export const GetAllCategories = async () => {
  const response = await apiConnector({
    method: "GET",
    url: categoryApiUrls.GET_ALL_CATEGORIES,
  });
  return response.data;
};
