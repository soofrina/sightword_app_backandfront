import { CentreData } from "@type/dataTypes";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Queries

export const getAllCentres = () => {
  return axiosAuth.get<CentreData[]>(`${API_URL}/centres`);
};

export const getCentreById = (id: string) => {
  return axiosAuth.get<CentreData>(`${API_URL}/centres/${id}`);
};

export const getClassesFromCentre = (id: string) => {
  return axiosAuth.get(`${API_URL}/centres/${id}/classes`);
};

export const removeClassFromCentre = (id: string, classId: string) => {
  return axiosAuth.get(`${API_URL}/centres/${id}/classes/${classId}`);
};

export const createCentres = (centre: string[]) => {
  return axiosAuth.post(`${API_URL}/centres/`, centre);
};

export const updateCentre = (id: string, centre: CentreData) => {
  return axiosAuth.put(`${API_URL}/centres/${id}`, centre);
};

export const deleteCentre = (id: string) => {
  return axiosAuth.delete(`${API_URL}/centres/${id}`);
};
