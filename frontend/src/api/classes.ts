import {
  ClassData,
  ClassDataStudentsTeachers,
  CreateClassData,
  EditClassData,
} from "@type/dataTypes";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export type TeacherToClassData = {
  teacherId: string;
  isFormTeacher: boolean;
};

export type StudentToClassData = {
  studentId: string;
};

export type CreateClassResponseData = {
  data: ClassData;
};

// Queries
export const getAllClasses = () => {
  return axiosAuth.get<ClassData[]>(`${API_URL}/classes`);
};

export const getAllClassesV2 = () => {
  return axiosAuth.get<ClassDataStudentsTeachers[]>(`${API_URL}/classes`);
};

export const getClassById = (id: string) => {
  return axiosAuth.get<ClassDataStudentsTeachers>(`${API_URL}/classes/${id}`);
};

export const getClassesByTeacherId = (teacherId: string) => {
  return axiosAuth.get<ClassDataStudentsTeachers[]>(
    `${API_URL}/classes?teacherId=${teacherId}`,
  );
};

export const createClass = async (classData: CreateClassData) => {
  return (await axiosAuth.post<ClassData>(`${API_URL}/classes`, classData))
    .data;
};

export const updateClass = (id: string, classData: EditClassData) => {
  return axiosAuth.put(`${API_URL}/classes/${id}`, classData);
};

export const deleteClass = (classId: string) => {
  return axiosAuth.delete(`${API_URL}/classes/${classId}`);
};

// Class <-> Teacher Queries

export const getTeachersFromClass = (id: string) => {
  return axiosAuth.get(`${API_URL}/classes/${id}/teachers`);
};

export const addTeacherToClass = (
  id: string,
  teacherData: TeacherToClassData,
) => {
  return axiosAuth.post(`${API_URL}/classes/${id}/teachers`, teacherData);
};

export const removeTeacherFromClass = (id: string, teacherId: string) => {
  return axiosAuth.delete(`${API_URL}/classes/${id}/teachers/${teacherId}`);
};

// Class <-> Student Queries

export const getStudentsFromClass = (id: string) => {
  return axiosAuth.get(`${API_URL}/classes/${id}/students`);
};

export const addStudentToClass = (
  id: string,
  studentData: StudentToClassData,
) => {
  return axiosAuth.post(`${API_URL}/classes/${id}/students`, studentData);
};

export const removeStudentFromClass = (id: string, studentId: string) => {
  return axiosAuth.delete(`${API_URL}/classes/${id}/students/${studentId}`);
};

export const getClassesOfStudent = (studentId: string) => {
  return axiosAuth.get<ClassDataStudentsTeachers[]>(
    `${API_URL}/classes?studentId=${studentId}`,
  );
};

// Helpers

export const militaryTimeToDefaultFormat = (time: string) => {
  const strSplit = time.split(":");
  const hour = parseInt(strSplit[0]);
  const min = parseInt(strSplit[1]);

  let minStr = min.toString();
  if (min < 10) {
    minStr = "0" + min;
  } else if (min === 0) {
    minStr = "00";
  }

  return `${hour > 12 ? hour - 12 : hour}${"." + minStr}${
    hour > 11 ? "pm" : "am"
  }`;
};
