import { TeacherData } from "./dataTypes";

export interface OptionData {
  email: string;
  name: string;
}

export interface AddTeacherData {
  selectedTeachers: TeacherData[];
}
