"use client";

import React, { useEffect, useState } from "react";
import type { Category } from "../../../../generated/prisma/client";
import MenuCard from "../components/MenuCard";
import CardSkeleton from "@/shared/components/skeletons/CardSkeleton";
import { GetAllCategories } from "@/features/admin/categories/apiOperations";

const MenuPage = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetAllCategories();
        setData(res?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] pt-20 px-6 sm:px-10 md:px-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">

        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : data.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}

      </div>
    </main>
  );
};

export default MenuPage;