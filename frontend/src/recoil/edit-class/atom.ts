import { EditClassData } from "@base/type/editClassPopUp";
import { atom } from "recoil";

const initState: EditClassData = {
  centre: "",
  centreId: "",
  startTime: "",
  endTime: "",
  startDay: 1,
  endDay: 1,
};

const createClassAtom = atom<EditClassData>({
  key: "editClassAtom",
  default: initState,
});

export default createClassAtom;
