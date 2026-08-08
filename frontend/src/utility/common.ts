// eslint-disable-next-line
import dayjs, { Dayjs } from "dayjs";

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const isEmailValid = (value: string) => {
  return emailRegExp.test(value);
};

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date: Date) => {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
};

export const getAvatar = (name: string) => {
  return `https://api.dicebear.com/6.x/initials/svg?seed=${name}`;
};

export const caps = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTimeText = (time: Dayjs) => {
  return dayjs(time).format("h:mma");
};

export const getMilitaryTimeText = (time: Dayjs) => {
  return dayjs(time).format("HH:mm");
};
