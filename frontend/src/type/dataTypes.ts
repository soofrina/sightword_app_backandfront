import { DifficultyLevel } from "@base/type/wordBank";

/* eslint-disable camelcase */
import { DateInputSlotsComponent } from "@mui/x-date-pickers/internals/components/PureDateInput";
import { Dayjs } from "dayjs";

export interface Lesson {
  date: string;
  words: WordMeaningData[];
}

export interface LessonProgress {
  lStatus: number;
  pStatus: number;
  rStatus: number;
  qStatus: number;
}

export interface LearningCentre {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  day: string;
  startTime: Dayjs;
  endTime: Dayjs;
  learningCentre: string;
  teachers: TeacherData[];
  students: StudentData[];
}

// Interface for Centre data received from backend.
export interface CentreData {
  id: string;
  name: string;
}

// Interface for Class data received from backend.
export interface ClassData {
  id: string;
  startTime: Date;
  endTime: Date;
  startDay: number;
  endDay: number;
  centreId: string;
  centre?: CentreData;
}

// Interface for Class data to send to backend to update a class
export interface EditClassData {
  centreId: string;
  startTime: string;
  endTime: string;
  startDay: number;
  endDay: number;
  centre: string;
}

// Interface for Class data (for getClassById) received from backend
export interface ClassDataStudentsTeachers {
  [x: string]:
    | string
    | number
    | boolean
    | Date
    | CentreData
    | StudentData[]
    | TeacherData[];
  isActive: boolean;
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  startDay: number;
  endDay: number;
  centre: CentreData;
  students: StudentData[];
  teachers: TeacherData[];
}

// Interface for Class data for creating new class on backend
export interface CreateClassData {
  startDay: number;
  endDay: number;
  startTime: string;
  endTime: string;
  centreId: string;
}

export interface TeacherData {
  id: string;
  email: string;
  name: string;
  staff_id: string;
}

export interface StudentData {
  id: string;
  email: string;
  name: string;
  studentId: string;
}
// export interface WordData {
//   id: string;
//   word: string;
//   definition: string;
//   sentence: string;
//   comment: string;
//   difficulty: string;
//   audios: string[];
//   images: string[];
// }

export interface WordData {
  id: string;
  word: string;
  difficulty: DifficultyLevel;
  sentence: string;
  comment?: string;
  definition: string;
  images: string[];
  audios: string[];
}

// interface for word data received from backend
export interface WordMeaningData {
  id: string;
  word: string;
  definition: string;
  sentence: string;
  difficulty: string;
  comment: string;
  audios: string[];
  images: string[];
}

// Interface for Lesson data received from backend.
export interface LessonData {
  id: string;
  startDate: Date;
  endDate: Date;
}

export interface LessonWord {
  id: string; // id of lesson word
  wordId: string; // id of word
  lessonId: string; // id of lesson
}

export interface LessonWordData {
  id: string;
  word: WordMeaningData;
  attempts: LessonWordAttempt[];
}

export interface LessonWordAttempt {
  id: string;
  attemptedAt: Date;
  personalisedImageLink: string;
  progress: string;
  imageApprovalStatus: string;
  quizAttempt: QuizAttempt;
  student: StudentData;
  scoreOne: number;
  scoreTwo: number;
}

export interface QuizAttempt {
  id: string;
  attemptedAt: Date;
  scoreOneTotal: number;
  scoreTwoTotal: number;
  scoreOne: number | null;
  scoreTwo: number | null;
  unsubmittedAt: Date | null;
  unsubmittedBy: string | null;
  wordAttemptId: string;
}

export enum ImageApprovalStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum WordAttemptProgress {
  LEARN = "Learn",
  PERSONALISATION = "Personalisation",
  RECALL = "Recall",
  QUIZ = "Quiz",
  COMPLETED = "Completed",
}

export interface CreateLessonData {
  start_date: Date;
  end_date: Date;
  class_id: string;
}

export interface LessonWordData {
  id: string;
  words: WordMeaningData[];
}

export interface CreateLessonWordData {
  word_id: string;
  lesson_id: string;
}

export interface CreatedLessonWordData {
  wordId: string;
  lessonId: string;
  id: string;
}

// Used for rendering of lesson words in word chip.
export interface WordBankWord {
  // Id of word in lessonWords table. If not being used for lesson word purpose, doesn't matter.
  lessonWordId: string;
  word: string;
  // Id of word in Words table
  wordId: string;
}

export interface AdminData {
  id: string;
  email: string;
}
// TODO: reconciliate differences with Class in the future
export interface MassClassData {
  id: string;
  startDay: number;
  startTime: string;
  endDay: number;
  endTime: string;
  centre: CentreData;
  teachers: TeacherData[];
  students: StudentData[];
}

export interface StudentMassData {
  id: string;
  email: string;
  name: string;
  studentId: string;
  classes: MassClassData[];
}

export interface TeacherMassData {
  id: string;
  email: string;
  name: string;
  staffId: string;
  classes: MassClassData[];
}
