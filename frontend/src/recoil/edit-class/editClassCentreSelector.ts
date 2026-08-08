import { selector } from "recoil";
import atom from "@recoil/edit-class/atom";
import { EditClassData } from "@base/type/editClassPopUp";

const editClassCentreSelector = selector<string>({
  key: "editClassCentreSelector",
  get: ({ get }) => get(atom).centre,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: EditClassData = { ...state, centre: newValue as string };
    set(atom, newState);
  },
});

export default editClassCentreSelector;
