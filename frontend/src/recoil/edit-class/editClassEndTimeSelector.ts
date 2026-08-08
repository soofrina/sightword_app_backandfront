import { selector } from "recoil";
import atom from "@recoil/edit-class/atom";
import { EditClassData } from "@type/editClassPopUp";

const editClassEndTimeSelector = selector<string>({
  key: "editClassEndTimeSelector",
  get: ({ get }) => get(atom).endTime,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: EditClassData = { ...state, endTime: newValue as string };
    set(atom, newState);
  },
});

export default editClassEndTimeSelector;
