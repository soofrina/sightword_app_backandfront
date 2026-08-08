import { CreateClassData } from "@base/type/createClassPopUp";
import { atom } from "recoil";

const initState: CreateClassData = {
  selectedStudents: [],
  selectedTeachers: [],
  startTime: "",
  endTime: "",
  day: "",
  centre: {
    id: "",
    name: "",
  },
};

const createClassAtom = atom<CreateClassData>({
  key: "createClassAtom",
  default: initState,
});

export default createClassAtom;
