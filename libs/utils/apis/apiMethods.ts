import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEYS } from "../localStorage";

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true; // Token is considered expired if it's null or undefined
  }

  const [, payloadBase64] = token.split(".");
  if (!payloadBase64) {
    return true; // Token is considered expired if payload is missing
  }

  try {
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const expiryTime = payload.exp * 100000; // Convert expiry time from seconds to milliseconds
    const currentTime = Date.now();
    return currentTime >= expiryTime; // Token is expired if current time is greater than or equal to expiry time
  } catch (error) {
    console.error("Error decoding token payload:", error);
    return true; // Assume token is expired if there's an error decoding the payload
  }
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS?.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS?.TOKEN);
    // window.location.replace(ROUTES.SIGNIN);
    return null;
  }

  return token;
};
export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    config.headers = config.headers || {};

    if (config.data instanceof FormData) {
      // For multipart/form-data, let the browser set the Content-Type
      delete config.headers["Content-Type"];
    } else {
      // For other cases, default to application/json
      config.headers["Content-Type"] = "application/json";
    }

    config.headers.secureddata = "getall";

    // If there is no token, delete if from the header before making a request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    // you can also do other modification in config
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && getToken()) {
      localStorage.clear();
      // window.location.replace(ROUTES.SIGNIN);
    }
    return Promise.reject(error);
  }
);

export const getData = async (url: string, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.get(
    url,
    config,
  );
  return data;
};

export const postData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.post(
    url,
    reqBody,
    config,
  );
  return data;
};

export const patchData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.patch(
    url,
    reqBody,
    {
      ...config,
      headers: {
        ...config?.headers,
        // If reqBody is FormData, don't set Content-Type
        ...(!(reqBody instanceof FormData) && { "Content-Type": "application/json" }),
      },
    }
  );
  return data;
};

export const putData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.put(
    url,
    reqBody,
    config,
  );
  return data;
};

export const deleteData = async (url: string, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.delete(
    url,
    config,
  );
  return data;
};
