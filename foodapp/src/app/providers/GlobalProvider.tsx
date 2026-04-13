"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { createqueryClient } from "./reactQuery";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createqueryClient());

  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>

        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV == "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default GlobalProvider;
