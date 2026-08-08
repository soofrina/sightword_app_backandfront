import { AdminData } from "@base/type/dataTypes";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export type CreateAdminData = {
  email: string;
};

export const getAllAdmins = () => {
  return axiosAuth.get<AdminData[]>(`${API_URL}/admins`);
};

export const createAdmins = (admins: CreateAdminData[]) => {
  return axiosAuth.post(`${API_URL}/admins`, admins);
};

export const removeAdmin = (adminId: string) => {
  return axiosAuth.delete(`${API_URL}/admins/${adminId}`);
};
