"use client";

import Modal from "@/shared/components/custom/Modal";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SingleCategoryProps } from "@/shared/types/category";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CategoryDetails from "./CategoryDetails";

const AdminCategoryCard = ({
  category,
  openDeleteCategoryModal,
  openEditCategoryModal
}: {
  category: SingleCategoryProps;
  openDeleteCategoryModal: (id: number) => void;
  openEditCategoryModal:(id:number) => void;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section
        onClick={() => setShowModal(true)}
        className="relative group bg-white border border-gray-200 rounded-2xl p-4 
                   hover:shadow-xl transition-all duration-300 "
      >
        {/* 🔥 3-dot Menu */}
        <div className="absolute top-3 right-3 z-10 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="hover:cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()} // ✅ prevent modal open
              >
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditCategoryModal(category?.id as number)
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-500 hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteCategoryModal(category?.id as number);
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover rounded-full border"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mt-3">
          {category.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">
          {category.description}
        </p>

        {/* Slug */}
        <p className="text-xs text-gray-400 text-center mt-1">
          {category.slug}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs text-gray-400">{category.color}</span>
          </div>
        </div>
      </section>

      {/* more info show  */}

      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        width="50%"
        content={<CategoryDetails category={category} />}
      />



    </>
  );
};

export default AdminCategoryCard;
