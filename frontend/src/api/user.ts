import { UserResponse } from "@base/type/user";
import axios from "axios";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
// Queries

export const login = (token: string) => {
  // use normal axios as not logged in yet
  return axios.post<UserResponse>(`${API_URL}/authentication/google`, {
    token,
  });
};

// For testing purposes only, not used in production
export const refresh = (accessToken: string, refreshToken: string) => {
  return axios.post(
    `${API_URL}/authentication/refresh`,
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// For testing purposes only, not used in production
export const devLogin = (email: string) => {
  return axios.post<UserResponse>(`${API_URL}/authentication/development`, {
    email,
  });
};
