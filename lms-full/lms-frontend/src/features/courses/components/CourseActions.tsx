"use client";

import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import CustomButton from "@/shared/components/custom/CustomButton";
import { useDeleteCourse, usePublishCourse, useUnPublishCourse } from "../hooks/useCourse";
import ConfirmModal from "@/shared/components/modals/ConfirmModal";
import { Spinner } from "@/shared/components/ui/spinner";
import { useConfettiStore } from "@/shared/store/confetti.store";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions = ({ disabled, courseId, isPublished }: CourseActionsProps) => {
  const router = useRouter();

  const confetti = useConfettiStore();

  const {
    mutateAsync: deleteCourse,

    isPending: isDeleting,
  } = useDeleteCourse();

  const { mutateAsync: publishCourse, isPending: isPublishing } = usePublishCourse();

  const {
    mutateAsync: unPublishCourse,

    isPending: isUnPublishing,
  } = useUnPublishCourse();

  const isUpdating = isPublishing || isUnPublishing;

  const onDelete = async () => {
    try {
      await deleteCourse({
        courseId,
      });

      router.push("/teacher/courses");
    } catch (error) {
      console.log(error);
    }
  };

  const onPublish = async () => {
    try {
      if (isPublished) {
        await unPublishCourse({
          courseId,
        });
      } else {
        await publishCourse({
          courseId,
        });
        confetti.onOpen();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {/* ---------------- Publish Button ---------------- */}

      <CustomButton
        onClick={onPublish}
        disabled={disabled || isDeleting || isUpdating}
        loading={isUpdating}
        loadingText="Updating..."
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </CustomButton>

      {/* ---------------- Delete Button ---------------- */}

      <ConfirmModal onConfirm={onDelete}>
        <div
          className={`cursor-pointer rounded border p-1 ${isDeleting ? "cursor-not-allowed opacity-50" : "hover:bg-red-200"} border-red-200 bg-red-50 text-red-400`}
        >
          {isDeleting ? <Spinner /> : <Trash size={14} />}
        </div>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;
