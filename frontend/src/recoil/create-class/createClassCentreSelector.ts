import { selector } from "recoil";
import atom from "@recoil/create-class/atom";
import { CreateClassData } from "@base/type/createClassPopUp";
import { CentreData } from "@base/type/dataTypes";

const createClassCentreSelector = selector<CentreData>({
  key: "createClassCentreSelector",
  get: ({ get }) => get(atom).centre,
  set: ({ get, set }, newValue) => {
    const state = get(atom);
    const newState: CreateClassData = {
      ...state,
      centre: newValue as CentreData,
    };
    set(atom, newState);
  },
});

export default createClassCentreSelector;
