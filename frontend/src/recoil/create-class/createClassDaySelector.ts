import { selector } from "recoil";
import atom from "@recoil/create-class/atom";
import { CreateClassData } from "@base/type/createClassPopUp";

const createClassDaySelector = selector<string>({
  key: "createClassDaySelector",
  get: ({ get }) => get(atom).day,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: CreateClassData = { ...state, day: newValue as string };
    set(atom, newState);
  },
});

export default createClassDaySelector;
