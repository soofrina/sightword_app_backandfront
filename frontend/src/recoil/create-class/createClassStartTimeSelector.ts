import { selector } from "recoil";
import atom from "@recoil/create-class/atom";
import { CreateClassData } from "@base/type/createClassPopUp";

const createClassStartTimeSelector = selector<string>({
  key: "createClassStartTimeSelector",
  get: ({ get }) => get(atom).startTime,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: CreateClassData = {
      ...state,
      startTime: newValue as string,
    };
    set(atom, newState);
  },
});

export default createClassStartTimeSelector;
