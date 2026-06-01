/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import CustomButton from "@/shared/components/custom/CustomButton";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";

import { useGetAllCategories } from "../hooks/useCategory";
import { useUpdateCourseByTeacher } from "@/features/courses/hooks/useCourse";
import { Spinner } from "@/shared/components/ui/spinner";

type FormType = {
  categoryId: string;
};

type CategoryOption = {
  label: string;
  value: string;
};

const CategoryForm = ({
  categoryId,
  courseId,
}: {
  categoryId?: string | null;

  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { data, isPending: isCategoryPending } = useGetAllCategories();

  const categories = data?.data || [];

  const { mutateAsync: UpdateCourse, isPending: isCourseUpdating } = useUpdateCourseByTeacher();

  const { handleSubmit, control, reset } = useForm<FormType>({
    defaultValues: {
      categoryId: categoryId || "",
    },
  });

  const selectedId = useWatch({
    control,
    name: "categoryId",
  });

  const options: CategoryOption[] = categories.map((cat: any) => ({
    label: cat.name,

    value: cat.id,
  }));

  const selectedLabel = options.find((opt) => opt.value === categoryId)?.label || "No category";

  const onSubmit = async (values: FormType) => {
    if (values.categoryId === categoryId) {
      setIsEdit(false);

      return;
    }

    try {
      await UpdateCourse({
        courseId,

        data: {
          categoryId: values.categoryId,
        },
      });

      toast.success("Course category updated successfully");

      setIsEdit(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update category");
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({
        categoryId: categoryId || "",
      });
    }

    setIsEdit((prev) => !prev);
  };

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Course Category</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit ? "bg-transparent text-slate-500" : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* BODY */}

      <div className="mt-3">
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* COMBOBOX */}

            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => {
                const selected = options.find((opt) => opt.value === field.value);

                return (
                  <Combobox
                    items={options}
                    value={selected || null}
                    onValueChange={(item) => {
                      if (item) {
                        field.onChange(item.value);
                      }
                    }}
                    itemToStringValue={(item) => item.label}
                  >
                    <ComboboxInput placeholder="Select category" />

                    <ComboboxContent>
                      {isCategoryPending ? (
                        <div className="flex items-center justify-center py-6">
                          <Spinner />
                        </div>
                      ) : options.length === 0 ? (
                        <ComboboxEmpty>No category found.</ComboboxEmpty>
                      ) : (
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      )}
                    </ComboboxContent>
                  </Combobox>
                );
              }}
            />

            {/* SAVE BUTTON */}

            <CustomButton
              type="submit"
              loading={isCourseUpdating}
              loadingText="Saving..."
              disabled={isCourseUpdating || selectedId === categoryId}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600">{selectedLabel}</p>
        )}
      </div>
    </section>
  );
};

export default CategoryForm;
