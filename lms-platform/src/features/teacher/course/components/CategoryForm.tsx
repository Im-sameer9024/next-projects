"use client";

/* eslint-disable react-hooks/incompatible-library */

import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { toast } from "sonner";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomSelect from "@/shared/components/custom/CustomSelect";

import { useUpdateCourse } from "../hooks/useCourse";
import { useGetAllCategory } from "../../category/hooks/useCategory";

import type { Course } from "../../../../../generated/prisma/client";

type Category = { id: string; name: string };

type FormValues = {
  category: string;
};

const CategoryForm = ({ initialData }: { initialData: Course }) => {
  const [editCategory, setEditCategory] = useState(false);

  const { mutateAsync: updateCourse, isPending: isUpdating } =
    useUpdateCourse();

  const {
    data: categoryRes,
    isPending: isCategoriesLoading,
    isError,
  } = useGetAllCategory();

  // ✅ Convert API → Select format
  const categoryOptions = useMemo(() => {
    const category = (categoryRes?.data ?? []) as Category[];

    return category.map((c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [categoryRes]);

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      category: initialData.categoryId || "",
    },
  });

  const selectedCategory = categoryOptions.find(
    (c) => c.value === watch("category")
  );

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) {
      toast.info("No changes made");
      setEditCategory(false);
      return;
    }

    try {
      await updateCourse({
        courseId: initialData.id,
        categoryId: data.category, // ✅ already ID
      });

      toast.success("Category updated successfully");

      setEditCategory(false);
      reset(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  };

  const toggleEdit = useCallback(() => {
    setEditCategory((prev) => !prev);

    reset({
      category: initialData.categoryId || "",
    });
  }, [initialData.categoryId, reset]);

  if (isCategoriesLoading) {
    return <div className="p-4">Loading categories...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className="bg-white border p-4 rounded-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-md text-darkText">
            Course Category
          </h3>

          {editCategory ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">

              {/* ✅ CustomSelect replaces Combobox */}
              <CustomSelect<FormValues>
                name="category"
                control={control}
                placeholder="Select category"
                options={categoryOptions}
                disabled={isUpdating}
              />

              <CustomButton
                active
                loading={isUpdating}
                disabled={isUpdating}
                type="submit"
              >
                Save
              </CustomButton>
            </form>
          ) : (
            <p className="text-sm text-gray-700 mt-1">
              {selectedCategory?.label || "No category selected"}
            </p>
          )}
        </div>

        <CustomButton onClick={toggleEdit} leftIcon={!editCategory && <Edit />}>
          {editCategory ? "Cancel" : "Edit"}
        </CustomButton>
      </div>
    </div>
  );
};

export default CategoryForm;