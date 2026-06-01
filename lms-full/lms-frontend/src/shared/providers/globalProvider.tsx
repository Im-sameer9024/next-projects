"use client";

import React, { useState } from "react";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "./reactQuery";
import AuthProvider from "./AuthProvider";
import { PacerProvider } from "@tanstack/react-pacer";
import ConfettiProvider from "./ConfettiProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PacerProvider>
          <NuqsAdapter>
            <Toaster richColors position="top-right" closeButton />
            <ConfettiProvider />

            {children}
          </NuqsAdapter>

          <ReactQueryDevtools initialIsOpen={false} />
        </PacerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
