export enum DifficultyLevel {
  ShowAll = "Show All",
  Basic = "Basic",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export const difficultyValues: EnumDictionary<DifficultyLevel, number> = {
  [DifficultyLevel.Basic]: 0,
  [DifficultyLevel.Intermediate]: 1,
  [DifficultyLevel.Advanced]: 2,
  [DifficultyLevel.ShowAll]: 3
};

export const sortingOptions = [
  { id: 1, name: "A-Z", value: 1 },
  { id: 2, name: "Z-A", value: -1 },
];
