import { OptionData } from "@base/type/appSelect";

export interface CreateStudentWithClassData {
  id: string;
  studentId: string;
  name: string;
  email: string;
  status: string;
  comment: string;
  learningCentre: string;
  class1: OptionData | null;
  class2: OptionData | null;
}
