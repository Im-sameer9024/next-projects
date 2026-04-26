"use client";

import React, { useState } from "react";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "./reactQuery";
import AppContextProvider from "./context/AppContextProvider";
import { SessionProvider } from "next-auth/react";
const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <Toaster richColors position="top-right" closeButton />
          {children}
          {process.env.NODE_ENV == "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </AppContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default GlobalProvider;
