"use client";

import React from "react";

import {
  BookOpen,
  Camera,
  Dumbbell,
  Music,
  Calculator,
  Code2,
  BrainCircuit,
  Cog,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { cn } from "@/shared/lib/utils";

import CustomButton from "@/shared/components/custom/CustomButton";

interface CategoryItemProps {
  label: string;
  isActive?: boolean;
  value: string;
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  "Computer Science": <BookOpen className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Fitness: <Dumbbell className="w-4 h-4" />,
  Photography: <Camera className="w-4 h-4" />,
  Accounting: <Calculator className="w-4 h-4" />,
  Development: <Code2 className="w-4 h-4" />,
  Ai: <BrainCircuit className="w-4 h-4" />,
  Engineering: <Cog className="w-4 h-4" />,
};

const CategoryItem = ({ label, value }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onSearchClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle || undefined,
          categoryId: isSelected ? undefined : value,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );

    router.push(url);
  };

  return (
    <CustomButton
      onClick={onSearchClick}
      variant="outline"
      leftIcon={
        <span className="text-slate-600">
          {iconMap[label] || <BookOpen className="w-4 h-4" />}
        </span>
      }
      className={cn(
        "rounded-full border px-5 py-2.5",
        "text-sm font-medium",
        "transition-all duration-200",
        "bg-white hover:bg-slate-50",
        "border-slate-200 text-slate-700",
        "shadow-sm hover:shadow-md",
        isSelected && "border-slate-400 ring-1 ring-slate-300 bg-slate-50",
      )}
    >
      {label}
    </CustomButton>
  );
};

export default CategoryItem;
