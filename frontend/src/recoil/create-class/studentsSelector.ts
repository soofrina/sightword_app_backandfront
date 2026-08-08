import { selector } from "recoil";
import atom from "@recoil/create-class/atom";
import { CreateClassData, OptionData } from "@type/createClassPopUp";

const createClassStudentsSelector = selector<OptionData[]>({
  key: "createClassStudentsSelector",
  get: ({ get }) => get(atom).selectedStudents,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: CreateClassData = {
      ...state,
      selectedStudents: newValue as OptionData[],
    };
    set(atom, newState);
  },
});

export default createClassStudentsSelector;
