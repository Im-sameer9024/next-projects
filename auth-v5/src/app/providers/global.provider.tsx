import React from "react";
import { Toaster } from "sonner";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster richColors position="bottom-right"/>
      {children}
    </>
  );
};

export default GlobalProvider;
