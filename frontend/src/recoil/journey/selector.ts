import { selector } from "recoil";
import atom from "@recoil/journey";
import { Progress, QuizScore } from "@base/type/lessonJourney";

export const progressSelector = selector<Progress>({
  key: "progressSelector",
  get: ({ get }) => get(atom).currentProgress,
  set: ({ get, set }, newValue) => {
    set(atom, { ...get(atom), currentProgress: newValue as Progress });
  },
});

export const disableLeftButtonSelector = selector<boolean>({
  key: "disableLeftButtonSelector",
  get: ({ get }) => get(atom).leftButtonDisabled,
  set: ({ get, set }, newValue) => {
    set(atom, { ...get(atom), leftButtonDisabled: newValue as boolean });
  },
});

export const disableRightButtonSelector = selector<boolean>({
  key: "disableRightButtonSelector",
  get: ({ get }) => get(atom).rightButtonDisabled,
  set: ({ get, set }, newValue) => {
    set(atom, { ...get(atom), rightButtonDisabled: newValue as boolean });
  },
});

export const scoreSelector = selector<QuizScore[]>({
  key: "scoreSelector",
  get: ({ get }) => get(atom).scores,
  set: ({ get, set }, newValue) => {
    set(atom, { ...get(atom), scores: newValue as QuizScore[] });
  },
});

export const maxProgressSelector = selector<Progress>({
  key: "maxProgressSelector",
  get: ({ get }) => get(atom).maxProgress,
  set: ({ get, set }, newValue) => {
    set(atom, { ...get(atom), maxProgress: newValue as Progress });
  },
});
