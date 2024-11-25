import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../localStorage";

export const isTokenExpired = (token: any) => {
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
    const expiryTime = payload.exp * 1000; // Convert expiry time from seconds to milliseconds
    const currentTime = Date.now();
    return currentTime >= expiryTime; // Token is expired if current time is greater than or equal to expiry time
  } catch (error) {
    console.error("Error decoding token payload:", error);
    return true; // Assume token is expired if there's an error decoding the payload
  }
};

export const token = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) {
    return null;
  } else if (isTokenExpired(token)) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS?.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS?.TOKEN);
    // window.location.replace(ROUTES.SIGNIN);
  }

  return token;
};
export const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  function (config: any) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
      secureddata: "getall",
    };

    // If there is no token, delete if from the header before making a request
    if (!token()) {
      delete config.headers.Authorization;
    }
    // you can also do other modification in config
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(undefined, async function (error) {
  if (error?.response?.status === 401 && token()) {
    localStorage.clear();
    // window.location.replace(ROUTES.SIGNIN);
  }
  return Promise.reject(error);
});

export const getData = async (url: string, p0?: { headers: { Authorization: string; }; }) => {
  const { data } = await axiosInstance({
    method: "get",
    url,
  });
  return data;
};

export const postData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "POST",
    url,
    data: reqBody,
  });
  return data;
};

export const patchData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "PATCH",
    url,
    data: reqBody,
  });
  return data;
};

export const putData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "PUT",
    url,
    data: reqBody,
  });
  return data;
};

export const deleteData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "DELETE",
    url,
    data: reqBody,
  });
  return data;
};
