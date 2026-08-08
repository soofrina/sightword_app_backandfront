import { selector } from "recoil";
import atom from "@recoil/edit-class/atom";
import { EditClassData } from "@base/type/editClassPopUp";

const editClassDaySelector = selector<number>({
  key: "editClassDaySelector",
  get: ({ get }) => get(atom).startDay,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: EditClassData = { ...state, startDay: newValue as number };
    set(atom, newState);
  },
});

export default editClassDaySelector;
