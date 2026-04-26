"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { createContext, useState } from "react";

interface AppContextType {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  router: ReturnType<typeof useRouter>;
  session: ReturnType<typeof useSession>["data"];
  sessionStatus: ReturnType<typeof useSession>["status"];
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  return (
    <AppContext.Provider value={{ globalLoading, setGlobalLoading, router,session,sessionStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
