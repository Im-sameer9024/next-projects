"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateCategory,
  DeleteCategory,
  GetAllCategories,
  GetCategory,
  UpdateCategory,
  UpdateCategoryImage,
} from "../apiOperations";
import { toast } from "sonner";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: GetAllCategories,
  });
};

export const useGetCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => GetCategory(categoryId),
    enabled: !!categoryId,
  });
};

//------- rollback use if error occur then don't show the added catgory ------

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreateCategory,

    onMutate: async () => {
      // save previous data

      const previousCategories = queryClient.getQueryData(["categories"]);

      return {
        previousCategories,
      };
    },

    onSuccess: (data) => {
      // Instant update data

      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [data.data, ...old.data],
        };
      });

      // cache single category
      queryClient.setQueryData(["category", data.data?.id], {
        data: data.data,
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error, _, context) => {
      // 🔄 Rollback (only if something breaks)
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }

      toast.error(GetApiErrorMessage(error));
    },

    onSettled: () => {
      // sync with server
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteCategory,

    // 🧠 Save previous state (for rollback safety)
    onMutate: async () => {
      const previousCategories = queryClient.getQueryData(["categories"]);
      return { previousCategories };
    },

    // ✅ Update UI after success (simple & predictable)
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.filter(
            (item: any) => item.id !== variables.categoryId,
          ),
        };
      });

      // remove single category cache
      queryClient.removeQueries({
        queryKey: ["category", variables?.categoryId],
      });

      toast.success(GetApiResponseMessage(data));
    },

    // 🔄 Rollback if something fails
    onError: (error, _, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }

      toast.error(GetApiErrorMessage(error));
    },

    // 🔄 Keep server + UI in sync
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useUpdateCategoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateCategoryImage,

    // 🔥 Optimistic update
    onMutate: async (variables: any) => {
      const previousCategories = queryClient.getQueryData(["categories"]);
      const previousCategory = queryClient.getQueryData([
        "category",
        variables.categoryId,
      ]);

      // ✅ update category list instantly
      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === variables.categoryId
              ? { ...item, image: variables.image }
              : item,
          ),
        };
      });

      // ✅ update single category cache
      queryClient.setQueryData(
        ["category", variables.categoryId],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              image: variables.image,
            },
          };
        },
      );

      return {
        previousCategories,
        previousCategory,
      };
    },

    // ✅ Success (replace with real server data)
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === variables.categoryId ? data.data : item,
          ),
        };
      });

      queryClient.setQueryData(["category", variables.categoryId], {
        data: data.data,
      });

      toast.success(GetApiResponseMessage(data));
    },

    // 🔄 Rollback on error
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }

      if (context?.previousCategory) {
        queryClient.setQueryData(
          ["category", variables.categoryId],
          context.previousCategory,
        );
      }

      toast.error(GetApiErrorMessage(error));
    },

    // 🔄 Final sync
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["category", variables.categoryId],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateCategory,

    // 🔥 Optimistic update
    onMutate: async (variables: any) => {
      const previousCategories = queryClient.getQueryData(["categories"]);
      const previousCategory = queryClient.getQueryData([
        "category",
        variables.id,
      ]);

      // ✅ update list instantly
      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === variables.id ? { ...item, ...variables.data } : item,
          ),
        };
      });

      // ✅ update single category cache
      queryClient.setQueryData(["category", variables.id], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            ...variables.data,
          },
        };
      });

      return {
        previousCategories,
        previousCategory,
      };
    },

    // ✅ Success (sync final server data)
    onSuccess: (data, variables) => {
      // update list with fresh data
      queryClient.setQueryData(["categories"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === variables.categoryId ? data.data : item,
          ),
        };
      });

      // update single cache
      queryClient.setQueryData(["category", variables.categoryId], {
        data: data.data,
      });

      toast.success(GetApiResponseMessage(data));
    },

    // 🔄 Rollback
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }

      if (context?.previousCategory) {
        queryClient.setQueryData(
          ["category", variables.categoryId],
          context.previousCategory,
        );
      }

      toast.error(GetApiErrorMessage(error));
    },

    // 🔄 Final sync
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["category", variables.categoryId],
      });
    },
  });
};
