"use client";

import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "@/shared/components/custom/CustomButton";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { CheckCircle2, Edit, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import MuxVideoPlayer from "@/shared/components/common/MuxVideoPlayer";
import { UploadChapterVideo } from "../apiOperations";
import {
  useDeleteChapterVideo,
  useSaveChapterVideo,
} from "../hooks/useChapter";
import { cn } from "@/shared/lib/utils";

const ChapterVideoForm = ({
  courseId,
  videoUrl,
  chapterId,
}: {
  courseId: string;
  videoUrl: string | null;
  chapterId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const { mutateAsync: saveVideo, isPending: isSaving } = useSaveChapterVideo();

  const { mutateAsync: deleteVideo, isPending: isDeleting } =
    useDeleteChapterVideo();

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 📌 File select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 1024 * 1024 * 1024) {
      toast.error("Max file size is 1GB");
      return;
    }

    setFile(f);
    setUploadId(null);
    setProgress(0);
    setIsUploadComplete(false);
  };

  // 📌 Upload to mux
  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setIsUploadComplete(false);
      setProgress(0);

      const res = await UploadChapterVideo({ courseId, chapterId });
      const { uploadUrl, uploadId: createdUploadId } = res.data;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setUploadId(createdUploadId);
          setIsUploadComplete(true);
          toast.success("Upload complete");
          return;
        }

        toast.error("Upload failed");
      };

      xhr.onerror = () => {
        setIsUploading(false);
        toast.error("Upload failed");
      };

      xhr.send(file);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
      setIsUploading(false);
    }
  };

  // 📌 Save assetId
  const handleSave = async () => {
    if (!uploadId || !isUploadComplete) {
      return toast.error("Upload video first");
    }

    await saveVideo({
      courseId,
      chapterId,
      uploadId,
    });

    toast.success("Saved. Processing video...");
    setIsEdit(false);
    setFile(null);
    setUploadId(null);
    setProgress(0);
    setIsUploadComplete(false);
  };

  // 📌 Delete video
  const handleDelete = async () => {
    await deleteVideo({ courseId, chapterId });
    setIsEdit(false);
    setFile(null);
    setUploadId(null);
    setProgress(0);
    setIsUploadComplete(false);
  };

  const toggleEdit = () => {
    setIsEdit((prev) => {
      const next = !prev;
      if (!next) {
        setFile(null);
        setUploadId(null);
        setProgress(0);
        setIsUploadComplete(false);
      }
      return next;
    });
  };

  return (
    <section className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm text-slate-700">
            Chapter Video
          </h3>
          <p className="text-xs text-slate-400">
            {videoUrl ? "Video is ready" : "No video uploaded"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CustomButton
            type="button"
            leftIcon={!isEdit && <Edit size={16} />}
            rightIcon={isEdit && <X size={16} />}
            size="sm"
            variant={isEdit ? "outline" : "default"}
            className={cn(
              "transition-all duration-200",
              isEdit
                ? "bg-transparent text-slate-500"
                : "bg-blue-500 hover:bg-blue-600",
            )}
            onClick={toggleEdit}
          >
            {isEdit ? "Cancel" : "Edit"}
          </CustomButton>
          {videoUrl && (
            <CustomButton
              type="button"
              size="sm"
              variant="outline"
              className="border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              onClick={handleDelete}
              loading={isDeleting}
              loadingText="Deleting..."
            >
              <Trash2 size={16} />
              Delete
            </CustomButton>
          )}
        </div>
      </div>

      {/* ================= EDIT MODE ================= */}
      {isEdit ? (
        <div className="space-y-4 mt-4">
          {/* Upload Box */}
          <label
            className={cn(
              "border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center transition",
              isUploading
                ? "cursor-not-allowed bg-slate-50"
                : "cursor-pointer hover:border-blue-400 hover:bg-blue-50/40",
            )}
          >
            <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-600">
              Select a video file
            </p>
            <p className="text-xs text-slate-400">MP4, MOV, or WebM up to 1GB</p>

            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          {/* Preview */}
          {previewUrl && (
            <video
              src={previewUrl}
              controls
              className="rounded-md w-full border border-slate-200 bg-black"
            />
          )}

          {/* Progress */}
          {(isUploading || isUploadComplete) && (
            <div className="space-y-1">
              <div className="w-full bg-slate-200 h-2 rounded-full">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                {isUploadComplete ? (
                  <>
                    <CheckCircle2 size={14} className="text-green-500" />
                    Upload complete. Save to attach it to this chapter.
                  </>
                ) : (
                  <>Uploading... {progress}%</>
                )}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <CustomButton
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              loading={isUploading}
              loadingText="Uploading..."
              className="bg-blue-500 hover:bg-blue-600"
            >
              <UploadCloud size={16} />
              Upload
            </CustomButton>

            <CustomButton
              type="button"
              onClick={handleSave}
              disabled={!uploadId || !isUploadComplete}
              loading={isSaving}
              loadingText="Saving..."
            >
              Save
            </CustomButton>
          </div>
        </div>
      ) : (
        /* ================= VIEW MODE ================= */
        <div className="mt-4">
          <AspectRatio ratio={16 / 9}>
            {videoUrl ? (
              <>
                <MuxVideoPlayer playbackId={videoUrl} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-slate-100 border border-dashed rounded-md">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">No video uploaded</p>
              </div>
            )}
          </AspectRatio>
        </div>
      )}
    </section>
  );
};

export default ChapterVideoForm;
