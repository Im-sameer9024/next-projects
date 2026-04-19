/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//----------------- Main axios instance ---------------------
export const axiosInstance = axios.create({
  baseURL:BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 sec
});

//----------------- Connector function ---------------------
interface ApiConnectorProps {
  method: AxiosRequestConfig["method"];
  url: string;
  bodyData?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const apiConnector = async <T = any>({
  method,
  url,
  bodyData,
  headers,
  params,
}: ApiConnectorProps): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    method,
    url,
    data: bodyData ?? {},
    headers: headers ?? {},
    params: params ?? {},
  });
};
