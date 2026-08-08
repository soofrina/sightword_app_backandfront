import { LessonJourneySection, Progress, QuizScore } from "@base/type/lessonJourney";
import { atom } from "recoil";

export interface LearningJourneyState {
  currentProgress: Progress;
  maxProgress: Progress;

  leftButtonDisabled: boolean;
  rightButtonDisabled: boolean;

  hintHelperDisplayed: boolean;

  scores: QuizScore[];
}

const initState: LearningJourneyState = {
  currentProgress: {
    section: LessonJourneySection.LRP,
    wordIdx: 0,
    lrpSubstage: 0,
    quizSubstage: 0,
    resultSubstage: 0,
  },

  maxProgress: {
    section: LessonJourneySection.LRP,
    wordIdx: 0,
    lrpSubstage: 0,
    quizSubstage: 0,
    resultSubstage: 0,
  },

  leftButtonDisabled: false,
  rightButtonDisabled: false,

  hintHelperDisplayed: true,

  scores: [],
};

const learningJourneyAtom = atom<LearningJourneyState>({
  key: "learningJourneyAtom",
  default: initState,
});

export default learningJourneyAtom;
