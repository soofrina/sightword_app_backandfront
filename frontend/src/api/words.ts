import { WordData } from "@base/type/dataTypes";
/* eslint-disable camelcase */

import axiosAuth from "./axiosAuth";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const wordValidator = (word: WordData) => {
  if (!word.word) {
    toast.error("Word is required.");
    return false;
  }
  if (!word.sentence) {
    toast.error("Sentence is required.");
    return false;
  }
  if (!word.difficulty) {
    toast.error("Difficulty is required.");
    return false;
  }

  return true;
};

// Queries

export const getAllWords = () => {
  return axiosAuth.get<WordData[]>(`${API_URL}/words`);
};

export const getWordById = (id: string) => {
  return axiosAuth.get<WordData>(`${API_URL}/words/${id}`);
};

export const createWord = async (
  word: WordData,
  image?: File,
  audio?: File,
): Promise<WordData | undefined> => {
  const validWord = wordValidator(word);
  if (!validWord) return undefined;

  if (!image || !audio) {
    toast.error("Please upload both an image and an audio file.");
    return undefined;
  }

  const formData = new FormData();
  formData.append("word", word.word);
  formData.append("definition", word.definition);
  formData.append("sentence", word.sentence);
  formData.append("comment", word.comment ?? "");
  formData.append("difficulty", word.difficulty);
  formData.append("image", image);
  formData.append("audio", audio);
  const resp = await axiosAuth.post<WordData>(`${API_URL}/words`, formData);
  return resp.data;
};

export const updateWord = (
  id: string,
  sentence: string,
  difficulty: string,
  comment: string,
  image?: File,
  audio?: File,
) => {
  const formData = new FormData();
  formData.append("sentence", sentence);
  formData.append("difficulty", difficulty);
  if (comment) formData.append("comment", comment);
  if (image) formData.append("image", image);
  if (audio) formData.append("audio", audio);

  return axiosAuth.post(`${API_URL}/words/${id}`, formData);
};

export const deleteWord = (id: string) => {
  return axiosAuth.delete(`${API_URL}/words/${id}`);
};

export const deleteWordById = (id: string) => {
  return axiosAuth.delete(`${API_URL}/words/${id}`);
};
