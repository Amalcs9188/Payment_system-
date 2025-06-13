import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  adapter: "fetch",
});

api.interceptors.request.use(
  async (request) => {
    const token = Cookies.get("token");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    request.headers["Request-Time"] = new Date().toISOString();
    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    
    if (error?.response?.data?.errorMessages) {
      toast.error(error.response.data.errorMessages[0]);
      return Promise.reject(Error(error.response?.data?.errorMessages[0]));
    }
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject(error);
  }
);
