/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useUpdateCourse } from "../hooks/useCourse";
import { useGetCategories } from "../hooks/useCategory";
import CustomButton from "@/shared/components/custom/CustomButton";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/components/ui/combobox";
import { Spinner } from "@/shared/components/ui/spinner";
import { Edit } from "lucide-react";

type FormType = {
  categoryId: string;
};

const CategoryForm = ({
  categoryId,
  courseId,
}: {
  categoryId?: string | null;
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { data, isPending: isCategoryPending } = useGetCategories();
  const categories = data?.data || [];

  const { mutateAsync: UpdateCourse, isPending: isCourseUpdating } =
    useUpdateCourse();

  const { handleSubmit, control, reset } = useForm<FormType>({
    defaultValues: {
      categoryId: categoryId || "",
    },
  });

  const selectedId = useWatch({
    control,
    name: "categoryId",
  });

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

      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({ categoryId: categoryId || "" });
    }
    setIsEdit((prev) => !prev);
  };

  // 🔥 Transform categories → combobox format
  const options = categories.map((cat: any) => ({
    label: cat.name,
    value: cat.id,
  }));

  const selectedLabel =
    options.find((opt: any) => opt.value === categoryId)?.label ||
    "No category";

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Course Category
        </h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      <div className="mt-3">
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Combobox */}
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => {
                const selected = options.find(
                  (opt: any) => opt.value === field.value,
                );

                return (
                  <Combobox
                    items={options}
                    value={selected || null}
                    onValueChange={(item) => {
                      if (item) field.onChange(item.value); // ✅ store ID
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

            {/* Save Button */}
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
