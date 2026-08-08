import { CreateTeacherWithClassData } from "@base/type/createTeacherPopUp";
import { atom } from "recoil";

const initState: CreateTeacherWithClassData = {
  id: "",
  teacherId: "",
  name: "",
  email: "",
  role: "teacher",
  learningCentres: "",
  classes: [null, null],
};

const createTeacherAtom = atom<CreateTeacherWithClassData>({
  key: "createTeacherAtom",
  default: initState,
});

export default createTeacherAtom;
