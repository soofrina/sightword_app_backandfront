import { StudentData, StudentMassData } from "@type/dataTypes";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Types

export type UpdateStudentData = {
  name: string;
  student_id: string;
  comment: string;
};

export type CreateStudentData = UpdateStudentData & { email: string };

// Queries

export const getMassStudents = async () => {
  return await axiosAuth.get<StudentMassData[]>(`${API_URL}/students/mass`);
};

export const getAllStudents = () => {
  return axiosAuth.get<StudentData[]>(`${API_URL}/students`);
};

export const getStudentById = (id: string) => {
  return axiosAuth.get<StudentData>(`${API_URL}/students/${id}`);
};

export const createStudents = (students: CreateStudentData[]) => {
  return axiosAuth.post(`${API_URL}/students`, students);
};

export const bulkCreateStudents = (
  formData: FormData,
  signal: AbortSignal | undefined,
  setUploadProgress: (progress: number) => void,
) => {
  return axiosAuth.post(`${API_URL}/students/bulk`, formData, {
    signal: signal,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total == undefined) return;

      setUploadProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total),
      );
    },
  });
};

export const updateStudent = (id: string, student: UpdateStudentData) => {
  return axiosAuth.put(`${API_URL}/students/${id}`, student);
};

export const deleteStudent = (id: string) => {
  return axiosAuth.delete(`${API_URL}/students/${id}`);
};
