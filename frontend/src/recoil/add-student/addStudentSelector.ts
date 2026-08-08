import { selector } from "recoil";
import atom from "@recoil/add-student/atom";
import { AddStudentData, OptionData } from "@base/type/addStudent";
import { StudentData } from "@base/type/dataTypes";

const addStudentSelector = selector<StudentData[]>({
  key: "addStudentSelector",
  get: ({ get }) => get(atom).selectedStudents,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: AddStudentData = {
      ...state,
      selectedStudents: newValue as StudentData[],
    };
    set(atom, newState);
  },
});

export default addStudentSelector;
