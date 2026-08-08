export interface LessonJourneyState {
  wordNum: number;
  currentStage: LessonJourneyStage;
}

export enum LessonJourneySection {
  LRP,
  Quiz,
  Result,
}

export interface Progress {
  section: LessonJourneySection;
  // current idx of word from list of words
  wordIdx: number;
  lrpSubstage: number;
  quizSubstage: number;
  resultSubstage: number;
}

export enum StepStatus {
  NOT_COMPLETED = "NOT_COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPELTED",
}

export type JourneyStep = {
  label: string;
  status: StepStatus;
  onClick: () => void;
  isLarge: boolean;
  innerText: string;
};

export enum LessonJourneyStage {
  SHOW_WORD = 0,
  SHOW_WORD_AUDIO_SENTENCE = 1,
  TRACE_WORD = 2,
  WORD_CLOUD = 3,
  FILL_WORD = 4,
  SENTENCE = 5,
  IMAGE_DRAW = 6,
  REVIEW = 7,
  REVIEW_TYPE = 8,
  REVIEW_TRACE = 9,
}

export enum LessonJourneyRecapStage {
  SHOW_WORD = 0,
  SHOW_WORD_AUDIO_SENTENCE = 1,
  TRACE_WORD = 2,
  WORD_CLOUD = 3,
  FILL_WORD = 4,
  SENTENCE = 5,
  IMAGE_DRAW = 6,
  REVIEW = 7,
  REVIEW_TYPE = 8,
  REVIEW_TRACE = 9,
}

export enum QuizStage {
  WRITE_WORD = 0,
  FILL_BLANK = 1,
}

export enum ResultsStage {
  SCORE = 0,
  BREAKDOWN = 1,
}

export interface QuizScore {
  wordAttemptId?: string,
  scoreOne: number,
  scoreTwo: number,
}

