import { StudentData } from "./dataTypes";

export interface OptionData {
  email: string;
  name: string;
}

export interface AddStudentData {
  selectedStudents: StudentData[];
}
