import { useAuthStore } from "@/shared/store/auth.store";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  ResponseType,
} from "axios";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface ApiConnectorProps {
  method: AxiosRequestConfig["method"];
  url: string;
  bodyData?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  responseType?: ResponseType;
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  __skipAuthRefresh?: boolean;
}

interface RefreshTokenResponse {
  data: {
    accessToken: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                              AXIOS INSTANCE                                */
/* -------------------------------------------------------------------------- */

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000,
});

/* -------------------------------------------------------------------------- */
/*                           REQUEST INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },

  (error: AxiosError) => Promise.reject(error),
);

/* -------------------------------------------------------------------------- */
/*                            REFRESH TOKEN LOGIC                             */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

let refreshPromise: Promise<string> | null = null;

/* -------------------------------------------------------------------------- */
/*                          RESPONSE INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    const { setToken, logout } = useAuthStore.getState();

    // Network Error
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Skip refresh endpoint
    if (originalRequest.__skipAuthRefresh) {
      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /*                                HANDLE 401                              */
    /* ---------------------------------------------------------------------- */

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      /* ---------------------- Already Refreshing ---------------------- */

      if (isRefreshing && refreshPromise) {
        try {
          const newAccessToken = await refreshPromise;

          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newAccessToken}`,
          );

          return axiosInstance(originalRequest);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }

      /* ----------------------- Start Refresh Flow ---------------------- */

      isRefreshing = true;

      try {
        refreshPromise = axiosInstance
          .get<RefreshTokenResponse>("/auth/refresh-token", {
            __skipAuthRefresh: true,
          } as RetryRequestConfig)
          .then((res) => res.data.data.accessToken);

        const newAccessToken = await refreshPromise;

        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        // Save new access token
        setToken(newAccessToken);

        // Retry original request
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear auth state
        logout();

        // Redirect user to login
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  },
);

/* -------------------------------------------------------------------------- */
/*                              API CONNECTOR                                 */
/* -------------------------------------------------------------------------- */

export const apiConnector = async ({
  method,
  url,
  bodyData,
  headers,
  params,
  responseType,
}: ApiConnectorProps) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers: headers || {},
    params: params || {},
    responseType: responseType || "json",
  });
};
