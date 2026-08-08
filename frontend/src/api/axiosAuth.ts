import { UserToken } from "@base/type/user";
import { tokenAtom, userAtom } from "@recoil/user/atom";
import axios from "axios";
import { toast } from "react-toastify";
import { getRecoil, resetRecoil, setRecoil } from "recoil-nexus";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(async (config) => {
  const token = getRecoil(tokenAtom);
  if (token.accessToken) {
    config.headers["Authorization"] = `Bearer ${token.accessToken}`;
  }
  return config;
});

const getErrorMessage = (error: any) => {
  if (
    error.response &&
    (error.response.data.message || error.response.data.message?.message)
  ) {
    // can either be error.response.data.message or error.response.data.message.message
    if (typeof error.response.data.message === "string") {
      return `Error ${error.response.status}: ${error.response.data.message}`;
    } else {
      return `Error ${error.response.status}: ${error.response.data.message.message}`;
    }
  }
  return `Error ${error.response.status}: Something went wrong.`;
};

axiosAuth.interceptors.response.use(
  (response) => {
    // Display a success message for POST, PUT, or DELETE methods
    const method = response.config.method?.toUpperCase() || "";
    if (
      ["POST", "PUT", "DELETE"].includes(method) &&
      (response.status === 200 || response.status === 201)
    ) {
      toast.success("Operation successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const token = getRecoil(tokenAtom);

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Auto Refreshing Token");
      // set as true to prevent infinite loop
      originalRequest._retry = true;
      // Make a call with the refresh cookie to obtain a new token
      const refreshResponse = await axios.post<UserToken>(
        `${API_URL}/authentication/refresh`,
        { refreshToken: token.refreshToken },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        },
      );
      if (
        refreshResponse.status !== 204 &&
        refreshResponse.status !== 201 &&
        refreshResponse.status !== 200
      ) {
        console.log("Failed to refresh token");
        toast.error("Session expired, please login again.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        resetRecoil(userAtom);
        throw error;
      }
      setRecoil(tokenAtom, refreshResponse.data);
      // Retry the original request with the new token
      return axiosAuth(originalRequest);
    }
    toast.error(getErrorMessage(error), {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    // Throw the error if it's not related to token expiration or refresh
    throw error;
  },
);

export default axiosAuth;
