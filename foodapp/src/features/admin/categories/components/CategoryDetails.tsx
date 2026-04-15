"use client";

import { SingleCategoryProps } from "@/shared/types/category";
import Image from "next/image";

const CategoryDetails = ({ category }: { category: SingleCategoryProps }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Image */}
      <div className="relative w-full h-60 rounded-xl overflow-hidden">
        <Image
          src={category.image}
          alt={category.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />

        {/* Overlay Title */}
        <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white px-4 py-2 text-lg font-semibold">
          {category.title}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        {/* Description */}
        <div>
          <span className="text-xs text-gray-400 uppercase">Description</span>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Slug */}
        <div>
          <span className="text-xs text-gray-400 uppercase">Category slug</span>
          <p className="text-sm text-gray-500 mt-1">{category.slug}</p>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between">
          {/* Color */}
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-500">{category.color}</span>
          </div>

          {/* Date */}
          <span className="text-sm text-gray-400">
            {new Date(category.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
