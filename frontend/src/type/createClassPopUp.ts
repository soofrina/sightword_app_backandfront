import { CentreData } from "./dataTypes";

export enum CreateClassAddMethod {
  NOT_SELECTED = "not_selected",
  IMPORT = "import",
  MANUAL = "manual",
}

export interface CreateClassData {
  startTime: string;
  endTime: string;
  selectedStudents: OptionData[];
  selectedTeachers: OptionData[];
  day: string;
  centre: CentreData;
}

export interface OptionData {
  id: string;
  email: string;
  name: string;
  role: OptionDataRole;
}

export enum OptionDataRole {
  STUDENT = "student",
  TEACHER = "teacher",
}

export const expectedHeaders = ["id", "email", "name", "role"];

export const IMPORT_INVALID_EMAIL =
  "The file you uploaded contains row(s) with invalid email addresses.";
export const IMPORT_INVALID_HEADERS =
  "The file you uploaded has invalid headers.";
export const IMPORT_INVALID_ROLE =
  "The file you uploaded contains row(s) with invalid roles.";
