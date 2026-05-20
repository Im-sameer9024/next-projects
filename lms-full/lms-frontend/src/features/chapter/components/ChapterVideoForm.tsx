"use client";

import React, { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { CheckCircle2, Edit, Trash2, UploadCloud, X } from "lucide-react";

import CustomButton from "@/shared/components/custom/CustomButton";

import { AspectRatio } from "@/shared/components/ui/aspect-ratio";

import MuxVideoPlayer from "@/shared/components/common/MuxVideoPlayer";

import {
  useDeleteChapterVideo,
  useSaveChapterVideo,
  useUploadChapterVideo,
} from "../hooks/useChapter";

import { cn } from "@/shared/lib/utils";

const MAX_FILE_SIZE = 1024 * 1024 * 1024;

const ChapterVideoForm = ({
  videoUrl,
  chapterId,
  courseId,
  isProcessingVideo,
}: {
  videoUrl: string | null;
  chapterId: string;
  courseId: string;
  isProcessingVideo: boolean;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const { mutateAsync: createUpload } = useUploadChapterVideo();

  const { mutateAsync: saveVideo, isPending: isSaving } = useSaveChapterVideo();

  const { mutateAsync: deleteVideo, isPending: isDeleting } =
    useDeleteChapterVideo();

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
    setUploadId(null);
    setProgress(0);
    setIsUploading(false);
    setIsUploadComplete(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Max file size is 1GB");

      return;
    }

    setFile(selectedFile);

    setUploadId(null);

    setProgress(0);

    setIsUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      const response = await createUpload({
        chapterId,
      });

      console.log("response of upload", response);

      const { uploadUrl, uploadId: createdUploadId } = response.data;

      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);

          setProgress(percentage);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);

        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);

          setUploadId(createdUploadId);

          setIsUploadComplete(true);

          toast.success("Video uploaded successfully");

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

  const handleSave = async () => {
    if (!uploadId) {
      return toast.error("Upload video before saving");
    }

    console.log(
      "-------------------- upload id -------------------------",
      uploadId,
    );

    try {
      await saveVideo({
        uploadId,
        chapterId,
        courseId,
      });

      toast.success("Video saved. Processing started...");

      setIsEdit(false);

      resetState();
    } catch (error) {
      console.error(error);

      toast.error("Failed to save video");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVideo({
        chapterId,
      });

      toast.success("Video deleted");

      resetState();

      setIsEdit(false);
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
    <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Chapter Video
          </h3>

          <p className="text-xs text-slate-400">
            {videoUrl ? "Video ready" : "No video uploaded"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            type="button"
            size="sm"
            variant={isEdit ? "outline" : "default"}
            leftIcon={!isEdit && <Edit size={16} />}
            rightIcon={isEdit && <X size={16} />}
            onClick={toggleEdit}
          >
            {isEdit ? "Cancel" : "Edit"}
          </CustomButton>

          {videoUrl && (
            <CustomButton
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
        <div className="space-y-4 mt-4">
          {/* Upload Box */}
          <label
            className={cn(
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition",
              isUploading
                ? "cursor-not-allowed bg-slate-50"
                : "cursor-pointer hover:border-blue-400 hover:bg-blue-50",
            )}
          >
            <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />

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
          {previewUrl && (
            <video
              controls
              src={previewUrl}
              className="w-full rounded-md border"
            />
          )}

          {/* Progress */}
          {(isUploading || isUploadComplete) && (
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-500">
                {isUploadComplete
                  ? "Upload complete"
                  : `Uploading ${progress}%`}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <CustomButton
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              loading={isUploading}
              loadingText="Uploading..."
            >
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
        <div className="mt-4">
          <AspectRatio ratio={16 / 9}>
            {videoUrl ? (
              <MuxVideoPlayer playbackId={videoUrl} />
            ) : isProcessingVideo ? (
              <div className="h-full flex flex-col items-center justify-center bg-slate-100 rounded-md border border-dashed">
                <p className="text-sm text-blue-500 font-medium">
                  Video is processing...
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  This may take a few minutes
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-100 rounded-md border border-dashed">
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
