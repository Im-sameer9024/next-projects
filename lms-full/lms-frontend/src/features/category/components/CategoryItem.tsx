"use client";

import { cn } from "@/shared/lib/utils";

import CustomButton from "@/shared/components/custom/CustomButton";
import { filtersProps } from "@/features/search/search";

interface CategoryItemProps {
  label: string;
  isActive?: boolean;
  value: string;
  onClick?: () => void;
  setFilters: React.Dispatch<React.SetStateAction<filtersProps>>;
  filters: filtersProps;
}

const CategoryItem = ({ label, value, setFilters, filters }: CategoryItemProps) => {
  const isSelected = filters.categoryId === value;

  const onSearchClick = () => {
    setFilters((prev) => ({
      ...prev,

      categoryId: prev.categoryId === value ? "" : value,

      page: 1,
    }));
  };

  return (
    <CustomButton
      onClick={onSearchClick}
      variant="outline"
      className={cn(
        "rounded-full border px-5 py-2.5",
        "text-sm font-medium",
        "transition-all duration-200",
        "bg-white hover:bg-slate-50",
        "border-slate-200 text-slate-700",
        "shadow-sm hover:shadow-md",
        isSelected && "border-slate-400 bg-slate-50 ring-1 ring-slate-300",
      )}
    >
      {label}
    </CustomButton>
  );
};

export default CategoryItem;
