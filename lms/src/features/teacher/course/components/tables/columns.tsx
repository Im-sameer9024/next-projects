"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type CourseColumn = {
  id: string;
  title: string;
  price: string | null;
  isPublished: boolean;
};

const ActionsCell = ({ id }: { id: string }) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-slate-100 focus-visible:ring-1 focus-visible:ring-slate-300"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => router.push(`/teacher/courses/${id}`)}
          className="cursor-pointer gap-2 text-slate-700"
        >
          <Pencil className="h-4 w-4 text-slate-500" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<CourseColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 font-semibold text-slate-600 hover:text-slate-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="font-medium text-slate-800 leading-snug">
        {row.original.title}
      </p>
    ),
     sortingFn: (rowA, rowB) => {
      return rowA.original.title
        .toLowerCase()
        .localeCompare(rowB.original.title.toLowerCase());
    },
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 font-semibold text-slate-600 hover:text-slate-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = row.original.price;
      return (
        <p className="text-slate-600 tabular-nums">
          {price ? `₹${price}` : "Free"}
        </p>
      );
    },
    sortingFn: (rowA, rowB) => {
      // 👈 add this here
      const a = parseFloat(rowA.original.price ?? "0");
      const b = parseFloat(rowB.original.price ?? "0");
      return a - b;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 font-semibold text-slate-600 hover:text-slate-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const isPublished = row.original.isPublished;
      return (
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className={
            isPublished
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-100 border-slate-200"
          }
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
     sortingFn: (rowA, rowB) => {
      // Published (true=1) comes after Draft (false=0) when ascending
      return Number(rowA.original.isPublished) - Number(rowB.original.isPublished);
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
];
