import { selector } from "recoil";
import atom from "@recoil/create-class/atom";
import { CreateClassData } from "@type/createClassPopUp";

const createClassEndTimeSelector = selector<string>({
  key: "createClassEndTimeSelector",
  get: ({ get }) => get(atom).endTime,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: CreateClassData = { ...state, endTime: newValue as string };
    set(atom, newState);
  },
});

export default createClassEndTimeSelector;
