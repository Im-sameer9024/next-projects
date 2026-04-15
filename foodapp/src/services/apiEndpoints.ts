export const authApiUrls = {
  REGISTER_USER: "/api/register",
};

export const categoryApiUrls = {
  GET_ALL_CATEGORIES: "/api/categories",
  GET_SINGLE_CATEGORIES: (categoryId: number) =>
    `/api/categories/${categoryId}`,
  CREATE_CATEGORY: "/api/categories/create",
  DELETE_CATEGORY: "/api/categories/delete",
  UPDATE_CATEGORY: "/api/categories/update",
};

export const productApiUrls = {
  GET_ALL_PRODUCTS: "/api/products",
  CREATE_PRODUCT: "/api/products/create",
  DELETE_PRODUCT: "/api/products/delete",
  UPDATE_PRODUCT: "/api/products/update",
  UPload_IMAGE: "/api/products/image-upload",
};
