"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import {
  CreateCoursePriceSchema,
  CreateCoursePriceSchemaType,
} from "@/shared/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useUpdateCourse } from "../hooks/useCourse";

const PriceForm = ({
  price,
  courseId,
}: {
  price: string | null;
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: UpdateCourse, isPending } = useUpdateCourse();

  const { handleSubmit, control, reset } = useForm<CreateCoursePriceSchemaType>(
    {
      resolver: zodResolver(CreateCoursePriceSchema),
      defaultValues: {
        price: price || "",
      },
    },
  );

  const watchedPrice = useWatch({
    control,
    name: "price",
  });

  const onSubmit = async (data: CreateCoursePriceSchemaType) => {
    const normalizedPrice = String(Number(data.price)); // ✅ clean + consistent

    if (normalizedPrice === (price || "")) {
      setIsEdit(false);
      return;
    }

    try {
      await UpdateCourse({
        courseId,
        data: {
          price: normalizedPrice, // ✅ always clean string
        },
      });

      setIsEdit(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) reset({ price: price || "" });
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">Course Price</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isEdit ? "max-h-40 mt-3" : "max-h-10 mt-2"
        }`}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-1">
            <CustomInput
              type="number"
              control={control}
              name="price"
              placeholder="Enter price (e.g. 499)"
              disabled={isPending}
            />

            <CustomButton
              loading={isPending}
              disabled={isPending || watchedPrice === (price || "")}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600">
            {price ? `₹${price}` : "Free / Not set"}
          </p>
        )}
      </div>
    </section>
  );
};

export default PriceForm;
