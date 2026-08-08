import { getDayNumericValue } from "@base/constants/datetime";
import { Class } from "@type/dataTypes";
import dayjs from "dayjs";

export interface SortFilterState {
  sortStrategy: SortStrategyKey;
  filters: ((classes: Class[]) => Class[])[];
}

export interface FilterOption {
  filter: (classes: Class[]) => Class[];
  name: string;
}

export interface SortStrategy {
  name: string;
  sort: (classes: Class[]) => Class[];
}

export interface FilterStrategy {
  name: string;
  filter: (classes: Class[]) => Class[];
}

const sortDayAsc = (classes: Class[]): Class[] => {
  return classes.sort((a, b) => {
    return parseInt(a.day) - parseInt(b.day);
  });
};

const sortDayDesc = (classes: Class[]): Class[] => {
  return classes.sort((a, b) => {
    return parseInt(b.day) - parseInt(a.day);
  });
};

const sortStartTimeAsc = (classes: Class[]): Class[] => {
  return classes.sort((a, b) => {
    const timeA = dayjs(a.startTime).format("HH:mm");
    const timeB = dayjs(b.startTime).format("HH:mm");
    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;
    return 0;
  });
};

const sortStartTimeDesc = (classes: Class[]): Class[] => {
  return classes.sort((a, b) => {
    const timeA = dayjs(a.startTime).format("HH:mm");
    const timeB = dayjs(b.startTime).format("HH:mm");
    if (timeA < timeB) return 1;
    if (timeA > timeB) return -1;
    return 0;
  });
};

const sortLearningCentreAsc = (classes: Class[]): Class[] => {
  return classes.sort((a, b) => {
    if (a.learningCentre && b.learningCentre) {
      return a.learningCentre.localeCompare(b.learningCentre);
    } else {
      return 0;
    }
  });
};

const sortLearningCentreDesc = (classes: Class[]): Class[] => {
  return classes.sort((a, b) => {
    if (a.learningCentre && b.learningCentre) {
      return b.learningCentre.localeCompare(a.learningCentre);
    } else {
      return 0;
    }
  });
};

export enum SortStrategyKey {
  SORT_DAY_ASC = "SORT_DAY_ASC",
  SORT_DAY_DESC = "SORT_DAY_DESC",
  SORT_START_TIME_ASC = "SORT_START_TIME_ASC",
  SORT_START_TIME_DESC = "SORT_START_TIME_DESC",
  SORT_LEARNING_CENTRE_ASC = "SORT_LEARNING_CENTRE_ASC",
  SORT_LEARNING_CENTRE_DESC = "SORT_LEARNING_CENTRE_DESC",
}

export const sortStrategies: { [key in SortStrategyKey]: SortStrategy } = {
  [SortStrategyKey.SORT_DAY_ASC]: {
    name: "Day Sun->Sat",
    sort: sortDayAsc,
  },
  [SortStrategyKey.SORT_DAY_DESC]: {
    name: "Day Sat->Sun",
    sort: sortDayDesc,
  },
  [SortStrategyKey.SORT_START_TIME_ASC]: {
    name: "Start Time Ascending",
    sort: sortStartTimeAsc,
  },
  [SortStrategyKey.SORT_START_TIME_DESC]: {
    name: "Start Time Descending",
    sort: sortStartTimeDesc,
  },
  [SortStrategyKey.SORT_LEARNING_CENTRE_ASC]: {
    name: "Learning Centre A-Z",
    sort: sortLearningCentreAsc,
  },
  [SortStrategyKey.SORT_LEARNING_CENTRE_DESC]: {
    name: "Learning Centre Z-A",
    sort: sortLearningCentreDesc,
  },
};
