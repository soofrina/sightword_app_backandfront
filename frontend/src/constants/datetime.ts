export const Day = {
  Sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
};

export const getDayNumericValue = (day: string) => {
  return daysOfWeek.indexOf(day);
};
export const NumberToDay: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const daysOfWeek = Object.keys(Day);

export const DayToDate: { [key: string]: Date } = {
  Monday: new Date("2019-01-14"),
  Tuesday: new Date("2019-01-15"),
  Wednesday: new Date("2019-01-16"),
  Thursday: new Date("2019-01-17"),
  Friday: new Date("2019-01-18"),
  Saturday: new Date("2019-01-19"),
  Sunday: new Date("2019-01-20"),
};

export const DateToDateString = (date: Date) => {
  const toCovert = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  } as const;
  return new Intl.DateTimeFormat("en-SG", options).format(toCovert);
};

export const DateToFullDateString = (date: Date) => {
  const toCovert = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  return new Intl.DateTimeFormat("en-SG", options).format(toCovert);
};

export const getDayNameFromDate = (date: Date): string => {
  const toCovert = new Date(date);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[toCovert.getDay()];
};

export const getTimeFromDate = (date: Date) => {
  const toCovert = new Date(date);

  let hours = toCovert.getHours();
  const minutes = toCovert.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert from 24-hour to 12-hour format
  hours = hours % 12;
  // Convert "0" to "12"
  hours = hours ? hours : 12;

  // Add leading zero to minutes if needed
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}${ampm}`;
};
