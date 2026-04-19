/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Course } from "../../../../../generated/prisma/client";
import { useUpdateCourse, useUploadCourseImage } from "../hooks/useCourse";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Edit, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const ImageForm = ({ initialData }: { initialData: Course }) => {
  const [editImage, setEditImage] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData.imageUrl || null,
  );
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [imgPublicId, setImgPublicId] = useState<string | null>(null);

  const { mutateAsync: updateCourse, isPending } = useUpdateCourse();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadCourseImage();

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Toggle edit
  const toggleEdit = useCallback(() => {
    setEditImage((prev) => !prev);

    if (editImage) {
      setFile(null);
      setUploadedUrl(null);
      setImgPublicId(null);
      setPreview(initialData.imageUrl || null);
    }
  }, [editImage, initialData.imageUrl]);

  // File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Upload
  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result: any = await uploadImage(formData);

      setUploadedUrl(result.data?.secure_url);
      setImgPublicId(result.data?.public_id);
    } catch (error) {
      console.log(error);
    }
  };

  // Save
  const handleSave = async () => {
    if (!uploadedUrl) {
      toast.info("No changes to save");
      setEditImage(false);
      return;
    }

    try {
      await updateCourse({
        courseId: initialData.id,
        imageUrl: uploadedUrl,
        image_public_id: imgPublicId,
      });

      setEditImage(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border p-4 rounded-md ">
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-semibold text-darkText text-base sm:text-md">
          Course Image
        </h3>

        <CustomButton
          onClick={toggleEdit}
          leftIcon={!editImage && <Edit />}
          className="w-full sm:w-auto"
        >
          {editImage ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* 🔹 Content */}
      <div className="mt-4 space-y-4">
        {editImage ? (
          <>
            {/* Preview */}
            <AspectRatio ratio={16 / 9}>
              <div className="w-full h-full">
                {preview ? (
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-md border border-dashed">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No image selected
                    </p>
                  </div>
                )}
              </div>
            </AspectRatio>

            {/* File Input (Styled) */}
            <label className="cursor-pointer border rounded-md p-2 text-sm text-center hover:bg-gray-50">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <CustomButton
                onClick={handleUpload}
                disabled={!file || isUploading}
                loading={isUploading}
                leftIcon={<Upload />}
                active
              >
                Upload
              </CustomButton>

              <CustomButton
                onClick={handleSave}
                disabled={isPending}
                loading={isPending}
                active
              >
                Save
              </CustomButton>
            </div>
          </>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <div className="w-full h-full">
              {initialData.imageUrl ? (
                <Image
                  src={initialData.imageUrl}
                  alt="course"
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-md border border-dashed">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No image uploaded
                  </p>
                </div>
              )}
            </div>
          </AspectRatio>
        )}
      </div>
    </div>
  );
};

export default ImageForm;
