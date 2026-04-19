"use client";

import React, { useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { createqueryClient } from "./reactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createqueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        {children}
         {process.env.NODE_ENV == "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default GlobalProvider;
