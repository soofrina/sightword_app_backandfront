import { TeacherData, TeacherMassData } from "@base/type/dataTypes";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Types

export type CreateTeacherData = {
  name: string;
  staff_id: string;
  email: string;
};


// Queries

export const getMassTeachers = () => {
  return axiosAuth.get<TeacherMassData[]>(`${API_URL}/teachers/mass`);
};

export const getAllTeachers = () => {
  return axiosAuth.get<TeacherData[]>(`${API_URL}/teachers`);
};

export const getTeacherById = (id: string) => {
  return axiosAuth.get<TeacherData>(`${API_URL}/teachers/${id}`);
};

export const createTeachers = (teachers: CreateTeacherData[]) => {
  return axiosAuth.post<TeacherData[]>(`${API_URL}/teachers`, teachers);
};

export const updateTeacher = (id: string, teacher: Partial<TeacherData>) => {
  return axiosAuth.put(`${API_URL}/teachers/${id}`, teacher);
};

export const deleteTeacher = (id: string) => {
  return axiosAuth.delete(`${API_URL}/teachers/${id}`);
};
