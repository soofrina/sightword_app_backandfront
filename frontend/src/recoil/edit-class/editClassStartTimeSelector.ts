import { selector } from "recoil";
import atom from "@recoil/edit-class/atom";
import { EditClassData } from "@base/type/editClassPopUp";

const editClassStartTimeSelector = selector<string>({
  key: "editClassStartTimeSelector",
  get: ({ get }) => get(atom).startTime,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: EditClassData = { ...state, startTime: newValue as string };
    set(atom, newState);
  },
});

export default editClassStartTimeSelector;
