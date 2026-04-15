/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiConnector } from "@/services/apiConnector";
import { categoryApiUrls } from "@/services/apiEndpoints";
import { CategoryDeleteProps } from "@/shared/types/category";
import {
  CategoryFormData,
} from "@/shared/validation/category.schema";

export const GetAllCategories = async () => {
  const response = await apiConnector({
    method: "GET",
    url: categoryApiUrls.GET_ALL_CATEGORIES,
  });
  return response.data;
};

export const GetCategory = async (categoryId: number) => {
  const response = await apiConnector({
    method: "GET",
    url: categoryApiUrls.GET_SINGLE_CATEGORIES(categoryId),
  });
  return response.data;
};

export const CreateCategory = async (data: CategoryFormData) => {
  const response = await apiConnector({
    method: "POST",
    url: categoryApiUrls.CREATE_CATEGORY,
    bodyData: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const UpdateCategory = async (data: FormData) => {
  const response = await apiConnector({
    method: "PUT",
    url: categoryApiUrls.UPDATE_CATEGORY,
    bodyData: data,
   
  });

  return response.data;
};

export const UpdateCategoryImage = async (data:any) => {
  const response = await apiConnector({
    method: "POST",
    url: categoryApiUrls.UPDATE_CATEGORY,
    bodyData: data,
  });

  return response.data;
};

export const DeleteCategory = async (data: CategoryDeleteProps) => {
  const response = await apiConnector({
    method: "DELETE",
    url: categoryApiUrls.DELETE_CATEGORY,
    bodyData: data,
  });

  return response.data;
};
