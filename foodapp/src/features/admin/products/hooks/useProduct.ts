/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateProduct, GetAllProducts, UploadImage } from "../apiOperations";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";
import { toast } from "sonner";

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: GetAllProducts,
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: UploadImage,
    onSuccess: (data) => {
      toast.success(GetApiResponseMessage(data));
    },
    onError: (error) => {
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateProduct,

    onMutate: async () => {
      // save previous data

      const previousProducts = queryClient.getQueryData(["products"]);
      return {
        previousProducts,
      };
    },

    onSuccess: (data) => {
      //Instant update data

      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [...old.data, data.data],
        };
      });

      queryClient.setQueryData(["product", data.data?.id], {
        data: data.data,
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error, _, context) => {
      // 🔄 Rollback (only if something breaks)
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }

      toast.error(GetApiErrorMessage(error));
    },
    onSettled: () => {
      // sync with server
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
