/* eslint-disable camelcase */
import {
  CreateLessonData,
  CreateLessonWordData,
  CreatedLessonWordData,
  LessonData,
  LessonWord,
  LessonWordData,
  QuizAttempt,
  WordAttemptProgress,
} from "@base/type/dataTypes";
import axios from "axios";
import axiosAuth from "./axiosAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// GET /lessons?classId=XXX
export const getLessonsByClassId = (classId: string) => {
  return axiosAuth.get<LessonData[]>(`${API_URL}/lessons?classId=${classId}`);
};

// GET /lessons/:id
export const getLessonsByLessonId = (lessonId: string) => {
  return axiosAuth.get<LessonData>(`${API_URL}/lessons/${lessonId}`);
};

// GET /lessons/student/?studentId=XXX
export const getLessonsByStudentId = (studentId: string) => {
  return axiosAuth.get<LessonData[]>(
    `${API_URL}/lessons/student?studentId=${studentId}`,
  );
};

export const deleteLessonById = (lessonId: string) => {
  return axiosAuth.delete<LessonData[]>(`${API_URL}/lessons/${lessonId}`);
};

// GET /lessonWords?lessonId=XXX
export const getLessonWordsByLessonId = (lessonId: string) => {
  return axiosAuth.get<LessonWordData[]>(
    `${API_URL}/lessonWords?lessonId=${lessonId}`,
  );
};

// GET /lessonWords?lessonId=XXX&studentId=XXX
export const getLessonWordsByLessonIdAndStudentId = (
  lessonId: string,
  studentId: string,
) => {
  return axiosAuth.get<LessonWordData[]>(
    `${API_URL}/lessonWords?lessonId=${lessonId}&studentId=${studentId}`,
  );
};

export const getLessonWordsByMultipleLessonIdAndStudentId = (
  lessonIds: string[],
  studentId: string,
) => {
  const lessonIdParams = lessonIds.map((id) => `lessonIds=${id}`).join("&");
  return axiosAuth.get<LessonWordData[]>(
    `${API_URL}/lessonWords/lessons?${lessonIdParams}&studentId=${studentId}`,
  );
};

export const getLessonWordsById = (lessonWordId: string) => {
  return axiosAuth.get<LessonWord>(`${API_URL}/lessonWords/${lessonWordId}`);
};

export const addLessonWord = (wordId: string, lessonId: string) => {
  const createLessonWordData: CreateLessonWordData = {
    word_id: wordId,
    lesson_id: lessonId,
  };
  return axiosAuth.post<CreatedLessonWordData>(
    `${API_URL}/lessonWords`,
    createLessonWordData,
  );
};

export const removeLessonWord = (lessonWordId: string) => {
  return axiosAuth.delete(`${API_URL}/lessonWords/${lessonWordId}`);
};

export const createLesson = (lessonData: CreateLessonData) => {
  return axiosAuth.post(`${API_URL}/lessons`, lessonData);
};

// POST /word_attempts
export const createNewWordAttempt = (
  lessonWordId: string,
  studentId: string,
) => {
  return axiosAuth.post(`${API_URL}/word_attempts`, {
    lessonWordId,
    studentId,
  });
};

// PUT /word_attempts/:wordAttemptId
export const updateWordAttempt = (
  wordAttemptId: string,
  progress: WordAttemptProgress,
  imageApprovalStatus: string,
) => {
  return axiosAuth.put(`${API_URL}/word_attempts/${wordAttemptId}`, {
    progress,
    imageApprovalStatus,
  });
};

// POST /word_attempts/:wordAttemptId/personalised_image
export const uploadPersonalisedImage = (wordAttemptId: string, image: File) => {
  const formData = new FormData();
  formData.append("personalisedImage", image);
  return axiosAuth.post(
    `${API_URL}/word_attempts/${wordAttemptId}/personalised_image`,
    formData,
  );
};

// POST /quiz_attempts
export const createNewQuizAttempt = (
  wordAttemptId: string,
  scoreOne = 0,
  scoreTwo = 0,
) => {
  return axiosAuth.post<QuizAttempt>(`${API_URL}/quiz_attempts`, {
    wordAttemptId,
    scoreOne,
    scoreTwo,
  });
};

// PUT /quiz_attempts/:quizAttemptId
export const updateQuizAttempt = (
  quizAttemptId: string,
  scoreOne: number,
  scoreTwo: number,
) => {
  return axiosAuth.put(`${API_URL}/quiz_attempts/${quizAttemptId}`, {
    scoreOne,
    scoreTwo,
  });
};

// GET /quiz_attempts/:quizAttemptId
export const getQuizAttempt = (quizAttemptId: string) => {
  return axiosAuth.get<QuizAttempt>(
    `${API_URL}/quiz_attempts/${quizAttemptId}`,
  );
};
