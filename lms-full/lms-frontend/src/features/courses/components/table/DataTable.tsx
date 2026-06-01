/* eslint-disable react-hooks/incompatible-library */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { paginationProps } from "../../course";
import { createDebounce } from "@/shared/utils/debounce";
import { Spinner } from "@/shared/components/ui/spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  data: TData[];

  pagination: paginationProps;

  onPageChange: (page: number) => void;

  onSearchChange: (search: string) => void;

  searchValue: string;
  isSearching?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  onSearchChange,
  searchValue,
  isSearching,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [search, setSearch] = useState(searchValue || "");

  const debouncedSearch = useMemo(
    () =>
      createDebounce((value: string) => {
        onSearchChange(value);
      }, 500),

    [onSearchChange],
  );

  // debounce search
  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const table = useReactTable({
    data,

    columns,

    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,

    getSortedRowModel: getSortedRowModel(),

    state: {
      sorting,
    },

    manualPagination: true,

    pageCount: pagination.totalPages,
  });

  const { page, totalPages, total, limit } = pagination;

  const currentPage = page;

  const totalCourses = total;

  const hasNextPage = currentPage < totalPages;

  const hasPrevPage = currentPage > 1;

  const startEntry = totalCourses === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endEntry = Math.min(currentPage * limit, totalCourses);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 border-slate-200 bg-white pr-9 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300"
        />

        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          {isSearching ? (
            <Spinner className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3 text-xs tracking-wider text-slate-600 uppercase first:pl-5 last:pr-5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  } `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 first:pl-5 last:pr-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-36 text-center">
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="text-2xl">📭</span>

                    <p className="text-sm font-medium">
                      {search ? `No results for "${search}"` : "No courses found"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {search ? "Try another search term" : "Create your first course"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {startEntry}–{endEntry}
            </span>{" "}
            of <span className="font-medium text-slate-700">{totalCourses}</span> courses
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 border-slate-200 p-0 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 p-0 text-xs font-medium transition-all ${
                  page === currentPage
                    ? "border-slate-800 bg-slate-800 text-white hover:bg-slate-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}

            {/* Next */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 border-slate-200 p-0 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
