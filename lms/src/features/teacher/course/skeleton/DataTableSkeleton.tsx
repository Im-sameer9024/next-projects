"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const DataTableSkeleton = ({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i} className="py-3 first:pl-5 last:pr-5">
                  <div className="h-3.5 w-20 animate-pulse rounded-md bg-slate-200" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`border-b border-slate-100 last:border-0 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="py-3.5 first:pl-5 last:pr-5"
                  >
                    <div
                      className="h-4 animate-pulse rounded-md bg-slate-200"
                      style={{
                        width: colIndex === columns - 1 ? "2rem" : "100%",
                        animationDelay: `${rowIndex * 40 + colIndex * 20}ms`,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-1">
        <div className="h-3.5 w-36 animate-pulse rounded-md bg-slate-200" />
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 animate-pulse rounded-md bg-slate-200"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTableSkeleton;