import React, { useCallback, useState } from "react";
import type { Course } from "../../../../../generated/prisma/client";
import { useUpdateCourse } from "../hooks/useCourse";
import { useForm } from "react-hook-form";
import {
  CreateCourseDescriptionSchema,
  CreateCourseDescriptionTypes,
} from "../validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Edit } from "lucide-react";
import CustomTextarea from "@/shared/components/custom/CustomTextarea";

const DescriptionForm = ({ initialData }: { initialData: Course }) => {
  const [editDescription, setEditDescription] = useState(false);

  const { mutateAsync: updateCourse, isPending } = useUpdateCourse();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<CreateCourseDescriptionTypes>({
    resolver: zodResolver(CreateCourseDescriptionSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  // ✅ Memoized toggle
  const toggleEdit = useCallback(() => {
    setEditDescription((prev) => !prev);
    reset({ description: initialData.description || "" });
  }, [initialData.description, reset]);

  const onSubmit = async (data: CreateCourseDescriptionTypes) => {
    // ✅ Prevent unnecessary API call
    if (!isDirty) {
      toast.info("No changes made");
      setEditDescription(false);
      return;
    }

    try {
      await updateCourse({
        courseId: initialData.id,
        description: data.description,
      });

      setEditDescription(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update course");
    }
  };

  return (
    <div className="bg-white border p-4 rounded-md ">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-md text-darkText">
            Course Description
          </h3>

          {editDescription ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mt-2 ">
              <CustomTextarea
                name="description"
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
            <p className="text-sm">{initialData.description || "N/A"}</p>
          )}
        </div>

        <CustomButton
          onClick={toggleEdit}
          leftIcon={!editDescription && <Edit />}
        >
          {editDescription ? "Cancel" : "Edit"}
        </CustomButton>
      </div>
    </div>
  );
};

export default DescriptionForm;
