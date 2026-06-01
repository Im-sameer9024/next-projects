"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, UploadCloud } from "lucide-react";
import CustomButton from "@/shared/components/custom/CustomButton";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import MuxVideoPlayer from "@/shared/components/common/MuxVideoPlayer";

import { useDeleteChapterVideo, useUploadChapterVideo } from "../hooks/useChapter";

import { cn } from "@/shared/lib/utils";

import { useQueryClient } from "@tanstack/react-query";

const MAX_FILE_SIZE = 1024 * 1024 * 1024;

const ChapterVideoForm = ({
  videoUrl,
  chapterId,
  courseId,
  isProcessingVideo,
  isPublished,
}: {
  videoUrl: string | null;
  chapterId: string;
  courseId: string;
  isPublished: boolean;
  isProcessingVideo: boolean;
}) => {
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [progress, setProgress] = useState(0);

  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: createUpload } = useUploadChapterVideo();

  const { mutateAsync: deleteVideo, isPending: isDeleting } = useDeleteChapterVideo();

  const previewUrl = useMemo(() => {
    if (!file) return null;

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetState = () => {
    setFile(null);

    setProgress(0);

    setIsUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Max file size is 1GB");

      return;
    }

    setFile(selectedFile);

    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      const response = await createUpload({
        chapterId,
      });

      const { uploadUrl } = response.data;

      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);

          setProgress(percentage);
        }
      };

      xhr.onload = async () => {
        setIsUploading(false);

        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);

          toast.success("Video uploaded. Processing started...");

          await queryClient.invalidateQueries({
            queryKey: ["chapter", "detail", chapterId],
          });

          resetState();

          setIsEdit(false);

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

      setIsUploading(false);

      toast.error("Upload failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVideo({
        chapterId,
        courseId,
      });

      toast.success("Video deleted");

      resetState();

      setIsEdit(false);

      await queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", chapterId],
      });
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);

    if (isEdit) {
      resetState();
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Chapter Video</h3>

          <p className="text-xs text-slate-400">
            {videoUrl
              ? "Video ready"
              : isProcessingVideo
                ? "Video processing"
                : "No video uploaded"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            disabled={isPublished}
            type="button"
            size="sm"
            className={cn(
              "transition-all duration-200",

              isEdit ? "bg-transparent text-slate-500" : "bg-blue-500 hover:bg-blue-600",
            )}
            variant={isEdit ? "outline" : "default"}
            leftIcon={!isEdit && <Edit size={16} />}
            onClick={toggleEdit}
          >
            {isEdit ? "Cancel" : "Edit"}
          </CustomButton>

          {videoUrl && (
            <CustomButton
              disabled={isPublished}
              type="button"
              size="sm"
              variant="outline"
              loading={isDeleting}
              loadingText="Deleting..."
              onClick={handleDelete}
              className="border-red-200 text-red-500"
            >
              <Trash2 size={16} />
              Delete
            </CustomButton>
          )}
        </div>
      </div>

      {isEdit ? (
        <div className="mt-4 space-y-4">
          {/* Upload Box */}
          <label
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition",

              isUploading
                ? "cursor-not-allowed bg-slate-50"
                : "cursor-pointer hover:border-blue-400 hover:bg-blue-50",
            )}
          >
            <UploadCloud className="mb-2 h-6 w-6 text-slate-400" />

            <p className="text-sm font-medium text-slate-600">Select Video</p>

            <p className="text-xs text-slate-400">MP4, MOV, WEBM up to 1GB</p>

            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </label>

          {/* Preview */}
          {previewUrl && <video controls src={previewUrl} className="w-full rounded-md border" />}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-500">Uploading {progress}%</p>
            </div>
          )}

          {/* Upload Button */}
          <CustomButton
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            loading={isUploading}
            loadingText="Uploading..."
          >
            Upload Video
          </CustomButton>
        </div>
      ) : (
        <div className="mt-4">
          <AspectRatio ratio={16 / 9}>
            {videoUrl ? (
              <MuxVideoPlayer playbackId={videoUrl} />
            ) : isProcessingVideo ? (
              <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed bg-slate-100">
                <p className="text-sm font-medium text-blue-500">Video is processing...</p>

                <p className="mt-1 text-xs text-slate-500">This may take a few minutes</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed bg-slate-100">
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
