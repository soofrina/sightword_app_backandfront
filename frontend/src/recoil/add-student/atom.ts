import { AddStudentData } from "@base/type/addStudent";
import { atom } from "recoil";

const initState: AddStudentData = {
  selectedStudents: [],
};

const addStudentAtom = atom<AddStudentData>({
  key: "addStudentAtom",
  default: initState,
});

export default addStudentAtom;
