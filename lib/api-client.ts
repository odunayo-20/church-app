import axios from "axios";
import { logger } from "@/lib/logger";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: parseInt(process.env.API_TIMEOUT ?? "15000"),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    logger.debug(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error("Request error", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        (error.response?.data as Record<string, unknown>)?.message ??
        error.message;
      logger.error(`API error ${status}: ${message}`, {
        url: error.config?.url,
        status,
      });
    }
    return Promise.reject(error);
  },
);

export default apiClient;
