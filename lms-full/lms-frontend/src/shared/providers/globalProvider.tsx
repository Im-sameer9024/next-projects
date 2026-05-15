"use client";

import React, { useState } from "react";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "./reactQuery";
import AuthProvider from "./AuthProvider";
const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors position="top-right" closeButton />
        {children}
        {process.env.NODE_ENV == "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
