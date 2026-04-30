/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Edit, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useUpdateCourse } from "../hooks/useCourse";
import { UploadImage } from "../apiOperations";
import { toast } from "sonner";

const ThumbnailForm = ({
  image,
  courseId,
}: {
  image: string | null;
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(image);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: UpdateCourse, isPending } = useUpdateCourse();

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    setFile(null);
    setPreview(image);
    setUploadedData(null);
  };

  // 📌 Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // instant preview
  };

  // 📌 Upload to Cloudinary
  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await UploadImage(formData);

      setUploadedData(res.data); // store cloudinary response
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // 📌 Save to DB
  const handleSave = async () => {
    if (!uploadedData) {
      toast.error("Please upload image first");
      return;
    }

    try {
      await UpdateCourse({
        courseId,
        data: {
          image: uploadedData.secure_url,
          image_public_id: uploadedData.public_id,
        },
      });

      setIsEdit(false);
      toast.success("Thumbnail updated");
    } catch (error) {
      console.error(error);
      toast.error("Save failed");
    }
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Course Thumbnail
        </h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      <div className="mt-3">
        {isEdit ? (
          <div className="space-y-3">
            {/* Preview */}
            <AspectRatio ratio={16 / 9}>
              <div className="relative w-full h-full group rounded-md overflow-hidden border">
                {/* Image */}
                {preview ? (
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    No preview
                  </div>
                )}

                {/* 🔥 Overlay Upload (ONLY in edit mode) */}
                {isEdit && (
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-6 h-6 text-white mb-1" />

                    <p className="text-sm text-white font-medium">
                      Change Thumbnail
                    </p>

                    {/* Hidden Input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </AspectRatio>

            {/* Upload Button */}
            <div className=" flex gap-4">
              <CustomButton
                onClick={handleUpload}
                disabled={!file || isUploading}
                loading={isUploading}
                loadingText="Uploading..."
              >
                Upload
              </CustomButton>

              {/* Save Button */}
              <CustomButton
                onClick={handleSave}
                disabled={!uploadedData || isPending}
                loading={isPending}
                loadingText="Saving..."
                className="bg-blue-500 hover:bg-blue-600"
              >
                Save
              </CustomButton>
            </div>
          </div>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <div className="w-full h-full">
              {image ? (
                <Image
                loading="eager"
                  src={image}
                  alt="course"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 border border-dashed rounded-md">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No image uploaded</p>
                  <span className="text-xs text-gray-400">
                    (Choose image less than 5 mb)
                  </span>
                </div>
              )}
            </div>
          </AspectRatio>
        )}
      </div>
    </section>
  );
};

export default ThumbnailForm;
