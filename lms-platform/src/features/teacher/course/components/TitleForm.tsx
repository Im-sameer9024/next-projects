"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import type { Course } from "../../../../../generated/prisma/client";
import { Edit } from "lucide-react";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCourseTitleSchema,
  CreateCourseTitleTypes,
} from "../validation/course.validation";
import CustomInput from "@/shared/components/custom/CustomInput";
import { useUpdateCourse } from "../hooks/useCourse";
import { toast } from "sonner";

const TitleForm = ({ initialData }: { initialData: Course }) => {
  const [editTitle, setEditTitle] = useState(false);

  const { mutateAsync: updateCourse, isPending } = useUpdateCourse();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<CreateCourseTitleTypes>({
    resolver: zodResolver(CreateCourseTitleSchema),
    defaultValues: {
      title: initialData.title,
    },
  });

  // ✅ Memoized toggle
  const toggleEdit = useCallback(() => {
    setEditTitle((prev) => !prev);
    reset({ title: initialData.title });
  }, [initialData.title, reset]);

  const onSubmit = async (data: CreateCourseTitleTypes) => {
    // ✅ Prevent unnecessary API call
    if (!isDirty) {
      toast.info("No changes made");
       setEditTitle(false);
      return;
    }

    try {
      await updateCourse({
        courseId: initialData.id,
        title: data.title,
      });

      setEditTitle(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update course");
    }
  };

  return (
    <div className="bg-white border p-4 rounded-md ">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-md text-darkText">Course Title</h3>

          {editTitle ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mt-2">
              <CustomInput
                name="title"
                control={control}
                loading={isPending}
                disabled={isPending}
                placeholder="e.g. 'Advanced web development'"
              />

              <CustomButton
                active
                loading={isPending}
                disabled={isPending}
                type="submit"
              >
                Save
              </CustomButton>
            </form>
          ) : (
            <p className="text-sm">{initialData.title}</p>
          )}
        </div>

        <CustomButton onClick={toggleEdit} leftIcon={!editTitle && <Edit />}>
          {editTitle ? "Cancel" : "Edit"}
        </CustomButton>
      </div>
    </div>
  );
};

export default TitleForm;
