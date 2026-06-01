"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { useUpdateCourseByTeacher } from "../hooks/useCourse";
import { CoursePriceSchema, CoursePriceSchemaType } from "../course.validation";

const PriceForm = ({
  price,
  courseId,
}: {
  price: string | null;

  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    mutateAsync: UpdateCourse,

    isPending: isUpdatingCourse,
  } = useUpdateCourseByTeacher();

  const { handleSubmit, control, reset } = useForm<CoursePriceSchemaType>({
    resolver: zodResolver(CoursePriceSchema),

    defaultValues: {
      price: price || "",
    },
  });

  const watchedPrice = useWatch({
    control,

    name: "price",
  });

  const onSubmit = async (data: CoursePriceSchemaType) => {
    const normalizedPrice = String(Number(data.price));
    if (normalizedPrice === (price || "")) {
      setIsEdit(false);

      return;
    }
    try {
      await UpdateCourse({
        courseId,

        data: {
          price: normalizedPrice,
        },
      });

      toast.success("Course price updated successfully");

      setIsEdit(false);
    } catch (error) {
      console.error("Update failed:", error);

      toast.error("Failed to update course price");
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({
        price: price || "",
      });
    }

    setIsEdit((prev) => !prev);
  };

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Course Price</h3>

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

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isEdit ? "mt-3 max-h-40 opacity-100" : "mt-2 max-h-10 opacity-100"
        }`}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-1">
            {/* INPUT */}

            <CustomInput
              type="number"
              control={control}
              name="price"
              placeholder="Enter course price"
              disabled={isUpdatingCourse}
            />

            {/* SAVE BUTTON */}

            <CustomButton
              loading={isUpdatingCourse}
              disabled={isUpdatingCourse || watchedPrice === (price || "")}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600">{price ? `₹${price}` : "Free / Not set"}</p>
        )}
      </div>
    </section>
  );
};

export default PriceForm;
