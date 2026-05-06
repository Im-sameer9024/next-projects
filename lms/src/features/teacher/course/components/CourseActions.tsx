"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import { Trash } from "lucide-react";
import ConfirmModal from "./modals/ConfirmModal";
import {
  useDeleteCourse,
  usePublishCourse,
  useUnPublishCourse,
} from "../hooks/useCourse";
import { useRouter } from "next/navigation";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) => {
  const router = useRouter();

  // ✅ delete course
  const {
    mutateAsync: deleteCourse,
    isPending: isDeleting,
  } = useDeleteCourse();

  // ✅ publish
  const {
    mutateAsync: publishCourse,
    isPending: isPublishing,
  } = usePublishCourse();

  // ✅ unpublish
  const {
    mutateAsync: unPublishCourse,
    isPending: isUnPublishing,
  } = useUnPublishCourse();

  const isUpdating = isPublishing || isUnPublishing;

  // 🔥 DELETE COURSE
  const onDelete = async () => {
    try {
      await deleteCourse({ courseId });
      router.push("/teacher/courses"); // ✅ go back to list
    } catch {}
  };

  // 🔥 PUBLISH / UNPUBLISH COURSE
  const onPublish = async () => {
    try {
      if (isPublished) {
        await unPublishCourse({ courseId });
      } else {
        await publishCourse({ courseId });
      }
    } catch {}
  };

  return (
    <div className="flex items-center gap-x-2">
      {/* ✅ Publish Button */}
      <CustomButton
        onClick={onPublish}
        disabled={disabled || isDeleting || isUpdating}
        loading={isUpdating}
        loadingText="Updating..."
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </CustomButton>

      {/* ✅ Delete Button */}
      <ConfirmModal onConfirm={onDelete}>
        <div
          className={`
            border p-1 rounded cursor-pointer
            ${
              isDeleting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-200"
            }
            text-red-400 border-red-200 bg-red-50
          `}
        >
          {isDeleting ? (
            <span className="text-xs px-1">...</span>
          ) : (
            <Trash size={14} />
          )}
        </div>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;