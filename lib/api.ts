import apiClient from "@/lib/api-client";
import type { AxiosRequestConfig } from "axios";

export async function get<T>(url: string, config?: AxiosRequestConfig) {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig) {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}
