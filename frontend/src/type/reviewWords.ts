import { OptionData } from "./appSelect";
import { DifficultyLevel } from "./wordBank";

export enum SortOrder {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

export enum Sort {
  NONE = "No Sort",
  LAST_REVIEWED = "Last Reviewed",
  ALPHABETICAL_ORDER = "Alphabetical Order",
  DIFFICULTY = "Difficulty",
}

export interface WordData {
  id: string;
  lessonWordId?: string;
  wordFilter: string;
  difficulty: DifficultyLevel;
  sentence: string;
  lastEditedFilter: Date | null;
  lastReviewedFilter: Date | null;
  imagePath: string;
  audioPath: string;
}

export interface SortOptions {
  optionData: OptionData;
}
