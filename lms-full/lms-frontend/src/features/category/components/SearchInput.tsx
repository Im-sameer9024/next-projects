"use client";

import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Search, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { createDebounce } from "@/shared/utils/debounce";
import { filtersProps } from "@/features/search/search";

const SearchInput = ({
  setFilters,
  loading,
}: {
  setFilters: React.Dispatch<React.SetStateAction<filtersProps>>;
  loading: boolean;
}) => {
  const [search, setSearch] = useState("");

  const debouncedSearch = useMemo(
    () =>
      createDebounce((value: string) => {
        setFilters((prev) => ({
          ...prev,

          search: value,

          page: 1,
        }));
      }, 500),

    [setFilters],
  );

  // debounce search
  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <Input
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 border-slate-200 bg-white pr-9 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300"
      />
      <div className="absolute top-1/2 right-3 -translate-y-1/2">
        {loading ? (
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
  );
};

export default SearchInput;
