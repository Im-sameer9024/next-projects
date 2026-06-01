/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Upload } from "lucide-react";
import { toast } from "sonner";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import CustomButton from "@/shared/components/custom/CustomButton";
import { useUpdateCourseByTeacher } from "../hooks/useCourse";
import { UploadThumbnail } from "../apiOperations";

const ThumbnailForm = ({ image, courseId }: { image: string | null; courseId: string }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState<string | null>(image);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: UpdateCourse, isPending: isUpdating } = useUpdateCourseByTeacher();

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    setPreview(image);
    setUploadedImage(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // INSTANT PREVIEW

    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await UploadThumbnail(formData);

      setUploadedImage(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!uploadedImage) {
      toast.error("Please upload image first");
      return;
    }

    try {
      await UpdateCourse({
        courseId,
        data: {
          image: uploadedImage.url,
          image_public_id: uploadedImage.public_id,
        },
      });

      toast.success("Thumbnail updated");
      setIsEdit(false);
    } catch (error) {
      console.log(error);

      toast.error("Update failed");
    }
  };

  /* -----------------------------------CLEANUP--------------------------------------- */

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Course Thumbnail</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit ? "bg-transparent text-slate-500" : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* BODY */}

      <div className="mt-3">
        <AspectRatio ratio={16 / 9}>
          <div className="group relative h-full w-full overflow-hidden rounded-md">
            {preview ? (
              <Image
                src={preview}
                alt="thumbnail"
                loading="eager"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-gray-100">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />

                <p className="text-sm text-gray-500">No image uploaded</p>
              </div>
            )}

            {/* EDIT OVERLAY */}

            {isEdit && (
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Upload className="mb-1 h-6 w-6 text-white" />

                <p className="text-sm font-medium text-white">Change Thumbnail</p>

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

        {/* ACTIONS */}

        {isEdit && (
          <div className="mt-4 flex gap-4">
            <CustomButton
              onClick={handleSave}
              disabled={!uploadedImage || isUploading || isUpdating}
              loading={isUploading || isUpdating}
              loadingText={isUploading ? "Uploading..." : "Saving..."}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save
            </CustomButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThumbnailForm;
