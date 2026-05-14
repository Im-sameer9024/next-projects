import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import useDebounce from "@/hooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

const SearchInput = () => {
  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("category");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  return (
    <div className=" relative">
      <Search className="h-4 w-4 absolute -translate-y-1/2 top-1/2 left-2 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-75 pl-9 rounded-full bg-slate-100 focus-visible::ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
