"use client";

import { useEffect } from "react";


import { useAuthStore } from "@/shared/store/auth.store";
import { axiosInstance } from "@/services/apiConnector";

const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    setAuth,
    setLoading,
    logout
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response =
          await axiosInstance.get(
            "/auth/refresh-token"
          );

        const {
          accessToken,
          user,
        } = response.data.data;

        setAuth(
          accessToken,
          user
        );

      } catch (error) {
        logout();
        console.log(error);

      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth, setLoading,logout]);

  return children;
};

export default AuthProvider;