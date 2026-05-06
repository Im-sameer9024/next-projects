"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import { Trash } from "lucide-react";
import ConfirmModal from "./modals/ConfirmModal";
import { useDeleteChapter } from "../hooks/useChapter";
import {
  usePublishChapter,
  useUnPublishChapter,
} from "../hooks/useChapter";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();

  // ✅ delete
  const {
    mutateAsync: deleteChapter,
    isPending: isDeleting,
  } = useDeleteChapter();

  // ✅ publish
  const {
    mutateAsync: publishChapter,
    isPending: isPublishing,
  } = usePublishChapter();

  // ✅ unpublish
  const {
    mutateAsync: unPublishChapter,
    isPending: isUnPublishing,
  } = useUnPublishChapter();

  const isUpdating = isPublishing || isUnPublishing;

  // 🔥 DELETE
  const onDelete = async () => {
    try {
      await deleteChapter({ courseId, chapterId });
      router.push(`/teacher/courses/${courseId}`);
    } catch {}
  };

  // 🔥 PUBLISH / UNPUBLISH
  const onPublish = async () => {
    try {
      if (isPublished) {
        await unPublishChapter({ courseId, chapterId });
      } else {
        await publishChapter({ courseId, chapterId });
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

export default ChapterActions;