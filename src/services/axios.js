import axios from "axios";
import {clearAuthData, loadToken} from "./auth/utils";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachAuthToken = (config) => {
  const authToken = loadToken();
  if (!!authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
};

const handleResponse = (response) => {
  if (response?.status === 201 || response?.status === 200) {
    return response;
  } else if (response?.status === 204) {
    return Promise.resolve(null);
  } else {
    const errorMessage = response?.data ?? "Something Went Wrong";
    return Promise.reject(errorMessage);
  }
};

const handleError = (error) => {
  let errorMessage = "Something Went Wrong !!";
  if (error.response) {
    errorMessage =
      error?.response?.data?.message ??
      error?.toString() ??
      "Something Went Wrong";
    if (error?.response?.status === 401) {
      clearAuthData();
      window.location.replace("/auth/login");
    }
  } else {
    if (navigator.onLine) {
      errorMessage = "Server Not Responding !! Try Again after some time ";
    } else {
      errorMessage = "Please, Check Network Connection !!";
    }
  }
  return Promise.reject(errorMessage);
};

axiosInstance.interceptors.request.use(attachAuthToken, (error) => {
  return Promise.reject(error);
});
axiosInstance.interceptors.response.use(handleResponse, handleError);

export default axiosInstance;
