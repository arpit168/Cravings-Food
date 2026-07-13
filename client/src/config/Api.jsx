import axios from "axios";

export const resolveBaseURL = (
  configuredUrl = "",
  fallbackUrl = import.meta.env?.PROD ? "https://cravings-food.onrender.com" : "http://localhost:4500"
) => {
  const trimmedConfiguredUrl = configuredUrl?.trim();
  if (trimmedConfiguredUrl) {
    return trimmedConfiguredUrl.replace(/\/+$/, "");
  }

  const trimmedFallbackUrl = fallbackUrl?.trim();
  if (trimmedFallbackUrl) {
    return trimmedFallbackUrl.replace(/\/+$/, "");
  }

  return "http://localhost:4500";
};

const axiosInstance = axios.create({
  baseURL: resolveBaseURL(import.meta.env?.VITE_BACKEND_BASE_URL),
  withCredentials: true,
});

export default axiosInstance;