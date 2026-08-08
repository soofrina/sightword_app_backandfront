import { selector } from "recoil";
import atom from "@recoil/edit-class/atom";
import { EditClassData } from "@base/type/editClassPopUp";

const editClassCentreIdSelector = selector<string>({
  key: "editClassCentreIdSelector",
  get: ({ get }) => get(atom).centreId,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: EditClassData = { ...state, centreId: newValue as string };
    set(atom, newState);
  },
});

export default editClassCentreIdSelector;
