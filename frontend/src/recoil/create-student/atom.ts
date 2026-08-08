import { CreateStudentWithClassData } from "@base/type/createStudentPopUp";
import { atom } from "recoil";

const initState: CreateStudentWithClassData = {
  id: "",
  studentId: "",
  name: "",
  email: "",
  comment: "",
  status: "",
  learningCentre: "",
  class1: null,
  class2: null,
};

const createStudentAtom = atom<CreateStudentWithClassData>({
  key: "createStudentAtom",
  default: initState,
});

export default createStudentAtom;
