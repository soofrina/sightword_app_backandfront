import { AddTeacherData } from "@base/type/addTeacher";
import { atom } from "recoil";

const initState: AddTeacherData = {
  selectedTeachers: [],
};

const addTeacherAtom = atom<AddTeacherData>({
  key: "addTeacherAtom",
  default: initState,
});

export default addTeacherAtom;
