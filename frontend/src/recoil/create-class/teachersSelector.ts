import { selector } from "recoil";
import atom from "@recoil/create-class/atom";
import { CreateClassData, OptionData } from "@type/createClassPopUp";

const createClassTeachersSelector = selector<OptionData[]>({
  key: "createClassTeachersSelector",
  get: ({ get }) => get(atom).selectedTeachers,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: CreateClassData = {
      ...state,
      selectedTeachers: newValue as OptionData[],
    };
    set(atom, newState);
  },
});

export default createClassTeachersSelector;
