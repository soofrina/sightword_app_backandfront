import { selector } from "recoil";
import atom from "@recoil/add-teacher/atom";
import { AddTeacherData } from "@base/type/addTeacher";
import { TeacherData } from "@base/type/dataTypes";

const addTeacherSelector = selector<TeacherData[]>({
  key: "addTeacherSelector",
  get: ({ get }) => get(atom).selectedTeachers,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: AddTeacherData = {
      ...state,
      selectedTeachers: newValue as TeacherData[],
    };
    set(atom, newState);
  },
});

export default addTeacherSelector;
