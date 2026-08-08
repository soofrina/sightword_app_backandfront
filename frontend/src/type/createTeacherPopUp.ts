import { OptionData } from "@base/type/appSelect";
import { Role } from "./user";

export interface CreateTeacherWithClassData {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  role: Role;
  learningCentres: string;
  classes: Array<OptionData | null>;
}
