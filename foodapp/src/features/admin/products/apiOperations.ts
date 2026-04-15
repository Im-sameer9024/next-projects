import { apiConnector } from "@/services/apiConnector";
import { productApiUrls } from "@/services/apiEndpoints";
import {
  imageUploadSchemaProps,
  productCreateSchemaProps,
} from "@/shared/validation/product.schema";

export const GetAllProducts = async () => {
  const response = await apiConnector({
    method: "GET",
    url: productApiUrls.GET_ALL_PRODUCTS,
  });
  return response.data;
};

export const UploadImage = async (data: imageUploadSchemaProps) => {
  const response = await apiConnector({
    method: "POST",
    url: productApiUrls.UPlOAD_IMAGE,
    bodyData: data,
     headers:{
      "Content-Type": "multipart/form-data",
    }
  });

  return response.data;
};

export const CreateProduct = async (data: productCreateSchemaProps) => {
  const response = await apiConnector({
    method: "POST",
    url: productApiUrls.CREATE_PRODUCT,
    bodyData: data,
     headers:{
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
};
